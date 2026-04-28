package com.cinema.booking.repository.catalog;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cinema.booking.model.catalog.Showroom;

public interface ShowroomRepository extends JpaRepository<Showroom, Integer> {
}
