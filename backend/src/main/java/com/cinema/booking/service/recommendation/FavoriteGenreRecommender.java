package com.cinema.booking.service.recommendation;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.cinema.booking.dto.catalog.MovieResponse;
import com.cinema.booking.repository.profile.FavoriteMovieRepository;
import com.cinema.booking.repository.catalog.MovieRepository;
import com.cinema.booking.service.catalog.CatalogService;

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
                    movie.getGenres().forEach(g -> {
                        String name = g == null ? null : g.getGenreName();
                        if (name != null) {
                            genreCounts.put(name, genreCounts.getOrDefault(name, 0) + 2);
                        }
                    });
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
            if (movies == null || movies.isEmpty()) continue;
            for (MovieResponse m : movies) {
                if (recommendations.size() >= limit) break;
                if (m != null) recommendations.add(m);
            }
            if (recommendations.size() >= limit) break;
        }

        return recommendations.stream().distinct().limit(limit).collect(Collectors.toList());
    }

    public List<Integer> getFavoriteMovieIds(Integer userId) {
        var favs = favoriteMovieRepository.findByUserId(userId);
        if (favs == null || favs.isEmpty()) return List.of();
        return favs.stream().map(f -> f.getMovieId()).collect(Collectors.toList());
    }
}
