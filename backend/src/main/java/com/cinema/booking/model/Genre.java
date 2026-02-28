package com.cinema.booking.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "genres")
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer genreId;

    @ManyToMany(mappedBy = "genres")

    @JsonIgnore
    private Set<Movie> movies = new HashSet<>();

    private String genreName;

    public Genre() {}

    public Integer getGenreId() {
        return genreId;
    }

    public String getGenreName() {
        return genreName;
    }
    public void setGenreName(String genreName) {
        this.genreName = genreName;
    }
}