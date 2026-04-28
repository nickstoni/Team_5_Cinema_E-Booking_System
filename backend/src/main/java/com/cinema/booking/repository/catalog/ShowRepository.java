package com.cinema.booking.repository.catalog;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinema.booking.model.catalog.Showtime;

public interface ShowRepository extends JpaRepository<Showtime, Integer> {
    boolean existsByShowroomRoomIdAndShowdateAndShowtime(
        int showroomId,
        LocalDate showDate,
        LocalTime startTime
    );
}
