package com.cinema.booking.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ShowtimeVisibilityResponse {
    private Integer showtimeId;
    private LocalTime showtime;
    private LocalDate showdate;
    private Integer movieId;
    private String showroomName;
    private Integer totalSeats;
    private Long bookedSeats;
    private Long availableSeats;

    public ShowtimeVisibilityResponse() {
    }

    public ShowtimeVisibilityResponse(Integer showtimeId, LocalTime showtime, LocalDate showdate, Integer movieId,
                                      String showroomName, Integer totalSeats, Long bookedSeats, Long availableSeats) {
        this.showtimeId = showtimeId;
        this.showtime = showtime;
        this.showdate = showdate;
        this.movieId = movieId;
        this.showroomName = showroomName;
        this.totalSeats = totalSeats;
        this.bookedSeats = bookedSeats;
        this.availableSeats = availableSeats;
    }

    public Integer getShowtimeId() {
        return showtimeId;
    }

    public LocalTime getShowtime() {
        return showtime;
    }

    public LocalDate getShowdate() {
        return showdate;
    }

    public Integer getMovieId() {
        return movieId;
    }

    public String getShowroomName() {
        return showroomName;
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
