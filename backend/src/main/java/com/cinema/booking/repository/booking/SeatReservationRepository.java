package com.cinema.booking.repository.booking;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cinema.booking.model.booking.SeatReservation;

public interface SeatReservationRepository extends JpaRepository<SeatReservation, Integer> {

    @Query("SELECT r FROM SeatReservation r WHERE r.showtimeId = :showtimeId AND r.expiresAt > :now")
    List<SeatReservation> findActiveReservationsByShowtimeId(@Param("showtimeId") Integer showtimeId, @Param("now") LocalDateTime now);

    @Query("SELECT r FROM SeatReservation r WHERE r.showtimeId = :showtimeId AND r.seatId IN :seatIds AND r.expiresAt > :now")
    List<SeatReservation> findActiveReservationsByShowtimeIdAndSeatIdIn(
            @Param("showtimeId") Integer showtimeId,
            @Param("seatIds") Collection<Integer> seatIds,
            @Param("now") LocalDateTime now);

    @Query("SELECT r FROM SeatReservation r WHERE r.showtimeId = :showtimeId AND r.reservationToken = :reservationToken AND r.expiresAt > :now")
    List<SeatReservation> findActiveReservationsByShowtimeIdAndReservationToken(
            @Param("showtimeId") Integer showtimeId,
            @Param("reservationToken") String reservationToken,
            @Param("now") LocalDateTime now);

    @Modifying
    @Query("DELETE FROM SeatReservation r WHERE r.expiresAt <= :now")
    void deleteExpired(@Param("now") LocalDateTime now);

    @Modifying
    @Query("DELETE FROM SeatReservation r WHERE r.showtimeId = :showtimeId AND r.reservationToken = :reservationToken")
    void deleteByShowtimeIdAndReservationToken(@Param("showtimeId") Integer showtimeId, @Param("reservationToken") String reservationToken);

    @Modifying
    @Query("DELETE FROM SeatReservation r WHERE r.showtimeId = :showtimeId AND r.reservationToken = :reservationToken AND r.seatId = :seatId")
    void deleteByShowtimeIdAndReservationTokenAndSeatId(
            @Param("showtimeId") Integer showtimeId,
            @Param("reservationToken") String reservationToken,
            @Param("seatId") Integer seatId);
}
