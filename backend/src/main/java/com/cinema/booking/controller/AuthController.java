package com.cinema.booking.controller;

import com.cinema.booking.dto.ChangePasswordRequest;
import com.cinema.booking.dto.ForgotPasswordRequest;
import com.cinema.booking.dto.LoginRequest;
import com.cinema.booking.dto.LoginResponse;
import com.cinema.booking.dto.RegistrationRequest;
import com.cinema.booking.dto.RegistrationResponse;
import com.cinema.booking.dto.ResetPasswordRequest;
import com.cinema.booking.model.PaymentCard;
import com.cinema.booking.model.User;
import com.cinema.booking.repository.UserRepository;
import com.cinema.booking.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String RESET_TOKEN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int RESET_TOKEN_LENGTH = 32;
    private static final SecureRandom RESET_TOKEN_GENERATOR = new SecureRandom();

    private String generateResetToken() {
        StringBuilder builder = new StringBuilder(RESET_TOKEN_LENGTH);
        for (int i = 0; i < RESET_TOKEN_LENGTH; i++) {
            int index = RESET_TOKEN_GENERATOR.nextInt(RESET_TOKEN_CHARS.length());
            builder.append(RESET_TOKEN_CHARS.charAt(index));
        }
        return builder.toString();
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegistrationRequest request) {
        try {
            // Validate password confirmation
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RegistrationResponse(false, "Passwords do not match"));
            }

            // Check if user already exists
            Optional<User> existingUser = userRepository.findByEmail(request.getEmail().toLowerCase().trim());
            if (existingUser.isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new RegistrationResponse(false, "Email already registered"));
            }

            // Create new user
            User user = new User();
            user.setFirstName(request.getFirstName().trim());
            user.setLastName(request.getLastName().trim());
            user.setEmail(request.getEmail().toLowerCase().trim());
            user.setPhoneNumber(request.getPhoneNumber().trim());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setRole("USER");
            user.setStatus("INACTIVE");
            user.setEmailVerified(false);
            user.setPromotionsEnabled(request.getPromotionsEnabled() != null && request.getPromotionsEnabled());
            
            // Generate verification token
            String verificationToken = UUID.randomUUID().toString();
            user.setEmailVerificationToken(verificationToken);

            // Set address fields if provided
            if (request.getAddress() != null) {
                user.setAddressLine1(request.getAddress().getAddressLine1());
                user.setAddressLine2(request.getAddress().getAddressLine2());
                user.setCity(request.getAddress().getCity());
                user.setState(request.getAddress().getState());
                user.setPostalCode(request.getAddress().getPostalCode());
                user.setCountry(request.getAddress().getCountry());
            }

            // Save user (status: INACTIVE until email is verified)
            User savedUser = userRepository.save(user);

            // Save payment cards if provided
            if (request.getPaymentCards() != null && !request.getPaymentCards().isEmpty()) {
                List<PaymentCard> cards = request.getPaymentCards().stream()
                    .map(cardRequest -> {
                        PaymentCard card = new PaymentCard();
                        card.setUser(savedUser);
                        card.setCardType(cardRequest.getCardType());
                        card.setCardNumber(cardRequest.getCardNumber());
                        card.setCardHolderName(cardRequest.getCardHolderName());
                        card.setExpiryMonth(String.valueOf(cardRequest.getExpiryMonth()));
                        card.setExpiryYear(String.valueOf(cardRequest.getExpiryYear()));
                        return card;
                    })
                    .collect(Collectors.toList());
            }

            // Send verification email
            try {
                String fullName = savedUser.getFirstName() + " " + savedUser.getLastName();
                emailService.sendVerificationEmail(
                    savedUser.getEmail(),
                    fullName,
                    verificationToken
                );
            } catch (Exception e) {
                // Log email sending error but don't fail the registration
                System.err.println("Email sending failed: " + e.getMessage());
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(new RegistrationResponse(true, 
                    "Registration successful. Please check your email to verify your account."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RegistrationResponse(false, "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail().toLowerCase().trim());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Invalid email or password", null, null, null, null));
            }

            User user = userOptional.get();
            if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(false, "Invalid email or password", null, null, null, null));
            }

            if (user.getEmailVerified() == null || !user.getEmailVerified()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new LoginResponse(false, "Email not verified. Please verify your account before logging in.", null, null, null, null));
            }

            return ResponseEntity.ok(new LoginResponse(
                    true,
                    "Login successful",
                    user.getUserId(),
                    user.getFirstName() + " " + user.getLastName(),
                    user.getEmail(),
                    user.getRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse(false, "Login failed: " + e.getMessage(), null, null, null, null));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<RegistrationResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            String normalizedEmail = request.getEmail().toLowerCase().trim();
            Optional<User> userOptional = userRepository.findByEmail(normalizedEmail);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                String resetToken = generateResetToken();
                user.setPasswordResetToken(resetToken);
                user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(24));
                userRepository.save(user);

                emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName() + " " + user.getLastName(), resetToken);
            }

            return ResponseEntity.ok(new RegistrationResponse(true,
                    "If that email is registered with us, a password reset link has been sent."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegistrationResponse(false, "Password recovery failed: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<RegistrationResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new RegistrationResponse(false, "Passwords do not match"));
            }

            Optional<User> userOptional = userRepository.findByPasswordResetToken(request.getToken());
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new RegistrationResponse(false, "Invalid or expired reset token"));
            }

            User user = userOptional.get();
            if (user.getPasswordResetTokenExpiry() == null || user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new RegistrationResponse(false, "Reset token has expired"));
            }

            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setPasswordResetToken(null);
            user.setPasswordResetTokenExpiry(null);
            userRepository.save(user);

            return ResponseEntity.ok(new RegistrationResponse(true,
                    "Password has been reset successfully. You may now log in."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegistrationResponse(false, "Reset password failed: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<RegistrationResponse> verifyEmail(@RequestParam String token) {
        try {
            Optional<User> userOptional = userRepository.findByEmailVerificationToken(token);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new RegistrationResponse(false, "Invalid or expired verification token"));
            }

            User user = userOptional.get();
            user.setEmailVerified(true);
            user.setStatus("ACTIVE");
            user.setEmailVerificationToken(null);
            
            userRepository.save(user);

            // Send welcome email
            try {
                emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName() + " " + user.getLastName());
            } catch (Exception e) {
                System.err.println("Welcome email sending failed: " + e.getMessage());
            }

            return ResponseEntity.ok(new RegistrationResponse(true, 
                "Email verified successfully. Your account is now active."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RegistrationResponse(false, "Email verification failed: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password/{userId}")
    public ResponseEntity<RegistrationResponse> changePassword(
            @PathVariable Integer userId,
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            // Validate new passwords match
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new RegistrationResponse(false, "New passwords do not match"));
            }

            // Find user
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new RegistrationResponse(false, "User not found"));
            }

            User user = userOptional.get();

            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new RegistrationResponse(false, "Current password is incorrect"));
            }

            // Update to new password
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(new RegistrationResponse(true, "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RegistrationResponse(false, "Failed to change password: " + e.getMessage()));
        }
    }
}
