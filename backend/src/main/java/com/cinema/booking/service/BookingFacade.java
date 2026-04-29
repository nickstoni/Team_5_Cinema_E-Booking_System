package com.cinema.booking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cinema.booking.dto.CheckoutBookingRequest;
import com.cinema.booking.dto.CheckoutBookingResponse;
import com.cinema.booking.dto.OrderHistoryItemResponse;

@Service
public class BookingFacade {

    private final BookingService bookingService;

    public BookingFacade(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    public CheckoutBookingResponse checkout(CheckoutBookingRequest request) {
        return bookingService.finalizeCheckout(request);
    }

    public List<OrderHistoryItemResponse> getOrderHistory(Integer userId) {
        return bookingService.getOrderHistory(userId);
    }
}
