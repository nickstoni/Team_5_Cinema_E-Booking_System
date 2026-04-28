package com.cinema.booking.dto.catalog;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeVisibilityResponse {
    private Integer showtimeId;
    private LocalTime showtime;
    private LocalDate showdate;
    private Integer movieId;
    private String showroomName;
    private Integer totalSeats;
    private Long bookedSeats;
    private Long availableSeats;
}
