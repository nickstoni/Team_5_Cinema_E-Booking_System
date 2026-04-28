package com.cinema.booking.model.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer bookingId;

    @Column(name = "booking_number", nullable = false)
    private String bookingNumber;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "online_booking_fee")
    private BigDecimal onlineBookingFee;

    @Column(name = "tax")
    private BigDecimal tax;

    @Column(name = "payment_reference", nullable = false)
    private String paymentReference;

    @Column(name = "status")
    private String status;

    @Column(name = "show_id")
    private Integer showId;

    @Column(name = "user_id")
    private Integer userId;
}
