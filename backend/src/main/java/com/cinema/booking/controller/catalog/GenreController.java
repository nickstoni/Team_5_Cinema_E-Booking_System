package com.cinema.booking.controller.catalog;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.booking.dto.catalog.GenreResponse;
import com.cinema.booking.service.catalog.CatalogService;

@RestController
@RequestMapping("/api/genres")
@CrossOrigin(origins = "http://localhost:3000")
public class GenreController {

    private final CatalogService catalogService;

    public GenreController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<GenreResponse> getAllGenres() {
        return catalogService.getAllGenres();
    }
}