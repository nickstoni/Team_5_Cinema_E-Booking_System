package com.cinema.booking.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).+", message = "Password must contain at least one uppercase letter, one lowercase letter, and one number")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    private AddressRequest address;

    private List<PaymentCardRequest> paymentCards;

    private Boolean promotionsEnabled = false;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddressRequest {
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String state;
        private String postalCode;
        private String country;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentCardRequest {
        @NotBlank(message = "Card type is required")
        private String cardType;

        @NotBlank(message = "Card number is required")
        @Pattern(regexp = "^[0-9]{12,19}$", message = "Card number must be 12 to 19 digits")
        private String cardNumber;

        @NotBlank(message = "Card holder name is required")
        private String cardHolderName;

        @NotNull(message = "Expiry month is required")
        @Min(1)
        @Max(12)
        private Integer expiryMonth;

        @NotNull(message = "Expiry year is required")
        private Integer expiryYear;

        @NotBlank(message = "CVV is required")
        @Pattern(regexp = "^[0-9]{3,4}$", message = "CVV must be 3 or 4 digits")
        private String cvv;
    }
}
