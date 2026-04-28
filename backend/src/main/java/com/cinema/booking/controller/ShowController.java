package com.cinema.booking.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.booking.dto.ShowRequest;
import com.cinema.booking.dto.ShowResponse;
import com.cinema.booking.service.ShowService;

@RestController
@RequestMapping("/api/shows")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @PostMapping
    public ShowResponse createShow(@RequestBody ShowRequest req) {
        var show = showService.createShow(req);
        return new ShowResponse(
                show.getShowtimeId(),
                show.getMovie() != null ? show.getMovie().getMovieId() : null,
                show.getShowroom() != null ? show.getShowroom().getRoomId() : null,
                show.getShowdate(),
                show.getShowtime());
    }

    @DeleteMapping("/{showtimeId}")
    public String deleteShow(@PathVariable Integer showtimeId) {
        showService.deleteShow(showtimeId);
        return "Showtime deleted successfully";
    }
}