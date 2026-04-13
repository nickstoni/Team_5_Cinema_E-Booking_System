package com.cinema.booking.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.cinema.booking.dto.SeatMapResponse;
import com.cinema.booking.dto.SeatReservationRequest;
import com.cinema.booking.dto.SeatReservationResponse;
import com.cinema.booking.service.SeatReservationService;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class SeatReservationController {

    private final SeatReservationService seatReservationService;

    public SeatReservationController(SeatReservationService seatReservationService) {
        this.seatReservationService = seatReservationService;
    }

    @GetMapping("/{showtimeId}/seats")
    public SeatMapResponse getSeatMap(
            @PathVariable Integer showtimeId,
            @RequestParam(required = false) String reservationToken) {
        return seatReservationService.buildSeatMap(showtimeId, reservationToken);
    }

    @PostMapping("/{showtimeId}/seats/reserve")
    public SeatReservationResponse reserveSeats(
            @PathVariable Integer showtimeId,
            @RequestBody SeatReservationRequest request) {
        try {
            return seatReservationService.reserveSeats(showtimeId, request.getReservationToken(), request.getSeatLabels());
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to reserve seats", ex);
        }
    }

    @DeleteMapping("/{showtimeId}/seats/reserve/{seatLabel}")
    public void releaseSeat(
            @PathVariable Integer showtimeId,
            @PathVariable String seatLabel,
            @RequestParam String reservationToken) {
        seatReservationService.releaseSeat(showtimeId, reservationToken, seatLabel);
    }

    @DeleteMapping("/{showtimeId}/seats/reserve")
    public void releaseAll(
            @PathVariable Integer showtimeId,
            @RequestParam String reservationToken) {
        seatReservationService.releaseAll(showtimeId, reservationToken);
    }
}
