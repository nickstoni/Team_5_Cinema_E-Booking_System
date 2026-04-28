package com.cinema.booking.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatMapResponse {
    private Integer showtimeId;
    private Integer showroomId;
    private String showroomName;
    private Integer totalSeats;
    private Long bookedSeats;
    private Long availableSeats;
    private List<SeatMapRowResponse> rows;
}
