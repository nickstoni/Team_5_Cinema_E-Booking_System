package com.cinema.booking.dto.booking;

public interface SeatMapShowtimeView {
    Integer getShowtimeId();
    Integer getShowroomId();
    String getShowroomName();
    Integer getTotalSeats();
    Long getBookedSeats();
    Long getAvailableSeats();
}
