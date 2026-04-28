package com.cinema.booking.controller;

import com.cinema.booking.model.Movie;
import com.cinema.booking.repository.MovieRepository;
import com.cinema.booking.repository.MovieQueryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    private final MovieRepository repo;
    private final MovieQueryRepository movieQueryRepo;

    public MovieController(MovieRepository repo, MovieQueryRepository movieQueryRepo) {
        this.repo = repo;
        this.movieQueryRepo = movieQueryRepo;
    }

    // GET /api/movies?search=...
    @GetMapping
    public List<Movie> getMovies(@RequestParam(required = false) String search) {
        if (search == null || search.isBlank()) {
            return repo.findAllWithGenres();
        }

        return repo.searchByTitleWithGenres(search.trim());
    }

    // GET /api/movies/by-genre?genre=Drama
    @GetMapping("/by-genre")
    public List<Movie> getMoviesByGenre(@RequestParam String genre) {
        return movieQueryRepo.findMoviesByGenre(genre);
    }
}