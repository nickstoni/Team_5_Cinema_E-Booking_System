package com.cinema.booking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@absolute-cinema.com}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:3000}")
    private String baseUrl;

    public void sendVerificationEmail(String recipientEmail, String fullName, String verificationToken) {
        try {
            String verificationLink = baseUrl + "/verify-email?token=" + verificationToken;
            
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "Thank you for registering with Absolute Cinema! To complete your account setup, " +
                "please click the link below to verify your email address:\n\n" +
                "%s\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you did not create this account, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Absolute Cinema Team",
                fullName,
                verificationLink
            );

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setSubject("Verify Your Absolute Cinema Email Address");
            message.setText(emailBody);

            mailSender.send(message);
            logger.info("Verification email sent successfully to: {}", recipientEmail);
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}", recipientEmail, e);
            throw new RuntimeException("Failed to send verification email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String recipientEmail, String fullName) {
        try {
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "Welcome to Absolute Cinema! Your email has been verified and your account is now active.\n\n" +
                "You can now:\n" +
                "- Browse and search movies\n" +
                "- View showtimes and book tickets\n" +
                "- Manage your account and payment methods\n\n" +
                "Happy booking!\n\n" +
                "Best regards,\n" +
                "Absolute Cinema Team",
                fullName
            );

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setSubject("Your Absolute Cinema Account is Active");
            message.setText(emailBody);

            mailSender.send(message);
            logger.info("Welcome email sent successfully to: {}", recipientEmail);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", recipientEmail, e);
        }
    }

    public void sendPasswordResetEmail(String recipientEmail, String fullName, String resetToken) {
        try {
            String resetLink = baseUrl + "/reset-password?token=" + resetToken;
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "We received a request to reset your Absolute Cinema password. " +
                "Please click the link below to set a new password:\n\n" +
                "%s\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "If you did not request a password reset, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Absolute Cinema Team",
                fullName,
                resetLink
            );

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setSubject("Absolute Cinema Password Reset Request");
            message.setText(emailBody);

            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", recipientEmail);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", recipientEmail, e);
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage());
        }
    }

    public void sendProfileChangeNotification(String recipientEmail, String fullName) {
        try {
            String emailBody = String.format(
                "Hello %s,\n\n" +
                "We wanted to confirm that your profile information has been successfully updated " +
                "in your Absolute Cinema account.\n\n" +
                "If you did not make these changes, please contact our support team immediately.\n\n" +
                "Changes made:\n" +
                "- Personal information (Name, Phone)\n" +
                "- Address information\n" +
                "- Payment card information\n\n" +
                "For security reasons, we do not display your payment card details in emails.\n\n" +
                "Best regards,\n" +
                "Absolute Cinema Team",
                fullName
            );

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setSubject("Absolute Cinema Profile Update Notification");
            message.setText(emailBody);

            mailSender.send(message);
            logger.info("Profile change notification email sent successfully to: {}", recipientEmail);
        } catch (Exception e) {
            logger.error("Failed to send profile change notification to: {}", recipientEmail, e);
            // Don't throw exception here - non-critical operation
            logger.warn("Continuing despite email notification failure");
        }
    }
}
