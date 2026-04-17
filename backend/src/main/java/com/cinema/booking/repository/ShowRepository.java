package com.cinema.booking.repository;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinema.booking.model.Showtime;

public interface ShowRepository extends JpaRepository<Showtime, Integer> {
    boolean existsByShowroomRoomIdAndShowdateAndShowtime(
        int showroomId,
        LocalDate showDate,
        LocalTime startTime
    );
}
