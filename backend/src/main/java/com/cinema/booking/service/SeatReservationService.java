package com.cinema.booking.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.cinema.booking.dto.SeatMapResponse;
import com.cinema.booking.dto.SeatMapRowResponse;
import com.cinema.booking.dto.SeatMapSeatResponse;
import com.cinema.booking.dto.SeatMapShowtimeView;
import com.cinema.booking.dto.SeatReservationResponse;
import com.cinema.booking.dto.ReservationEmailRequest;
import com.cinema.booking.model.Seat;
import com.cinema.booking.model.SeatReservation;
import com.cinema.booking.repository.SeatRepository;
import com.cinema.booking.repository.SeatReservationRepository;
import com.cinema.booking.repository.ShowtimeRepository;
import com.cinema.booking.repository.TicketRepository;

@Service
public class SeatReservationService {

    private static final long HOLD_MINUTES = 5;

    private final ShowtimeRepository showtimeRepository;
    private final SeatRepository seatRepository;
    private final TicketRepository ticketRepository;
    private final SeatReservationRepository seatReservationRepository;
    private final EmailService emailService;

    public SeatReservationService(
            ShowtimeRepository showtimeRepository,
            SeatRepository seatRepository,
            TicketRepository ticketRepository,
            SeatReservationRepository seatReservationRepository,
            EmailService emailService) {
        this.showtimeRepository = showtimeRepository;
        this.seatRepository = seatRepository;
        this.ticketRepository = ticketRepository;
        this.seatReservationRepository = seatReservationRepository;
        this.emailService = emailService;
    }

    @Transactional(readOnly = true)
    public SeatMapResponse buildSeatMap(Integer showtimeId, String reservationToken) {
        SeatMapShowtimeView showtime = showtimeRepository.findSeatMapByShowtimeId(showtimeId);
        if (showtime == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Showtime not found");
        }

        List<Seat> seats = seatRepository.findByShowroom_RoomIdOrderByRowLabelAscSeatNumberAsc(showtime.getShowroomId());
        Set<Integer> occupiedSeatSet = ticketRepository.findOccupiedSeatIdsByShowtimeId(showtimeId)
                .stream().filter(id -> id != null && id > 0).collect(Collectors.toSet());
        Map<Integer, SeatReservation> activeReservations = seatReservationRepository
                .findActiveReservationsByShowtimeId(showtimeId, now())
                .stream()
                .collect(Collectors.toMap(SeatReservation::getSeatId, reservation -> reservation, (first, second) -> first));

        Map<String, List<SeatMapSeatResponse>> seatsByRow = new LinkedHashMap<>();
        for (Seat seat : seats) {
            String seatLabel = seat.getRowLabel() + seat.getSeatNumber();
            String status = "available";
            if (occupiedSeatSet.contains(seat.getSeatId())) {
                status = "occupied";
            } else {
                SeatReservation reservation = activeReservations.get(seat.getSeatId());
                if (reservation != null) {
                    status = reservationToken != null && reservationToken.equals(reservation.getReservationToken())
                            ? "selected"
                            : "reserved";
                }
            }

            SeatMapSeatResponse seatResponse = new SeatMapSeatResponse(
                    seat.getSeatId(),
                    seatLabel,
                    seat.getSeatNumber(),
                    status);
            seatsByRow.computeIfAbsent(seat.getRowLabel(), key -> new ArrayList<>()).add(seatResponse);
        }

        List<SeatMapRowResponse> rows = seatsByRow.entrySet().stream()
                .map(entry -> new SeatMapRowResponse(
                        entry.getKey(),
                        entry.getValue().stream()
                                .sorted(Comparator.comparing(SeatMapSeatResponse::getSeatNumber))
                                .toList()))
                .toList();

        return new SeatMapResponse(
                showtime.getShowtimeId(),
                showtime.getShowroomId(),
                showtime.getShowroomName(),
                showtime.getTotalSeats(),
                showtime.getBookedSeats(),
                showtime.getAvailableSeats(),
                rows);
    }

