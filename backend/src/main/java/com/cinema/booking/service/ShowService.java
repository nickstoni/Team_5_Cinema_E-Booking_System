package com.cinema.booking.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.cinema.booking.adapter.ShowRequestAdapter;
import com.cinema.booking.dto.ShowRequest;
import com.cinema.booking.exception.ConflictException;
import com.cinema.booking.exception.ResourceNotFoundException;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.model.Showroom;
import com.cinema.booking.repository.MovieRepository;
import com.cinema.booking.repository.ShowRepository;
import com.cinema.booking.repository.ShowroomRepository;

/**
 * Facade service for showtime operations.
 *
 * Deliverable 7 UML/presentation alignment:
 * ShowController delegates to ShowService, and this service coordinates
 * MovieRepository, ShowroomRepository, ShowRepository, plus ShowRequestAdapter.
 */
@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final ShowroomRepository showroomRepository;

    public ShowService(
            ShowRepository showRepository,
            MovieRepository movieRepository,
            ShowroomRepository showroomRepository) {
        this.showRepository = showRepository;
        this.movieRepository = movieRepository;
        this.showroomRepository = showroomRepository;
    }

    /**
     * Creates a showtime via the facade flow.
     *
     * Simple flow: check conflicts, load Movie/Showroom, adapt DTO to entity,
     * then save.
     *
     * Deliverable 7 UML trace: ShowController -> ShowService -> repositories,
     * with ShowRequestAdapter handling DTO-to-entity mapping.
     *
     * @param req the ShowRequest DTO containing showtime details (movieId, showroomId, date, time)
     * @return the created and persisted Showtime entity
     * @throws ConflictException if showroom is already booked at this date/time
     * @throws ResourceNotFoundException if movie or showroom does not exist
     */
    public Showtime createShow(ShowRequest req) {
        // Step 1: Check for scheduling conflicts (business logic)
        boolean conflict = showRepository.existsByShowroomRoomIdAndShowdateAndShowtime(
            req.getShowroomId(),
            req.getShowDate(),
            req.getStartTime()
        );

        if (conflict) {
            throw new ConflictException("Showroom already booked at this time");
        }

        // Step 2: Validate and fetch related entities
        Movie movie = movieRepository.findById(req.getMovieId())
            .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        Showroom showroom = showroomRepository.findById(req.getShowroomId())
            .orElseThrow(() -> new ResourceNotFoundException("Showroom not found"));

        // Step 3: Use adapter to convert DTO to entity
        Showtime show = ShowRequestAdapter.toShowtime(req, movie, showroom);

        // Step 4: Persist the entity
        return showRepository.save(show);
    }

    /**
     * Deletes a showtime after basic safety checks.
     *
     * @param showtimeId the ID of the showtime to delete
     * @throws ResourceNotFoundException if showtime does not exist
     * @throws ConflictException if showtime has existing bookings
     */
    public void deleteShow(Integer showtimeId) {
        if (!showRepository.existsById(showtimeId)) {
            throw new ResourceNotFoundException("Showtime not found");
        }

        try {
            showRepository.deleteById(showtimeId);
        } catch (DataIntegrityViolationException ex) {
            throw new ConflictException("Cannot delete showtime with existing bookings");
        }
    }
}
