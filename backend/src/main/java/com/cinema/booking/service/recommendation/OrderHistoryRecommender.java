package com.cinema.booking.service.recommendation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.cinema.booking.dto.MovieResponse;
import com.cinema.booking.model.Booking;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.Ticket;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.repository.BookingRepository;
import com.cinema.booking.repository.TicketRepository;
import com.cinema.booking.repository.ShowtimeRepository;
import com.cinema.booking.service.CatalogService;

@Component
public class OrderHistoryRecommender {

    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;
    private final ShowtimeRepository showtimeRepository;
    private final CatalogService catalogService;

    public OrderHistoryRecommender(
            BookingRepository bookingRepository,
            TicketRepository ticketRepository,
            ShowtimeRepository showtimeRepository,
            CatalogService catalogService) {
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
        this.showtimeRepository = showtimeRepository;
        this.catalogService = catalogService;
    }

    public List<MovieResponse> recommendByOrderHistory(Integer userId, int limit) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
        if (bookings == null || bookings.isEmpty()) return List.of();

        // Count genres from movies the user has seen
        Map<String, Integer> genreCounts = new HashMap<>();

        for (Booking b : bookings) {
            Integer showId = b.getShowId();
            if (showId == null) continue;
            Showtime st = showtimeRepository.findById(showId).orElse(null);
            if (st == null || st.getMovie() == null) continue;
            Movie movie = st.getMovie();
            if (movie.getGenres() == null) continue;
            movie.getGenres().forEach(g -> genreCounts.merge(g.getGenreName(), 1, Integer::sum));
        }

        if (genreCounts.isEmpty()) return List.of();

        // Order genres by popularity
        List<String> sortedGenres = genreCounts.entrySet().stream()
                .sorted((a, b) -> Integer.compare(b.getValue(), a.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        List<MovieResponse> recommendations = new ArrayList<>();
        for (String genre : sortedGenres) {
            List<MovieResponse> movies = catalogService.getMoviesByGenre(genre);
            for (MovieResponse m : movies) {
                if (recommendations.size() >= limit) break;
                recommendations.add(m);
            }
            if (recommendations.size() >= limit) break;
        }

        return recommendations.stream().distinct().limit(limit).collect(Collectors.toList());
    }
}
