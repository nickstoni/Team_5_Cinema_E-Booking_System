package com.cinema.booking.dto;

public class ShowtimeAvailabilityResponse {
    private Integer showtimeId;
    private Integer totalSeats;
    private Long bookedSeats;
    private Long availableSeats;

    public ShowtimeAvailabilityResponse() {
    }

    public ShowtimeAvailabilityResponse(Integer showtimeId, Integer totalSeats, Long bookedSeats, Long availableSeats) {
        this.showtimeId = showtimeId;
        this.totalSeats = totalSeats;
        this.bookedSeats = bookedSeats;
        this.availableSeats = availableSeats;
    }

    public Integer getShowtimeId() {
        return showtimeId;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public Long getBookedSeats() {
        return bookedSeats;
    }

    public Long getAvailableSeats() {
        return availableSeats;
    }
}
