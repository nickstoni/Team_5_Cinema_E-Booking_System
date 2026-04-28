package com.cinema.booking.repository.booking;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinema.booking.model.booking.Seat;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
    List<Seat> findByShowroom_RoomIdOrderByRowLabelAscSeatNumberAsc(Integer roomId);

    Optional<Seat> findByShowroom_RoomIdAndRowLabelAndSeatNumber(Integer roomId, String rowLabel, Integer seatNumber);
}
