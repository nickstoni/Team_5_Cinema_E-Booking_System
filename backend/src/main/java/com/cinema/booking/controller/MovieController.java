package com.cinema.booking.controller;

import com.cinema.booking.model.Movie;
import com.cinema.booking.repository.MovieRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    private final MovieRepository repo;

    public MovieController(MovieRepository repo) {
        this.repo = repo;
    }

    // GET /api/movies?search=...
    @GetMapping
    public List<Movie> getMovies(@RequestParam(required = false) String search) {
        List<Movie> all = repo.findAll();

        if (search == null || search.isBlank()) {
            return all;
        }

        String s = search.toLowerCase();
        return all.stream()
                .filter(m -> m.getTitle() != null && m.getTitle().toLowerCase().contains(s))
                .toList();
    }
}