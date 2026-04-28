package com.cinema.booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import com.cinema.booking.model.Movie;

public interface MovieRepository extends JpaRepository<Movie, Integer> {

    @Query("SELECT DISTINCT m FROM Movie m LEFT JOIN FETCH m.genresSet ORDER BY m.movieId ASC")
    List<Movie> findAllWithGenres();

    @Query("SELECT DISTINCT m FROM Movie m LEFT JOIN FETCH m.genresSet WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%')) ORDER BY m.movieId ASC")
    List<Movie> searchByTitleWithGenres(@Param("search") String search);
}