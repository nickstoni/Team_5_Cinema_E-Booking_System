package com.cinema.booking.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "showrooms")
public class Showroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Integer roomId;

    @Column(name = "room_name")
    private String roomName;

    @Column(name = "total_seats")
    private Integer totalSeats;

    public Integer getRoomId() {
        return roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }
}
