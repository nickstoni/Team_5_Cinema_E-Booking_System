package com.cinema.booking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "favorite_movies")
public class FavoriteMovie {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "favorite_id")
private Integer id;

    private Integer userId;
    private Integer movieId;

    // Getters and Setters

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getMovieId() { return movieId; }
    public void setMovieId(Integer movieId) { this.movieId = movieId; }
}