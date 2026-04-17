package com.cinema.booking.dto;

public interface ShowtimeAvailabilityView {
    Integer getShowtimeId();
    Integer getTotalSeats();
    Long getBookedSeats();
    Long getAvailableSeats();
}
