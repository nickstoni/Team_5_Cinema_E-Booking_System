package com.cinema.booking.dto.catalog;

public interface ShowtimeAvailabilityView {
    Integer getShowtimeId();
    Integer getTotalSeats();
    Long getBookedSeats();
    Long getAvailableSeats();
}
