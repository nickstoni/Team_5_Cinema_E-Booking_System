package com.cinema.booking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.booking.model.Showroom;
import com.cinema.booking.repository.ShowroomRepository;

@RestController
@RequestMapping("/api/showrooms")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowroomController {
    
    private final ShowroomRepository showroomRepository;

    public ShowroomController(ShowroomRepository showroomRepository) {
        this.showroomRepository = showroomRepository;
    }

    @GetMapping
    public List<Showroom> getAllShowrooms() {
        return showroomRepository.findAll();
    }
}
