package com.cinema.booking.controller.catalog;

import com.cinema.booking.dto.catalog.MovieResponse;
import com.cinema.booking.service.catalog.CatalogService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    private final CatalogService catalogService;

    public MovieController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    // GET /api/movies?search=...
    @GetMapping
    public List<MovieResponse> getMovies(@RequestParam(required = false) String search) {
        return catalogService.getMovies(search);
    }

    // GET /api/movies/by-genre?genre=Drama
    @GetMapping("/by-genre")
    public List<MovieResponse> getMoviesByGenre(@RequestParam String genre) {
        return catalogService.getMoviesByGenre(genre);
    }
}