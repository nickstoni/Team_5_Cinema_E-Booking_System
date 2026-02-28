package com.cinema.booking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.booking.model.Genre;
import com.cinema.booking.repository.GenreRepository;

@RestController
@RequestMapping("/api/genres")
@CrossOrigin(origins = "http://localhost:3000")
public class GenreController {

    private final GenreRepository genreRepository;

    public GenreController(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    @GetMapping
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }
}