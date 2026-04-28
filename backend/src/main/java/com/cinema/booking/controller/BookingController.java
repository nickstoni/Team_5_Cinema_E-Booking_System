package com.cinema.booking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.booking.dto.CheckoutBookingRequest;
import com.cinema.booking.dto.CheckoutBookingResponse;
import com.cinema.booking.dto.OrderHistoryItemResponse;
import com.cinema.booking.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/checkout")
    public CheckoutBookingResponse checkout(@RequestBody CheckoutBookingRequest request) {
        return bookingService.finalizeCheckout(request);
    }

    @GetMapping("/history/{userId}")
    public List<OrderHistoryItemResponse> getOrderHistory(@PathVariable Integer userId) {
        return bookingService.getOrderHistory(userId);
    }
}
