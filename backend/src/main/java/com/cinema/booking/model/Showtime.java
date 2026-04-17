package com.cinema.booking.model;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.*;

@Entity
@Table(name = "shows")

public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "show_id")
    private Integer showtimeId;

    @Column(name = "start_time")
    private LocalTime showtime;

    @Column(name = "show_date")
    private LocalDate showdate;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "showroom_id")
    private Showroom showroom;

    @Column(name = "duration_mins")
    private Integer durationMins;

    public Showtime() {}

    public Integer getShowtimeId() {
        return showtimeId;
    }
    
    public LocalTime getShowtime() {
        return showtime;
    }
    public void setShowtime(LocalTime showtime) {
        this.showtime = showtime;
    }

    public LocalDate getShowdate() {
        return showdate;
    }
    public void setShowdate(LocalDate showdate) {
        this.showdate = showdate;
    }

    public Movie getMovie() {
        return movie;
    }
    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public Showroom getShowroom() {
        return showroom;
    }
    public void setShowroom(Showroom showroom) {
        this.showroom = showroom;
    }

    public Integer getDurationMins() {
        return durationMins;
    }
    public void setDurationMins(Integer durationMins) {
        this.durationMins = durationMins;
    }

}
