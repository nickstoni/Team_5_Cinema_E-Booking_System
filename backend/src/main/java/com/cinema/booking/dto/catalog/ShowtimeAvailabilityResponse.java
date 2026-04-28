package com.cinema.booking.dto.catalog;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeAvailabilityResponse {
    private Integer showtimeId;
    private Integer totalSeats;
    private Long bookedSeats;
    private Long availableSeats;
}
