package com.cinema.booking.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private Integer ticketId;

    @Column(name = "ticket_number")
    private String ticketNumber;

    @Column(name = "ticket_type")
    private String ticketType;

    @Column(name = "base_price")
    private BigDecimal basePrice;

    @Column(name = "seat_id")
    private Integer seatId;

    @Column(name = "booking_id")
    private Integer bookingId;
}
