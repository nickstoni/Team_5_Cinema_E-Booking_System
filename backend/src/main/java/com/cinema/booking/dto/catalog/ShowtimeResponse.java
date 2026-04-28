package com.cinema.booking.dto.catalog;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeResponse {
        private Integer showtimeId;
        private LocalTime showtime;
        private LocalDate showdate;
        private Integer durationMins;
        private Integer movieId;
        private String movieTitle;
        private Integer showroomId;
        private String showroomName;
        private Integer totalSeats;
}
