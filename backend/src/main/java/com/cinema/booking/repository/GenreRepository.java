package com.cinema.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cinema.booking.model.Genre;

public interface GenreRepository extends JpaRepository<Genre, Integer>  {
    
}
