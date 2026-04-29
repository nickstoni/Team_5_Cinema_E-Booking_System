package com.cinema.booking.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionValidationResponse {
    private boolean valid;
    private String message;
    private BigDecimal discountPercent;
    private String promoCode;
}
