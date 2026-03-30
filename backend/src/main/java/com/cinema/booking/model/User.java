package com.cinema.booking.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String phoneNumber;

    private String password;

    private Boolean promotionsEnabled;

    private String status;

    // Getters and Setters

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Boolean getPromotionsEnabled() { return promotionsEnabled; }
    public void setPromotionsEnabled(Boolean promotionsEnabled) { this.promotionsEnabled = promotionsEnabled; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}