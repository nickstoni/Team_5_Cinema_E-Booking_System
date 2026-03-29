package com.cinema.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cinema.booking.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailVerificationToken(String token);
}
