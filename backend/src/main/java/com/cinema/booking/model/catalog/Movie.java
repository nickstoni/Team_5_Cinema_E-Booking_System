package com.cinema.booking.model.catalog;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
@Data
@EqualsAndHashCode(exclude = "genresSet")
@ToString(exclude = "genresSet")
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer movieId;

    @ManyToMany
    @JoinTable(
        name = "movie_genres",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genresSet = new HashSet<>();

    private String title;

    @Column(name = "user_score")
    private Integer rating;

    @Column(length = 1000)
    private String description;

    private String poster;
    private String trailer;

    @Column(name = "show_availability")
    private String showAvailability;

    private String director;
    private String producer;

    @Column(name = "rating")
    private String mpaaRating;

    @Column(name = "duration_mins")
    private Integer durationMins;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    public Set<Genre> getGenres() { return genresSet; }
    public void addGenre(Genre genre) { genresSet.add(genre); }
}