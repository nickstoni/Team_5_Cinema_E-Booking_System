package com.cinema.booking.dto.admin;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddShowtimeRequest {

    @NotNull(message = "Movie ID is required")
    private Integer movieId;

    @NotNull(message = "Show date is required")
    private LocalDate showDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "Showroom ID is required")
    private Integer showroomId;

    private Integer durationMins;
}
