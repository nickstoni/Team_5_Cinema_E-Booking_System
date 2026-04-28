package com.cinema.booking.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatReservationResponse {
    private String reservationToken;
    private LocalDateTime expiresAt;
    private List<String> seatLabels;
}
