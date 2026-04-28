package com.cinema.booking.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.cinema.booking.builder.UserBuilder;
import com.cinema.booking.dto.ChangePasswordRequest;
import com.cinema.booking.dto.ForgotPasswordRequest;
import com.cinema.booking.dto.LoginRequest;
import com.cinema.booking.dto.LoginResponse;
import com.cinema.booking.dto.RegistrationRequest;
import com.cinema.booking.dto.RegistrationResponse;
import com.cinema.booking.dto.ResetPasswordRequest;
import com.cinema.booking.model.Address;
import com.cinema.booking.model.PaymentCard;
import com.cinema.booking.model.User;
import com.cinema.booking.repository.AddressRepository;
import com.cinema.booking.repository.PaymentCardRepository;
import com.cinema.booking.repository.UserRepository;

@Service
public class AuthService {

    private static final String RESET_TOKEN_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int RESET_TOKEN_LENGTH = 32;
    private static final SecureRandom RESET_TOKEN_GENERATOR = new SecureRandom();

    private final UserRepository userRepository;
    private final PaymentCardRepository paymentCardRepository;
    private final AddressRepository addressRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;

    public AuthService(
            UserRepository userRepository,
            PaymentCardRepository paymentCardRepository,
            AddressRepository addressRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder,
            EncryptionService encryptionService) {
        this.userRepository = userRepository;
        this.paymentCardRepository = paymentCardRepository;
        this.addressRepository = addressRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.encryptionService = encryptionService;
    }

    /**
     * Facade-style registration workflow.
     *
     * Deliverable 7 UML/presentation alignment:
     * service-layer code orchestrates validation, UserBuilder construction,
     * persistence, and email tasks.
     */
    @Transactional
    public RegistrationResponse register(RegistrationRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }

        Optional<User> existingUser = userRepository.findByEmail(request.getEmail().toLowerCase().trim());
        if (existingUser.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        // Builder usage follows Deliverable 7 Builder UML intent.
        String verificationToken = UUID.randomUUID().toString();
        User user = new UserBuilder()
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(request.getEmail().toLowerCase().trim())
                .phoneNumber(request.getPhoneNumber().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .status("INACTIVE")
                .emailVerified(false)
                .emailVerificationToken(verificationToken)
                .promotionsEnabled(request.getPromotionsEnabled() != null && request.getPromotionsEnabled())
                .build();

        if (request.getAddress() != null) {
            user.setAddressLine1(request.getAddress().getAddressLine1());
            user.setAddressLine2(request.getAddress().getAddressLine2());
            user.setCity(request.getAddress().getCity());
            user.setState(request.getAddress().getState());
            user.setPostalCode(request.getAddress().getPostalCode());
            user.setCountry(request.getAddress().getCountry());
        }

        User savedUser = userRepository.save(user);

        if (request.getAddress() != null) {
            Address address = new Address();
            address.setUserId(savedUser.getUserId());
            address.setAddressLine1(request.getAddress().getAddressLine1());
            address.setAddressLine2(request.getAddress().getAddressLine2());
            address.setCity(request.getAddress().getCity());
            address.setState(request.getAddress().getState());
            address.setPostalCode(request.getAddress().getPostalCode());
            address.setCountry(request.getAddress().getCountry());
            addressRepository.save(address);
        }

        if (request.getPaymentCards() != null && !request.getPaymentCards().isEmpty()) {
            List<PaymentCard> cards = request.getPaymentCards().stream()
                    .map(cardRequest -> buildPaymentCard(savedUser, cardRequest))
                    .collect(Collectors.toList());
            paymentCardRepository.saveAll(cards);
        }

        try {
            String fullName = savedUser.getFirstName() + " " + savedUser.getLastName();
            emailService.sendVerificationEmail(savedUser.getEmail(), fullName, verificationToken);
        } catch (Exception e) {
            System.err.println("Email sending failed: " + e.getMessage());
        }

        return new RegistrationResponse(true,
                "Registration successful. Please check your email to verify your account.");
    }

    /**
     * Authenticates a user and returns basic login details.
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail().toLowerCase().trim());
        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        User user = userOptional.get();
        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (user.getEmailVerified() == null || !user.getEmailVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Email not verified. Please verify your account before logging in.");
        }

        return new LoginResponse(
                true,
                "Login successful",
                user.getUserId(),
                user.getFirstName() + " " + user.getLastName(),
                user.getEmail(),
                user.getRole());
    }

    /**
     * Starts password recovery and sends a reset email when the user exists.
     */
    @Transactional
    public RegistrationResponse forgotPassword(ForgotPasswordRequest request) {
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

        return new RegistrationResponse(true,
                "If that email is registered with us, a password reset link has been sent.");
    }

    /**
     * Completes password reset after token and password validation.
     */
    @Transactional
    public RegistrationResponse resetPassword(ResetPasswordRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
        }

        Optional<User> userOptional = userRepository.findByPasswordResetToken(request.getToken());
        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid or expired reset token");
        }

