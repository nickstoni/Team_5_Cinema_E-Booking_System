package com.cinema.booking.dto;

import java.time.LocalDateTime;
import java.util.List;

public class SeatReservationResponse {
    private String reservationToken;
    private LocalDateTime expiresAt;
    private List<String> seatLabels;

    public SeatReservationResponse(String reservationToken, LocalDateTime expiresAt, List<String> seatLabels) {
        this.reservationToken = reservationToken;
        this.expiresAt = expiresAt;
        this.seatLabels = seatLabels;
    }

    public String getReservationToken() {
        return reservationToken;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public List<String> getSeatLabels() {
        return seatLabels;
    }
}
