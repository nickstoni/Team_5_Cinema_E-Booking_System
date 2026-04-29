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

/**
 * REST Controller for managing showtimes.
 * 
 * This controller implements a thin controller pattern as part of the Facade design.
 * All business logic is delegated to ShowService, keeping this controller focused
 * on HTTP request/response handling only.
 *
 * Architecture:
 * - Controller: Handles HTTP requests/responses and validation
 * - ShowService (Facade): Orchestrates business logic, validation, and entity creation
 * - Repositories: Handled by ShowService, not directly accessed by controller
 */
@RestController
@RequestMapping("/api/shows")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    /**
     * Creates a new showtime for a movie.
     * 
     * This endpoint delegates all business logic to ShowService, which acts as a facade
     * for showtime creation, including:
     * - Conflict detection
     * - Movie and showroom validation
     * - DTO-to-entity conversion via adapter
     * - Persistence
     *
     * @param req the ShowRequest DTO containing showtime details
     * @return the created ShowResponse DTO
     */
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

    /**
     * Deletes a showtime.
     * 
     * Delegates to ShowService for business logic including validation and conflict checking
     * with existing bookings.
     *
     * @param showtimeId the ID of the showtime to delete
     * @return success message
     */
    @DeleteMapping("/{showtimeId}")
    public String deleteShow(@PathVariable Integer showtimeId) {
        showService.deleteShow(showtimeId);
        return "Showtime deleted successfully";
    }
}