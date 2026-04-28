package com.cinema.booking.controller.catalog;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.booking.dto.catalog.ShowroomResponse;
import com.cinema.booking.service.catalog.CatalogService;

@RestController
@RequestMapping("/api/showrooms")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowroomController {
    
    private final CatalogService catalogService;

    public ShowroomController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<ShowroomResponse> getAllShowrooms() {
        return catalogService.getAllShowrooms();
    }
}
