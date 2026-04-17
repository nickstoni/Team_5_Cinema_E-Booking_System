package com.cinema.booking.model;

import java.time.LocalDate;
import java.util.HashSet;
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

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getProducer() { return producer; }
    public void setProducer(String producer) { this.producer = producer; }

    public String getMpaaRating() { return mpaaRating; }
    public void setMpaaRating(String mpaaRating) { this.mpaaRating = mpaaRating; }

    public Integer getDurationMins() { return durationMins; }
    public void setDurationMins(Integer durationMins) { this.durationMins = durationMins; }

    public LocalDate getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }

    public Set<Genre> getGenres() { return genresSet; }
    public void addGenre(Genre genre) { genresSet.add(genre); }
}