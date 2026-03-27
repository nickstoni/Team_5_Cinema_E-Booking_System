package com.cinema.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinema.booking.model.Movie;

public interface MovieRepository extends JpaRepository<Movie, Integer> {
}