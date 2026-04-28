package com.cinema.booking.builder;

import java.time.LocalDateTime;

import com.cinema.booking.model.User;

/**
 * Builder for creating User entities with required and optional fields.
 *
 * Deliverable 7 UML/presentation alignment:
 * service-layer logic uses UserBuilder, then persists the built User.
 */
public class UserBuilder {

    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String passwordHash;
    private String role = "USER"; // Default role
    private String status = "INACTIVE"; // Default status
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Boolean emailVerified = false; // Default: not verified
    private String emailVerificationToken;
    private String passwordResetToken;
    private LocalDateTime passwordResetTokenExpiry;
    private Boolean promotionsEnabled = false; // Default: not enabled
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Sets the user ID.
     */
    public UserBuilder userId(Integer userId) {
        this.userId = userId;
        return this;
    }

    /**
     * Sets the first name (required).
     */
    public UserBuilder firstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    /**
     * Sets the last name (required).
     */
    public UserBuilder lastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    /**
     * Sets the email (required).
     */
    public UserBuilder email(String email) {
        this.email = email;
        return this;
    }

    /**
     * Sets the phone number (required).
     */
    public UserBuilder phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    /**
     * Sets the password hash (required).
     */
    public UserBuilder passwordHash(String passwordHash) {
        this.passwordHash = passwordHash;
        return this;
    }

    /**
     * Sets the role (optional, defaults to "USER").
     */
    public UserBuilder role(String role) {
        this.role = role;
        return this;
    }

    /**
     * Sets the account status (optional, defaults to "INACTIVE").
     */
    public UserBuilder status(String status) {
        this.status = status;
        return this;
    }

    /**
     * Sets the first line of the address (optional).
     */
    public UserBuilder addressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
        return this;
    }

    /**
     * Sets the second line of the address (optional).
     */
    public UserBuilder addressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
        return this;
    }

    /**
     * Sets the city (optional).
     */
    public UserBuilder city(String city) {
        this.city = city;
        return this;
    }

    /**
     * Sets the state (optional).
     */
    public UserBuilder state(String state) {
        this.state = state;
        return this;
    }

    /**
     * Sets the postal code (optional).
     */
    public UserBuilder postalCode(String postalCode) {
        this.postalCode = postalCode;
        return this;
    }

    /**
     * Sets the country (optional).
     */
    public UserBuilder country(String country) {
        this.country = country;
        return this;
    }

    /**
     * Sets the email verification status (optional, defaults to false).
     */
    public UserBuilder emailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
        return this;
    }

    /**
     * Sets the email verification token (optional).
     */
    public UserBuilder emailVerificationToken(String emailVerificationToken) {
        this.emailVerificationToken = emailVerificationToken;
        return this;
    }

    /**
     * Sets the password reset token (optional).
     */
    public UserBuilder passwordResetToken(String passwordResetToken) {
        this.passwordResetToken = passwordResetToken;
        return this;
    }

    /**
     * Sets the password reset token expiry time (optional).
     */
    public UserBuilder passwordResetTokenExpiry(LocalDateTime passwordResetTokenExpiry) {
        this.passwordResetTokenExpiry = passwordResetTokenExpiry;
        return this;
    }

    /**
     * Sets the promotions enabled flag (optional, defaults to false).
     */
    public UserBuilder promotionsEnabled(Boolean promotionsEnabled) {
        this.promotionsEnabled = promotionsEnabled;
        return this;
    }

    /**
     * Sets the creation timestamp (optional, defaults to now if not set).
     */
    public UserBuilder createdAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    /**
     * Sets the last update timestamp (optional, defaults to now if not set).
     */
    public UserBuilder updatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
        return this;
    }

    /**
     * Builds and returns the User object.
     * Sets default timestamps if not explicitly provided.
     *
     * @return a fully constructed User object
     * @throws IllegalArgumentException if required fields are missing
     */
    public User build() {
        validateRequiredFields();

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = LocalDateTime.now();
        }

        User user = new User();
        user.setUserId(userId);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);
        user.setPasswordHash(passwordHash);
        user.setRole(role);
        user.setStatus(status);
        user.setAddressLine1(addressLine1);
        user.setAddressLine2(addressLine2);
        user.setCity(city);
        user.setState(state);
        user.setPostalCode(postalCode);
        user.setCountry(country);
        user.setEmailVerified(emailVerified);
        user.setEmailVerificationToken(emailVerificationToken);
        user.setPasswordResetToken(passwordResetToken);
        user.setPasswordResetTokenExpiry(passwordResetTokenExpiry);
        user.setPromotionsEnabled(promotionsEnabled);
        user.setCreatedAt(createdAt);
        user.setUpdatedAt(updatedAt);

        return user;
    }

    /**
     * Validates that all required fields are set.
     */
    private void validateRequiredFields() {
        if (firstName == null || firstName.trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (lastName == null || lastName.trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required");
        }
        if (passwordHash == null || passwordHash.trim().isEmpty()) {
            throw new IllegalArgumentException("Password hash is required");
        }
    }
}
