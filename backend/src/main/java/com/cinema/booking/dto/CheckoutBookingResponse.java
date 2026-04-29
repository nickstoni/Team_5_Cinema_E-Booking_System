package com.cinema.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutBookingResponse {

    private Integer bookingId;
    private String bookingNumber;
    private String movieTitle;
    private String showtimeLabel;
    private List<String> seatLabels;
    private BigDecimal total;
}
