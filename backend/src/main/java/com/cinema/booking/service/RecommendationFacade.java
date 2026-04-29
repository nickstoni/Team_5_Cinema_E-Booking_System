package com.cinema.booking.service;

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
import com.cinema.booking.model.Movie;
import com.cinema.booking.repository.MovieRepository;
import com.cinema.booking.service.CatalogService;

@Service
public class RecommendationFacade {

    private final FavoriteGenreRecommender favoriteGenreRecommender;
    private final BookingRepository bookingRepository;
    private final ShowtimeRepository showtimeRepository;
    private final CatalogService catalogService;
    private final MovieRepository movieRepository;

    public RecommendationFacade(
            FavoriteGenreRecommender favoriteGenreRecommender,
            BookingRepository bookingRepository,
            ShowtimeRepository showtimeRepository,
            CatalogService catalogService,
            MovieRepository movieRepository) {
        this.favoriteGenreRecommender = favoriteGenreRecommender;
        this.bookingRepository = bookingRepository;
        this.showtimeRepository = showtimeRepository;
        this.catalogService = catalogService;
        this.movieRepository = movieRepository;
    }

    public List<MovieResponse> recommendForUser(Integer userId, int limit) {
        Set<Integer> purchasedMovieIds = loadPurchasedMovieIds(userId);

        // Fetch actual favorited movies directly (not recommendations)
        List<Integer> favoriteMovieIds = favoriteGenreRecommender.getFavoriteMovieIds(userId);

        if (favoriteMovieIds == null || favoriteMovieIds.isEmpty()) {
            return new ArrayList<>();
        }

        // Load the actual favorited movies and extract their genres
        java.util.Set<String> allowedGenres = new java.util.LinkedHashSet<>();
        for (Integer movieId : favoriteMovieIds) {
            Movie movie = movieRepository.findById(movieId).orElse(null);
            if (movie != null && movie.getGenres() != null) {
                movie.getGenres().forEach(g -> {
                    if (g != null && g.getGenreName() != null) {
                        allowedGenres.add(g.getGenreName());
                    }
                });
            }
        }

        // Helper to check if movie matches allowed genres
        java.util.function.Predicate<MovieResponse> matchesAllowedGenre = (movie) -> {
            if (movie == null || movie.getGenres() == null) {
                return false;
            }
            for (var g : movie.getGenres()) {
                if (g != null && g.getGenreName() != null && allowedGenres.contains(g.getGenreName())) {
                    return true;
                }
            }
            return false;
        };

        Set<Integer> seen = new LinkedHashSet<>();
        List<MovieResponse> result = new ArrayList<>();

        // Get all movies from allowed genres and filter
        for (String genre : allowedGenres) {
            List<MovieResponse> moviesByGenre = catalogService.getMoviesByGenre(genre);
            
            if (moviesByGenre != null) {
                for (MovieResponse m : moviesByGenre) {
                    if (m != null && m.getMovieId() != null) {
                        boolean isFavorited = favoriteMovieIds.contains(m.getMovieId());
                        boolean isPurchased = purchasedMovieIds.contains(m.getMovieId());
                        boolean isSeen = seen.contains(m.getMovieId());
                        
                        if (!isSeen && !isPurchased && (isFavorited || matchesAllowedGenre.test(m))) {
                            seen.add(m.getMovieId());
                            result.add(m);
                            if (result.size() >= limit) return result;
                        }
                    }
                }
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
