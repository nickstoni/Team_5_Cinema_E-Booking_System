package com.cinema.booking.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "card_id")
    private Integer cardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "user_id", insertable = false, updatable = false)
    private Integer userId;

    @Column(name = "card_type", nullable = false)
    private String cardType;

    @Column(name = "card_number", nullable = false)
    private String cardNumber;

    @Column(name = "card_holder_name", nullable = false)
    private String cardHolderName;

    @Column(name = "expiry_month", nullable = false)
    private String expiryMonth;

    @Column(name = "expiry_year", nullable = false)
    private String expiryYear;

    @Column(name = "cvv")
    private String cvv;

    @Column(name = "last_four")
    private String lastFour;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
