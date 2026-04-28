package com.cinema.booking.service.auth;

import org.springframework.stereotype.Service;

import com.cinema.booking.dto.auth.ChangePasswordRequest;
import com.cinema.booking.dto.auth.ForgotPasswordRequest;
import com.cinema.booking.dto.auth.LoginRequest;
import com.cinema.booking.dto.auth.LoginResponse;
import com.cinema.booking.dto.auth.RegistrationRequest;
import com.cinema.booking.dto.auth.RegistrationResponse;
import com.cinema.booking.dto.auth.ResetPasswordRequest;

@Service
public class AuthFacade {

    private final AuthService authService;

    public AuthFacade(AuthService authService) {
        this.authService = authService;
    }

    public RegistrationResponse register(RegistrationRequest request) {
        return authService.register(request);
    }

    public LoginResponse login(LoginRequest request) {
        return authService.login(request);
    }

    public RegistrationResponse forgotPassword(ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    public RegistrationResponse resetPassword(ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }

    public RegistrationResponse verifyEmail(String token) {
        return authService.verifyEmail(token);
    }

    public RegistrationResponse changePassword(Integer userId, ChangePasswordRequest request) {
        return authService.changePassword(userId, request);
    }
}
