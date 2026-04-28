package com.cinema.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderHistoryItemResponse {

    private Integer bookingId;
    private String bookingNumber;
    private String status;
    private LocalDateTime bookingDate;
    private String movieTitle;
    private LocalDate showDate;
    private LocalTime showTime;
    private List<String> seatLabels;
    private BigDecimal totalAmount;
}
