package com.cinema.booking.shared.adapter;

import com.cinema.booking.dto.ShowRequest;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.model.Showroom;

/**
 * Adapter for mapping ShowRequest DTOs to Showtime entities.
 *
 * Deliverable 7 UML/presentation alignment:
 * ShowService uses this adapter for ShowRequest -> Showtime conversion
 * before saving.
 */
public class ShowRequestAdapter {

    /**
        * Converts a ShowRequest DTO to a Showtime entity.
     *
     * @param showRequest the incoming DTO from the frontend
     * @param movie the Movie entity associated with this showtime
     * @param showroom the Showroom entity where this showtime will be held
     * @return a populated Showtime entity ready for persistence
     */
    public static Showtime toShowtime(ShowRequest showRequest, Movie movie, Showroom showroom) {
        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setShowroom(showroom);
        showtime.setShowdate(showRequest.getShowDate());
        showtime.setShowtime(showRequest.getStartTime());
        
        return showtime;
    }

    /**
        * Converts a ShowRequest DTO to a Showtime entity with explicit duration.
     *
     * @param showRequest the incoming DTO from the frontend
     * @param movie the Movie entity associated with this showtime
     * @param showroom the Showroom entity where this showtime will be held
     * @param durationMins the duration of the showtime in minutes
     * @return a populated Showtime entity with duration set
     */
    public static Showtime toShowtime(ShowRequest showRequest, Movie movie, Showroom showroom, Integer durationMins) {
        Showtime showtime = toShowtime(showRequest, movie, showroom);
        showtime.setDurationMins(durationMins);
        return showtime;
    }
}
