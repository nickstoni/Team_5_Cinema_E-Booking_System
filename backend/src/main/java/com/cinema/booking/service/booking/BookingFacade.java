package com.cinema.booking.service.booking;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cinema.booking.dto.booking.CheckoutBookingRequest;
import com.cinema.booking.dto.booking.CheckoutBookingResponse;
import com.cinema.booking.dto.booking.OrderHistoryItemResponse;

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
