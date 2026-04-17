package com.cinema.booking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cinema.booking.dto.ShowRequest;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.model.Showroom;
import com.cinema.booking.repository.MovieRepository;
import com.cinema.booking.repository.ShowRepository;
import com.cinema.booking.repository.ShowroomRepository;

@Service
public class ShowService {

    @Autowired
    private ShowRepository showRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private ShowroomRepository showroomRepository;

    public Showtime createShow(ShowRequest req) {

        boolean conflict = showRepository.existsByShowroomRoomIdAndShowdateAndShowtime(
            req.showroomId,
            req.showDate,
            req.startTime
        );

        if (conflict) {
            throw new RuntimeException("Showroom already booked at this time");
        }

        Movie movie = movieRepository.findById(req.movieId)
            .orElseThrow(() -> new RuntimeException("Movie not found"));

        Showroom showroom = showroomRepository.findById(req.showroomId)
            .orElseThrow(() -> new RuntimeException("Showroom not found"));

        Showtime show = new Showtime();
        show.setMovie(movie);

        show.setShowroom(showroom);
        show.setShowdate(req.showDate);
        show.setShowtime(req.startTime);

        return showRepository.save(show);
    }
}
