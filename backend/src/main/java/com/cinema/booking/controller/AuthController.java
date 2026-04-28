package com.cinema.booking.controller;

import com.cinema.booking.dto.ChangePasswordRequest;
import com.cinema.booking.dto.ForgotPasswordRequest;
import com.cinema.booking.dto.LoginRequest;
import com.cinema.booking.dto.LoginResponse;
import com.cinema.booking.dto.RegistrationRequest;
import com.cinema.booking.dto.RegistrationResponse;
import com.cinema.booking.dto.ResetPasswordRequest;
import com.cinema.booking.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegistrationRequest request) {
        try {
            RegistrationResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(new RegistrationResponse(false, ex.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RegistrationResponse(false, "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(new LoginResponse(false, ex.getReason(), null, null, null, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new LoginResponse(false, "Login failed: " + e.getMessage(), null, null, null, null));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<RegistrationResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            return ResponseEntity.ok(authService.forgotPassword(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegistrationResponse(false, "Password recovery failed: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<RegistrationResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            return ResponseEntity.ok(authService.resetPassword(request));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(new RegistrationResponse(false, ex.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new RegistrationResponse(false, "Reset password failed: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<RegistrationResponse> verifyEmail(@RequestParam String token) {
        try {
            return ResponseEntity.ok(authService.verifyEmail(token));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(new RegistrationResponse(false, ex.getReason()));
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
            return ResponseEntity.ok(authService.changePassword(userId, request));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(new RegistrationResponse(false, ex.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RegistrationResponse(false, "Failed to change password: " + e.getMessage()));
        }
    }
}
