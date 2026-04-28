package com.cinema.booking.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatReservationRequest {
    private String reservationToken;
    private List<String> seatLabels;
}
