package com.cinema.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCardUpsertRequest {
        private String cardType;
        private String cardNumber;
        private String cvv;
        private String cardHolderName;
        private String expiryMonth;
        private String expiryYear;
}
