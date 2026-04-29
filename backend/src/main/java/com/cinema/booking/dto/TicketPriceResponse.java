package com.cinema.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketPriceResponse {
    private BigDecimal adult;
    private BigDecimal child;
    private BigDecimal senior;
}
