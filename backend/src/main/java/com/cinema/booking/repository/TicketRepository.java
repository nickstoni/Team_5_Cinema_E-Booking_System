package com.cinema.booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cinema.booking.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {

  List<Ticket> findByBookingId(Integer bookingId);

    @Query(value = """
        SELECT COALESCE(t.seat_id, 0)
        FROM tickets t
        INNER JOIN bookings b ON b.booking_id = t.booking_id
        WHERE b.show_id = :showtimeId
          AND t.seat_id IS NOT NULL
        """, nativeQuery = true)
    List<Integer> findOccupiedSeatIdsByShowtimeId(@Param("showtimeId") Integer showtimeId);
}