    @Transactional
    public SeatReservationResponse reserveSeats(Integer showtimeId, String reservationToken, List<String> seatLabels) {
        if (seatLabels == null || seatLabels.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one seat is required");
        }

        SeatMapShowtimeView showtime = showtimeRepository.findSeatMapByShowtimeId(showtimeId);
        if (showtime == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Showtime not found");
        }

        cleanupExpiredReservations();
        String effectiveToken = (reservationToken == null || reservationToken.isBlank())
                ? UUID.randomUUID().toString()
                : reservationToken;

        Map<String, Seat> seatLookup = resolveSeatsForShowroom(showtime.getShowroomId(), seatLabels);
        List<Integer> seatIds = new ArrayList<>(seatLookup.values().stream().map(Seat::getSeatId).toList());

        Set<Integer> occupiedSeatSet = ticketRepository.findOccupiedSeatIdsByShowtimeId(showtimeId)
                .stream().filter(id -> id != null && id > 0).collect(Collectors.toSet());
        for (Integer seatId : seatIds) {
            if (occupiedSeatSet.contains(seatId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "One or more seats are already booked");
            }
        }

        List<SeatReservation> activeReservations = seatReservationRepository
                .findActiveReservationsByShowtimeIdAndSeatIdIn(showtimeId, seatIds, now());

        for (SeatReservation reservation : activeReservations) {
            if (!effectiveToken.equals(reservation.getReservationToken())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "One or more seats are already reserved");
            }
        }

        LocalDateTime expiresAt = now().plusMinutes(HOLD_MINUTES);
        List<SeatReservation> reservationsToSave = new ArrayList<>();
        for (Seat seat : seatLookup.values()) {
            SeatReservation reservation = activeReservations.stream()
                    .filter(existing -> existing.getSeatId().equals(seat.getSeatId())
                            && effectiveToken.equals(existing.getReservationToken()))
                    .findFirst()
                    .orElseGet(SeatReservation::new);
            reservation.setShowtimeId(showtimeId);
            reservation.setSeatId(seat.getSeatId());
            reservation.setReservationToken(effectiveToken);
            reservation.setExpiresAt(expiresAt);
            if (reservation.getCreatedAt() == null) {
                reservation.setCreatedAt(now());
            }
            reservationsToSave.add(reservation);
        }

        try {
            seatReservationRepository.saveAll(reservationsToSave);
            return new SeatReservationResponse(effectiveToken, expiresAt, new ArrayList<>(seatLabels));
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "One or more seats are already reserved", ex);
        }
    }

    @Transactional
    public void releaseSeat(Integer showtimeId, String reservationToken, String seatLabel) {
        if (reservationToken == null || reservationToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reservationToken is required");
        }

        SeatMapShowtimeView showtime = showtimeRepository.findSeatMapByShowtimeId(showtimeId);
        if (showtime == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Showtime not found");
        }

        Seat seat = resolveSeat(showtime.getShowroomId(), seatLabel);
        seatReservationRepository.deleteByShowtimeIdAndReservationTokenAndSeatId(showtimeId, reservationToken, seat.getSeatId());
    }

    @Transactional
    public void releaseAll(Integer showtimeId, String reservationToken) {
        if (reservationToken == null || reservationToken.isBlank()) {
            return;
        }
        seatReservationRepository.deleteByShowtimeIdAndReservationToken(showtimeId, reservationToken);
    }

    @Transactional(readOnly = true)
    public void sendReservationConfirmationEmail(Integer showtimeId, ReservationEmailRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid email address is required");
        }

        // Ensure showtime exists before sending an email tied to this reservation context.
        buildSeatMap(showtimeId, null);

        try {
            emailService.sendSeatReservationConfirmationEmail(
                    request.getEmail().trim().toLowerCase(),
                    request.getMovieTitle(),
                    request.getShowtimeLabel(),
                    request.getSeatLabels());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to send reservation confirmation email", ex);
        }
    }

    private Seat resolveSeat(Integer showroomId, String seatLabel) {
        if (seatLabel == null || seatLabel.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid seat label");
        }

        String normalized = seatLabel.trim().toUpperCase();
        String rowLabel = normalized.substring(0, 1);
        Integer seatNumber;
        try {
            seatNumber = Integer.parseInt(normalized.substring(1));
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid seat label");
        }

        return seatRepository.findByShowroom_RoomIdAndRowLabelAndSeatNumber(showroomId, rowLabel, seatNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seat does not exist in this showroom"));
    }

    private Map<String, Seat> resolveSeatsForShowroom(Integer showroomId, Collection<String> seatLabels) {
        Map<String, Seat> seatLookup = new LinkedHashMap<>();
        for (String seatLabel : seatLabels) {
            Seat seat = resolveSeat(showroomId, seatLabel);
            seatLookup.put(seatLabel.trim().toUpperCase(), seat);
        }
        return seatLookup;
    }

    @Transactional
    protected void cleanupExpiredReservations() {
        seatReservationRepository.deleteExpired(now());
    }

    private LocalDateTime now() {
        return LocalDateTime.now();
    }
}
