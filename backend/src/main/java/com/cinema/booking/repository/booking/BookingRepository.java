package com.cinema.booking.repository.booking;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinema.booking.model.booking.Booking;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUserIdOrderByBookingDateDesc(Integer userId);
}
