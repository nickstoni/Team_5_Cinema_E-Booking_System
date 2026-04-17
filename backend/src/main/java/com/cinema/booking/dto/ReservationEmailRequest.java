package com.cinema.booking.dto;

import java.util.List;

public class ReservationEmailRequest {
    private String email;
    private String movieTitle;
    private String showtimeLabel;
    private List<String> seatLabels;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getShowtimeLabel() {
        return showtimeLabel;
    }

    public void setShowtimeLabel(String showtimeLabel) {
        this.showtimeLabel = showtimeLabel;
    }

    public List<String> getSeatLabels() {
        return seatLabels;
    }

    public void setSeatLabels(List<String> seatLabels) {
        this.seatLabels = seatLabels;
    }
}
