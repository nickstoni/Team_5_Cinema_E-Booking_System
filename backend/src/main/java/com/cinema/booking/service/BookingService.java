package com.cinema.booking.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.cinema.booking.dto.CheckoutBookingRequest;
import com.cinema.booking.dto.CheckoutBookingResponse;
import com.cinema.booking.dto.OrderHistoryItemResponse;
import com.cinema.booking.model.Booking;
import com.cinema.booking.model.Seat;
import com.cinema.booking.model.SeatReservation;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.model.Ticket;
import com.cinema.booking.repository.BookingRepository;
import com.cinema.booking.repository.SeatRepository;
import com.cinema.booking.repository.SeatReservationRepository;
import com.cinema.booking.repository.ShowtimeRepository;
import com.cinema.booking.repository.TicketRepository;
import com.cinema.booking.repository.UserRepository;
import com.cinema.booking.service.EmailService;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final SeatRepository seatRepository;
    private final SeatReservationRepository seatReservationRepository;
    private final ShowtimeRepository showtimeRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public BookingService(
            BookingRepository bookingRepository,
            TicketRepository ticketRepository,
            SeatRepository seatRepository,
            SeatReservationRepository seatReservationRepository,
            ShowtimeRepository showtimeRepository,
            UserRepository userRepository,
            EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.seatRepository = seatRepository;
        this.seatReservationRepository = seatReservationRepository;
        this.showtimeRepository = showtimeRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public CheckoutBookingResponse finalizeCheckout(CheckoutBookingRequest request) {
        validateCheckoutRequest(request);

        Integer showtimeId = request.getShowtimeId();
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Showtime not found"));

        if (!userRepository.existsById(request.getUserId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        List<String> normalizedSeatLabels = normalizeSeatLabels(request.getSeatLabels());
        Map<String, Seat> seatMap = resolveSeatsForShowtime(showtime, normalizedSeatLabels);
        List<Integer> seatIds = seatMap.values().stream().map(Seat::getSeatId).toList();

        Set<Integer> occupiedSeatSet = ticketRepository.findOccupiedSeatIdsByShowtimeId(showtimeId)
                .stream().filter(id -> id != null && id > 0).collect(Collectors.toSet());
        boolean alreadyBooked = seatIds.stream().anyMatch(occupiedSeatSet::contains);
        if (alreadyBooked) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "One or more seats are already booked");
        }

        List<SeatReservation> activeReservations = seatReservationRepository
                .findActiveReservationsByShowtimeIdAndReservationToken(showtimeId, request.getReservationToken(), LocalDateTime.now());

        Set<Integer> reservedSeatIds = activeReservations.stream().map(SeatReservation::getSeatId).collect(Collectors.toSet());
        boolean ownsAllSeats = seatIds.stream().allMatch(reservedSeatIds::contains);
        if (!ownsAllSeats) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Your seat hold has expired or does not include all selected seats");
        }

        int totalTicketCount = computeTotalTickets(request.getTickets());
        if (totalTicketCount != normalizedSeatLabels.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ticket quantity must match selected seats");
        }

        BigDecimal tax = coalesceMoney(request.getTax());
        BigDecimal total = coalesceMoney(request.getTotal());

        Booking booking = new Booking();
        booking.setBookingNumber(generateBookingNumber());
        booking.setBookingDate(LocalDateTime.now());
        booking.setTotalAmount(total);
        booking.setOnlineBookingFee(BigDecimal.ZERO);
        booking.setTax(tax);
        booking.setPaymentReference("PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setStatus("confirmed");
        booking.setShowId(showtimeId);
        booking.setUserId(request.getUserId());

        Booking savedBooking = bookingRepository.save(booking);

        List<Ticket> ticketsToSave = buildTickets(savedBooking.getBookingId(), seatMap, normalizedSeatLabels, request.getTickets());
        ticketRepository.saveAll(ticketsToSave);

        seatReservationRepository.deleteByShowtimeIdAndReservationToken(showtimeId, request.getReservationToken());

        String movieTitle = showtime.getMovie() != null ? showtime.getMovie().getTitle() : "Selected Movie";
        String showtimeLabel = formatShowtimeLabel(showtime);

        try {
            emailService.sendOrderConfirmationEmail(
                    request.getConfirmationEmail().trim().toLowerCase(),
                    savedBooking.getBookingNumber(),
                    movieTitle,
                    showtimeLabel,
                    normalizedSeatLabels,
                    total);
        } catch (Exception ex) {
            // Do not rollback a successful booking if email fails.
        }

        return new CheckoutBookingResponse(
                savedBooking.getBookingId(),
                savedBooking.getBookingNumber(),
                movieTitle,
                showtimeLabel,
                normalizedSeatLabels,
                total);
    }

    @Transactional(readOnly = true)
    public List<OrderHistoryItemResponse> getOrderHistory(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
        if (bookings.isEmpty()) {
            return List.of();
        }

        List<Integer> bookingIds = bookings.stream().map(Booking::getBookingId).toList();
        List<Ticket> allTickets = new ArrayList<>();
        for (Integer bookingId : bookingIds) {
            allTickets.addAll(ticketRepository.findByBookingId(bookingId));
        }

        Map<Integer, List<Ticket>> ticketsByBooking = allTickets.stream()
                .collect(Collectors.groupingBy(Ticket::getBookingId));

        Map<Integer, Seat> seatById = new HashMap<>();
        List<Integer> seatIds = allTickets.stream().map(Ticket::getSeatId).filter(id -> id != null && id > 0).distinct().toList();
        seatRepository.findAllById(seatIds).forEach(seat -> seatById.put(seat.getSeatId(), seat));

        return bookings.stream().map(booking -> {
            Showtime showtime = showtimeRepository.findById(booking.getShowId()).orElse(null);
            String movieTitle = (showtime != null && showtime.getMovie() != null) ? showtime.getMovie().getTitle() : "Unknown Movie";

            List<String> seatLabels = ticketsByBooking.getOrDefault(booking.getBookingId(), List.of())
                    .stream()
                    .map(ticket -> toSeatLabel(seatById.get(ticket.getSeatId())))
                    .filter(label -> label != null && !label.isBlank())
                    .toList();

            return new OrderHistoryItemResponse(
                    booking.getBookingId(),
                    booking.getBookingNumber(),
                    booking.getStatus(),
                    booking.getBookingDate(),
                    movieTitle,
                    showtime != null ? showtime.getShowdate() : null,
                    showtime != null ? showtime.getShowtime() : null,
                    seatLabels,
                    booking.getTotalAmount());
        }).toList();
    }

    private void validateCheckoutRequest(CheckoutBookingRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Checkout request is required");
        }
        if (request.getUserId() == null || request.getUserId() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid userId is required");
        }
        if (request.getShowtimeId() == null || request.getShowtimeId() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid showtimeId is required");
        }
        if (request.getReservationToken() == null || request.getReservationToken().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "reservationToken is required");
        }
        if (request.getConfirmationEmail() == null || request.getConfirmationEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "confirmationEmail is required");
        }
        if (request.getSeatLabels() == null || request.getSeatLabels().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one seat is required");
        }
        if (request.getTickets() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ticket breakdown is required");
        }
    }

    private List<String> normalizeSeatLabels(List<String> seatLabels) {
        return seatLabels.stream()
                .filter(label -> label != null && !label.isBlank())
                .map(label -> label.trim().toUpperCase())
                .distinct()
                .toList();
    }

    private Map<String, Seat> resolveSeatsForShowtime(Showtime showtime, List<String> normalizedSeatLabels) {
        Integer showroomId = (showtime.getShowroom() != null) ? showtime.getShowroom().getRoomId() : null;
        if (showroomId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Showroom is not assigned for this showtime");
        }

        Map<String, Seat> seatMap = new HashMap<>();
        for (String label : normalizedSeatLabels) {
            if (label.length() < 2) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid seat label: " + label);
            }
            String row = label.substring(0, 1);
            Integer seatNumber;
            try {
                seatNumber = Integer.parseInt(label.substring(1));
            } catch (NumberFormatException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid seat label: " + label);
            }

            Seat seat = seatRepository.findByShowroom_RoomIdAndRowLabelAndSeatNumber(showroomId, row, seatNumber)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seat does not exist: " + label));
            seatMap.put(label, seat);
        }
        return seatMap;
    }

    private int computeTotalTickets(CheckoutBookingRequest.TicketBreakdown tickets) {
        int adult = sanitizeQuantity(tickets.getAdult());
        int child = sanitizeQuantity(tickets.getChild());
        int senior = sanitizeQuantity(tickets.getSenior());
        return adult + child + senior;
    }

    private int sanitizeQuantity(CheckoutBookingRequest.TicketLine line) {
        return (line == null || line.getQuantity() == null || line.getQuantity() < 0) ? 0 : line.getQuantity();
    }

    private BigDecimal sanitizePrice(CheckoutBookingRequest.TicketLine line) {
        if (line == null || line.getPrice() == null) {
            return BigDecimal.ZERO;
        }
        return line.getPrice().max(BigDecimal.ZERO);
    }

    private List<Ticket> buildTickets(
            Integer bookingId,
            Map<String, Seat> seatMap,
            List<String> normalizedSeatLabels,
            CheckoutBookingRequest.TicketBreakdown breakdown) {

        List<TicketSpec> specs = new ArrayList<>();
        appendTicketSpecs(specs, "adult", sanitizeQuantity(breakdown.getAdult()), sanitizePrice(breakdown.getAdult()));
        appendTicketSpecs(specs, "child", sanitizeQuantity(breakdown.getChild()), sanitizePrice(breakdown.getChild()));
        appendTicketSpecs(specs, "senior", sanitizeQuantity(breakdown.getSenior()), sanitizePrice(breakdown.getSenior()));

        List<Ticket> tickets = new ArrayList<>();
        for (int i = 0; i < normalizedSeatLabels.size(); i++) {
            String seatLabel = normalizedSeatLabels.get(i);
            Seat seat = seatMap.get(seatLabel);
            TicketSpec spec = specs.get(i);

            Ticket ticket = new Ticket();
            ticket.setBookingId(bookingId);
            ticket.setSeatId(seat.getSeatId());
            ticket.setTicketType(spec.type());
            ticket.setBasePrice(spec.price());
            ticket.setTicketNumber("TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            tickets.add(ticket);
        }
        return tickets;
    }

    private void appendTicketSpecs(List<TicketSpec> specs, String type, int quantity, BigDecimal price) {
        for (int i = 0; i < quantity; i++) {
            specs.add(new TicketSpec(type, price));
        }
    }

    private String generateBookingNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String suffix = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "BK-" + timestamp + "-" + suffix;
    }

    private String formatShowtimeLabel(Showtime showtime) {
        String date = showtime.getShowdate() != null ? showtime.getShowdate().toString() : "Unknown date";
        String time = showtime.getShowtime() != null ? showtime.getShowtime().toString() : "Unknown time";
        String room = (showtime.getShowroom() != null && showtime.getShowroom().getRoomName() != null)
                ? showtime.getShowroom().getRoomName()
                : "TBD";
        return date + " at " + time + " (Room " + room + ")";
    }

    private String toSeatLabel(Seat seat) {
        if (seat == null || seat.getRowLabel() == null || seat.getSeatNumber() == null) {
            return null;
        }
        return seat.getRowLabel() + seat.getSeatNumber();
    }

    private BigDecimal coalesceMoney(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private record TicketSpec(String type, BigDecimal price) {
    }
}
