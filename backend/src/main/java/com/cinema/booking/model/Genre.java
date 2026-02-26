package com.cinema.booking.model;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "genres")
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int genreId;

    @ManyToMany(mappedBy = "genres")
    
    @JsonIgnore
    private Set<Movie> movies;

    private String genreName;

    public Genre() {}

    public int getGenreId() {
        return genreId;
    }

    public String getGenreName() {
        return genreName;
    }
    public void setGenreName(String genreName) {
        this.genreName = genreName;
    }
}