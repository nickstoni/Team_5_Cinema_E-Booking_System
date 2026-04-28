package com.cinema.booking.service.recommendation;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.cinema.booking.dto.MovieResponse;
import com.cinema.booking.model.Booking;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.repository.BookingRepository;
import com.cinema.booking.repository.ShowtimeRepository;

@Service
public class RecommendationFacade {

    private final OrderHistoryRecommender orderHistoryRecommender;
    private final FavoriteGenreRecommender favoriteGenreRecommender;
    private final BookingRepository bookingRepository;
    private final ShowtimeRepository showtimeRepository;

    public RecommendationFacade(
            OrderHistoryRecommender orderHistoryRecommender,
            FavoriteGenreRecommender favoriteGenreRecommender,
            BookingRepository bookingRepository,
            ShowtimeRepository showtimeRepository) {
        this.orderHistoryRecommender = orderHistoryRecommender;
        this.favoriteGenreRecommender = favoriteGenreRecommender;
        this.bookingRepository = bookingRepository;
        this.showtimeRepository = showtimeRepository;
    }

    public List<MovieResponse> recommendForUser(Integer userId, int limit) {
        Set<Integer> purchasedMovieIds = loadPurchasedMovieIds(userId);

        // Collect recommendations from both strategies and merge preserving order
        List<MovieResponse> favBased = favoriteGenreRecommender.recommendByFavoriteGenres(userId, limit);
        List<MovieResponse> historyBased = orderHistoryRecommender.recommendByOrderHistory(userId, limit);

        // Use LinkedHashSet to preserve insertion order and dedupe by movieId
        Set<Integer> seen = new LinkedHashSet<>();
        List<MovieResponse> result = new ArrayList<>();

        for (MovieResponse m : favBased) {
            if (m != null && m.getMovieId() != null && !purchasedMovieIds.contains(m.getMovieId()) && !seen.contains(m.getMovieId())) {
                seen.add(m.getMovieId());
                result.add(m);
                if (result.size() >= limit) return result;
            }
        }

        for (MovieResponse m : historyBased) {
            if (m != null && m.getMovieId() != null && !purchasedMovieIds.contains(m.getMovieId()) && !seen.contains(m.getMovieId())) {
                seen.add(m.getMovieId());
                result.add(m);
                if (result.size() >= limit) return result;
            }
        }

        return result;
    }

    private Set<Integer> loadPurchasedMovieIds(Integer userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingDateDesc(userId);
        if (bookings == null || bookings.isEmpty()) {
            return Set.of();
        }

        return bookings.stream()
                .map(Booking::getShowId)
                .filter(showId -> showId != null && showId > 0)
                .map(showtimeRepository::findById)
                .flatMap(java.util.Optional::stream)
                .map(Showtime::getMovie)
                .filter(movie -> movie != null && movie.getMovieId() != null)
                .map(movie -> movie.getMovieId())
                .collect(Collectors.toSet());
    }
}
