package com.cinema.booking.repository.catalog;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cinema.booking.model.catalog.Genre;

public interface GenreRepository extends JpaRepository<Genre, Integer>  {

    Optional<Genre> findByGenreName(String genreName);
}
