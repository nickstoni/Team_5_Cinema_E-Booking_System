package com.cinema.booking.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationEmailRequest {
    private String email;
    private String movieTitle;
    private String showtimeLabel;
    private List<String> seatLabels;
}
