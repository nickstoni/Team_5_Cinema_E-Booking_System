package com.cinema.booking.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.cinema.booking.dto.ShowRequest;
import com.cinema.booking.exception.ConflictException;
import com.cinema.booking.exception.ResourceNotFoundException;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.model.Showroom;
import com.cinema.booking.repository.MovieRepository;
import com.cinema.booking.repository.ShowRepository;
import com.cinema.booking.repository.ShowroomRepository;

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

    public Showtime createShow(ShowRequest req) {

        boolean conflict = showRepository.existsByShowroomRoomIdAndShowdateAndShowtime(
            req.getShowroomId(),
            req.getShowDate(),
            req.getStartTime()
        );

        if (conflict) {
            throw new ConflictException("Showroom already booked at this time");
        }

        Movie movie = movieRepository.findById(req.getMovieId())
            .orElseThrow(() -> new ResourceNotFoundException("Movie not found"));

        Showroom showroom = showroomRepository.findById(req.getShowroomId())
            .orElseThrow(() -> new ResourceNotFoundException("Showroom not found"));

        Showtime show = new Showtime();
        show.setMovie(movie);

        show.setShowroom(showroom);
        show.setShowdate(req.getShowDate());
        show.setShowtime(req.getStartTime());

        return showRepository.save(show);
    }

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
