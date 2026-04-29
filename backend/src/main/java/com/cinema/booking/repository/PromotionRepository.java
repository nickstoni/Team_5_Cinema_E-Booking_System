package com.cinema.booking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.cinema.booking.model.Promotion;

public interface PromotionRepository extends JpaRepository<Promotion, Integer> {

    @Query("SELECT p FROM Promotion p WHERE p.isActive = true ORDER BY p.startDate DESC")
    List<Promotion> findAllActive();

    boolean existsByPromoCode(String promoCode);

    Optional<Promotion> findByPromoCode(String promoCode);
}
