package com.cinema.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.cinema.booking.model.Showtime;

import java.time.LocalDate;
import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Integer> {
    
    @Query("SELECT s FROM Showtime s JOIN FETCH s.movie")
    List<Showtime> findAllWithMovie();
}