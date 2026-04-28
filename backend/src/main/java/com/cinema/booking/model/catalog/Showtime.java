package com.cinema.booking.model.catalog;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;

@Entity
@Table(name = "shows")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
