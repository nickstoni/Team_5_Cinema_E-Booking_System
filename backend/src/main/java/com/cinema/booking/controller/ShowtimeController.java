package com.cinema.booking.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.cinema.booking.dto.ShowtimeAvailabilityResponse;
import com.cinema.booking.dto.ShowtimeAvailabilityView;
import com.cinema.booking.dto.ShowtimeVisibilityResponse;
import com.cinema.booking.dto.TicketPriceResponse;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.repository.ShowtimeRepository;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowtimeController {

    private final ShowtimeRepository showtimeRepository;
    private final BigDecimal adultTicketPrice;
    private final BigDecimal childTicketPrice;
    private final BigDecimal seniorTicketPrice;

    public ShowtimeController(
            ShowtimeRepository showtimeRepository,
            @Value("${booking.ticket-price.adult:14.99}") BigDecimal adultTicketPrice,
            @Value("${booking.ticket-price.child:10.99}") BigDecimal childTicketPrice,
            @Value("${booking.ticket-price.senior:12.99}") BigDecimal seniorTicketPrice) {
        this.showtimeRepository = showtimeRepository;
        this.adultTicketPrice = adultTicketPrice;
        this.childTicketPrice = childTicketPrice;
        this.seniorTicketPrice = seniorTicketPrice;
    }

    @GetMapping()
    public List<Showtime> getallShowtimes() {
        return showtimeRepository.findAllWithMovie();
    }

    @GetMapping("/movie/{movieId}")
    public List<ShowtimeVisibilityResponse> getShowtimesByMovie(@PathVariable Integer movieId) {
        return showtimeRepository.findVisibilityByMovieId(movieId)
                .stream()
                .map(show -> new ShowtimeVisibilityResponse(
                        show.getShowtimeId(),
                        show.getShowtime(),
                        show.getShowdate(),
                        show.getMovieId(),
                        show.getShowroomName(),
                        show.getTotalSeats(),
                        show.getBookedSeats(),
                        show.getAvailableSeats()))
                .toList();
    }

    @GetMapping("/{showtimeId}/availability")
    public ShowtimeAvailabilityResponse getAvailabilityByShowtime(@PathVariable Integer showtimeId) {
        ShowtimeAvailabilityView availability = showtimeRepository.findAvailabilityByShowtimeId(showtimeId);
        if (availability == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Showtime not found");
        }

        return new ShowtimeAvailabilityResponse(
                availability.getShowtimeId(),
                availability.getTotalSeats(),
                availability.getBookedSeats(),
                availability.getAvailableSeats());
    }

    @GetMapping("/ticket-prices")
    public TicketPriceResponse getTicketPrices() {
        return new TicketPriceResponse(
                adultTicketPrice,
                childTicketPrice,
                seniorTicketPrice);
    }
}