package com.cinema.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminShowtimeResponse {

    private Integer showtimeId;
    private String movieTitle;
    private String showroomName;
    private LocalDate showDate;
    private LocalTime startTime;
    private Integer durationMins;
    private Integer totalSeats;
}
