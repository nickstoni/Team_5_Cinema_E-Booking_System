package com.cinema.booking.model;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "showtimes")

public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int showtimeId;

    private String showtime;

    @ManyToOne
    @JoinColumn(name = "movie_id")

    private Movie movie;

    public Showtime() {}

    public int getShowtimeId() {
        return showtimeId;
    }
    
    public String getShowtime() {
        return showtime;
    }
    public void setShowtime(String showtime) {
        this.showtime = showtime;
    }

    public Movie getMovie() {
        return movie;
    }

}
