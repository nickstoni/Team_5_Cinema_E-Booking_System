package com.cinema.booking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.booking.dto.ShowtimeAvailabilityResponse;
import com.cinema.booking.dto.ShowtimeResponse;
import com.cinema.booking.dto.ShowtimeVisibilityResponse;
import com.cinema.booking.dto.TicketPriceResponse;
import com.cinema.booking.service.CatalogService;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowtimeController {

    private final CatalogService catalogService;

    public ShowtimeController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping()
    public List<ShowtimeResponse> getAllShowtimes() {
        return catalogService.getAllShowtimes();
    }

    @GetMapping("/movie/{movieId}")
    public List<ShowtimeVisibilityResponse> getShowtimesByMovie(@PathVariable Integer movieId) {
        return catalogService.getShowtimesByMovie(movieId);
    }

    @GetMapping("/{showtimeId}/availability")
    public ShowtimeAvailabilityResponse getAvailabilityByShowtime(@PathVariable Integer showtimeId) {
        return catalogService.getAvailabilityByShowtime(showtimeId);
    }

    @GetMapping("/ticket-prices")
    public TicketPriceResponse getTicketPrices() {
        return catalogService.getTicketPrices();
    }
}