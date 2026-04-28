package com.cinema.booking.repository.catalog;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cinema.booking.dto.catalog.ShowtimeAvailabilityView;
import com.cinema.booking.dto.booking.SeatMapShowtimeView;
import com.cinema.booking.dto.catalog.ShowtimeVisibilityView;
import com.cinema.booking.model.catalog.Showtime;

import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Integer> {
    
    @Query("SELECT s FROM Showtime s JOIN FETCH s.movie")
    List<Showtime> findAllWithMovie();

    @Query("SELECT s FROM Showtime s JOIN FETCH s.movie LEFT JOIN FETCH s.showroom ORDER BY s.showdate ASC, s.showtime ASC")
    List<Showtime> findAllWithMovieAndShowroom();

    @Query(value = """
        SELECT
            s.show_id AS showtimeId,
            s.show_date AS showdate,
            s.start_time AS showtime,
            s.movie_id AS movieId,
            COALESCE(sr.room_name, 'TBD') AS showroomName,
            COALESCE(sr.total_seats, 0) AS totalSeats,
            COALESCE(bt.bookedSeats, 0) AS bookedSeats,
            GREATEST(COALESCE(sr.total_seats, 0) - COALESCE(bt.bookedSeats, 0) - COALESCE(rs.reservedSeats, 0), 0) AS availableSeats
        FROM shows s
        LEFT JOIN showrooms sr ON sr.room_id = s.showroom_id
        LEFT JOIN (
            SELECT b.show_id AS show_id, COUNT(t.ticket_id) AS bookedSeats
            FROM bookings b
            LEFT JOIN tickets t ON t.booking_id = b.booking_id
            GROUP BY b.show_id
        ) bt ON bt.show_id = s.show_id
        LEFT JOIN (
            SELECT r.show_id AS show_id, COUNT(*) AS reservedSeats
            FROM seat_reservations r
            WHERE r.expires_at > NOW()
            GROUP BY r.show_id
        ) rs ON rs.show_id = s.show_id
        WHERE s.movie_id = :movieId
        GROUP BY s.show_id, s.show_date, s.start_time, s.movie_id, sr.room_name, sr.total_seats, bt.bookedSeats, rs.reservedSeats
        ORDER BY s.show_date, s.start_time
        """, nativeQuery = true)
    List<ShowtimeVisibilityView> findVisibilityByMovieId(@Param("movieId") Integer movieId);

    @Query(value = """
        SELECT
            s.show_id AS showtimeId,
            COALESCE(sr.total_seats, 0) AS totalSeats,
            COALESCE(bt.bookedSeats, 0) AS bookedSeats,
            GREATEST(COALESCE(sr.total_seats, 0) - COALESCE(bt.bookedSeats, 0) - COALESCE(rs.reservedSeats, 0), 0) AS availableSeats
        FROM shows s
        LEFT JOIN showrooms sr ON sr.room_id = s.showroom_id
        LEFT JOIN (
            SELECT b.show_id AS show_id, COUNT(t.ticket_id) AS bookedSeats
            FROM bookings b
            LEFT JOIN tickets t ON t.booking_id = b.booking_id
            GROUP BY b.show_id
        ) bt ON bt.show_id = s.show_id
        LEFT JOIN (
            SELECT r.show_id AS show_id, COUNT(*) AS reservedSeats
            FROM seat_reservations r
            WHERE r.expires_at > NOW()
            GROUP BY r.show_id
        ) rs ON rs.show_id = s.show_id
        WHERE s.show_id = :showtimeId
        GROUP BY s.show_id, sr.total_seats, bt.bookedSeats, rs.reservedSeats
        """, nativeQuery = true)
    ShowtimeAvailabilityView findAvailabilityByShowtimeId(@Param("showtimeId") Integer showtimeId);

    @Query(value = """
        SELECT
            s.show_id AS showtimeId,
            COALESCE(sr.room_id, 0) AS showroomId,
            COALESCE(sr.room_name, 'TBD') AS showroomName,
            COALESCE(sr.total_seats, 0) AS totalSeats,
            COALESCE(bt.bookedSeats, 0) AS bookedSeats,
            GREATEST(COALESCE(sr.total_seats, 0) - COALESCE(bt.bookedSeats, 0) - COALESCE(rs.reservedSeats, 0), 0) AS availableSeats
        FROM shows s
        LEFT JOIN showrooms sr ON sr.room_id = s.showroom_id
        LEFT JOIN (
            SELECT b.show_id AS show_id, COUNT(t.ticket_id) AS bookedSeats
            FROM bookings b
            LEFT JOIN tickets t ON t.booking_id = b.booking_id
            GROUP BY b.show_id
        ) bt ON bt.show_id = s.show_id
        LEFT JOIN (
            SELECT r.show_id AS show_id, COUNT(*) AS reservedSeats
            FROM seat_reservations r
            WHERE r.expires_at > NOW()
            GROUP BY r.show_id
        ) rs ON rs.show_id = s.show_id
        WHERE s.show_id = :showtimeId
        GROUP BY s.show_id, sr.room_id, sr.room_name, sr.total_seats, bt.bookedSeats, rs.reservedSeats
        """, nativeQuery = true)
    SeatMapShowtimeView findSeatMapByShowtimeId(@Param("showtimeId") Integer showtimeId);

    boolean existsByShowtimeAndShowdateAndShowroom_RoomId(LocalTime showtime, LocalDate showdate, Integer showroomId);

    boolean existsByMovieMovieId(Integer movieId);
}