package com.cinema.booking.dto.show;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowResponse {
        private Integer showtimeId;
        private Integer movieId;
        private Integer showroomId;
        private LocalDate showDate;
        private LocalTime startTime;
}
