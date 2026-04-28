package com.cinema.booking.controller.booking;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.booking.dto.booking.CheckoutBookingRequest;
import com.cinema.booking.dto.booking.CheckoutBookingResponse;
import com.cinema.booking.dto.booking.OrderHistoryItemResponse;
import com.cinema.booking.service.booking.BookingFacade;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingFacade bookingFacade;

    public BookingController(BookingFacade bookingFacade) {
        this.bookingFacade = bookingFacade;
    }

    @PostMapping("/checkout")
    public CheckoutBookingResponse checkout(@RequestBody CheckoutBookingRequest request) {
        return bookingFacade.checkout(request);
    }

    @GetMapping("/history/{userId}")
    public List<OrderHistoryItemResponse> getOrderHistory(@PathVariable Integer userId) {
        return bookingFacade.getOrderHistory(userId);
    }
}
