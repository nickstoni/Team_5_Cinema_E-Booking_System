package com.cinema.booking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cinema.booking.dto.ShowRequest;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.service.ShowService;

@RestController
@RequestMapping("/api/shows")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowController {

    @Autowired
    private ShowService showService;

    @PostMapping
    public Showtime createShow(@RequestBody ShowRequest req) {
        return showService.createShow(req);
    }
}