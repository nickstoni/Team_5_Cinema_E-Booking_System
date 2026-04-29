package com.cinema.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public interface ShowtimeVisibilityView {
    Integer getShowtimeId();
    LocalDate getShowdate();
    LocalTime getShowtime();
    Integer getMovieId();
    String getShowroomName();
    Integer getTotalSeats();
    Long getBookedSeats();
    Long getAvailableSeats();
}
