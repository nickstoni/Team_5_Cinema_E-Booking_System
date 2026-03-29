package com.cinema.booking.repository;

import com.cinema.booking.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Integer> {
    Optional<Address> findByUserId(Integer userId);
}