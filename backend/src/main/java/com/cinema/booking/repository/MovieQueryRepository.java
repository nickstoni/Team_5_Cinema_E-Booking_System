package com.cinema.booking.repository;

import com.cinema.booking.model.Movie;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MovieQueryRepository extends Repository<Movie, Integer> {

    @Query(value = """
        SELECT m.*
        FROM movies m
        JOIN movie_genres mg ON m.movie_id = mg.movie_id
        JOIN genres g ON mg.genre_id = g.genre_id
        WHERE LOWER(g.genre_name) = LOWER(:genre)
        """, nativeQuery = true)
    List<Movie> findMoviesByGenre(@Param("genre") String genre);
}