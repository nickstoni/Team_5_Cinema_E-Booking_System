package com.cinema.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutBookingRequest {

    private Integer userId;
    private Integer showtimeId;
    private String reservationToken;
    private String confirmationEmail;
    private List<String> seatLabels;
    private TicketBreakdown tickets;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal total;
    private String paymentMethodSummary;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TicketBreakdown {
        private TicketLine adult;
        private TicketLine child;
        private TicketLine senior;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TicketLine {
        private Integer quantity;
        private BigDecimal price;
    }
}
