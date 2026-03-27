package com.cinema.booking.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;

@Entity
@Table(name = "movies")
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
    private Integer rating;

    @Column(length = 1000)
    private String description;

    private String poster;
    private String trailer;
    private String showAvailability;

    public Movie() {}

    public Integer getMovieId() { return movieId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPoster() { return poster; }
    public void setPoster(String poster) { this.poster = poster; }

    public String getTrailer() { return trailer; }
    public void setTrailer(String trailer) { this.trailer = trailer; }

    public String getShowAvailability() { return showAvailability; }
    public void setShowAvailability(String showAvailability) { this.showAvailability = showAvailability; }

    public Set<Genre> getGenres() { return genresSet; }
    public void addGenre(Genre genre) { genresSet.add(genre); }
}