        User user = userOptional.get();
        if (user.getPasswordResetTokenExpiry() == null || user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token has expired");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);

        try {
            String fullName = user.getFirstName() + " " + user.getLastName();
            emailService.sendPasswordChangeNotification(user.getEmail(), fullName);
        } catch (Exception e) {
            System.err.println("Failed to send password change notification: " + e.getMessage());
        }

        return new RegistrationResponse(true,
                "Password has been reset successfully. You may now log in.");
    }

    /**
     * Verifies email token, activates the account, and sends a welcome email.
     */
    @Transactional
    public RegistrationResponse verifyEmail(String token) {
        Optional<User> userOptional = userRepository.findByEmailVerificationToken(token);
        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid or expired verification token");
        }

        User user = userOptional.get();
        user.setEmailVerified(true);
        user.setStatus("ACTIVE");
        user.setEmailVerificationToken(null);
        userRepository.save(user);

        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName() + " " + user.getLastName());
        } catch (Exception e) {
            System.err.println("Welcome email sending failed: " + e.getMessage());
        }

        return new RegistrationResponse(true, "Email verified successfully. Your account is now active.");
    }

    /**
     * Changes password for an authenticated user after validation.
     */
    @Transactional
    public RegistrationResponse changePassword(Integer userId, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New passwords do not match");
        }

        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        try {
            String fullName = user.getFirstName() + " " + user.getLastName();
            emailService.sendPasswordChangeNotification(user.getEmail(), fullName);
        } catch (Exception e) {
            System.err.println("Failed to send password change notification: " + e.getMessage());
        }

        return new RegistrationResponse(true, "Password changed successfully");
    }

    private PaymentCard buildPaymentCard(User savedUser, RegistrationRequest.PaymentCardRequest cardRequest) {
        PaymentCard card = new PaymentCard();
        card.setUser(savedUser);
        card.setCardType(cardRequest.getCardType());

        String cardNumber = cardRequest.getCardNumber();
        String lastFour = cardNumber.length() >= 4 ? cardNumber.substring(cardNumber.length() - 4) : cardNumber;
        card.setLastFour(lastFour);
        card.setCardNumber(encryptionService.encrypt(cardNumber));
        card.setCvv(encryptionService.encrypt(cardRequest.getCvv()));
        card.setCardHolderName(cardRequest.getCardHolderName());
        card.setExpiryMonth(String.valueOf(cardRequest.getExpiryMonth()));
        card.setExpiryYear(String.valueOf(cardRequest.getExpiryYear()));
        card.setCreatedAt(LocalDateTime.now());
        return card;
    }

    private String generateResetToken() {
        StringBuilder builder = new StringBuilder(RESET_TOKEN_LENGTH);
        for (int i = 0; i < RESET_TOKEN_LENGTH; i++) {
            int index = RESET_TOKEN_GENERATOR.nextInt(RESET_TOKEN_CHARS.length());
            builder.append(RESET_TOKEN_CHARS.charAt(index));
        }
        return builder.toString();
    }
}