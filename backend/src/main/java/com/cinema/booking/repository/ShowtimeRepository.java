package com.cinema.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cinema.booking.dto.ShowtimeVisibilityView;
import com.cinema.booking.model.Showtime;

import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Integer> {
    
    @Query("SELECT s FROM Showtime s JOIN FETCH s.movie")
    List<Showtime> findAllWithMovie();

    @Query(value = """
        SELECT
            s.show_id AS showtimeId,
            s.show_date AS showdate,
            s.start_time AS showtime,
            s.movie_id AS movieId,
            COALESCE(sr.room_name, 'TBD') AS showroomName,
            COALESCE(sr.total_seats, 0) AS totalSeats,
            COALESCE(COUNT(t.ticket_id), 0) AS bookedSeats,
            GREATEST(COALESCE(sr.total_seats, 0) - COALESCE(COUNT(t.ticket_id), 0), 0) AS availableSeats
        FROM shows s
        LEFT JOIN showrooms sr ON sr.room_id = s.showroom_id
        LEFT JOIN bookings b ON b.show_id = s.show_id
        LEFT JOIN tickets t ON t.booking_id = b.booking_id
        WHERE s.movie_id = :movieId
        GROUP BY s.show_id, s.show_date, s.start_time, s.movie_id, sr.room_name, sr.total_seats
        ORDER BY s.show_date, s.start_time
        """, nativeQuery = true)
    List<ShowtimeVisibilityView> findVisibilityByMovieId(@Param("movieId") Integer movieId);
}