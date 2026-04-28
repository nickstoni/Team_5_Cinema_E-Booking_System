package com.cinema.booking.service.recommendation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.cinema.booking.dto.MovieResponse;
import com.cinema.booking.model.Movie;
import com.cinema.booking.repository.FavoriteMovieRepository;
import com.cinema.booking.repository.MovieRepository;
import com.cinema.booking.service.CatalogService;

@Component
public class FavoriteGenreRecommender {

    private final FavoriteMovieRepository favoriteMovieRepository;
    private final MovieRepository movieRepository;
    private final CatalogService catalogService;

    public FavoriteGenreRecommender(
            FavoriteMovieRepository favoriteMovieRepository,
            MovieRepository movieRepository,
            CatalogService catalogService) {
        this.favoriteMovieRepository = favoriteMovieRepository;
        this.movieRepository = movieRepository;
        this.catalogService = catalogService;
    }

    public List<MovieResponse> recommendByFavoriteGenres(Integer userId, int limit) {
        var favs = favoriteMovieRepository.findByUserId(userId);
        if (favs == null || favs.isEmpty()) return List.of();

        Map<String, Integer> genreCounts = new HashMap<>();
        for (var fav : favs) {
            movieRepository.findById(fav.getMovieId()).ifPresent(movie -> {
                if (movie.getGenres() != null) {
                    movie.getGenres().forEach(g -> genreCounts.merge(g.getGenreName(), 2, Integer::sum));
                }
            });
        }

        if (genreCounts.isEmpty()) return List.of();

        List<String> sortedGenres = genreCounts.entrySet().stream()
                .sorted((a, b) -> Integer.compare(b.getValue(), a.getValue()))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        List<MovieResponse> recommendations = new ArrayList<>();
        for (String genre : sortedGenres) {
            var movies = catalogService.getMoviesByGenre(genre);
            for (MovieResponse m : movies) {
                if (recommendations.size() >= limit) break;
                recommendations.add(m);
            }
            if (recommendations.size() >= limit) break;
        }

        return recommendations.stream().distinct().limit(limit).collect(Collectors.toList());
    }
}
