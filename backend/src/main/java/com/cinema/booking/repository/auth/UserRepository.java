package com.cinema.booking.repository.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cinema.booking.model.auth.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailVerificationToken(String token);
    Optional<User> findByPasswordResetToken(String token);
}
