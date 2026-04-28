package com.cinema.booking.repository.auth;

import com.cinema.booking.model.auth.PaymentCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentCardRepository extends JpaRepository<PaymentCard, Integer> {
    List<PaymentCard> findByUserId(Integer userId);
    long countByUserId(Integer userId);
}