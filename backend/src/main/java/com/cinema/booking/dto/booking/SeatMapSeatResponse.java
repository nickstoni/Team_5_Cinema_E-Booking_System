package com.cinema.booking.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatMapSeatResponse {
    private Integer seatId;
    private String seatLabel;
    private Integer seatNumber;
    private String status;
}
