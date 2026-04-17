package com.cinema.booking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @DeleteMapping("/{showtimeId}")
    public ResponseEntity<?> deleteShow(@PathVariable Integer showtimeId) {
        try {
            showService.deleteShow(showtimeId);
            return ResponseEntity.ok().body("Showtime deleted successfully");
        } catch (RuntimeException ex) {
            if ("Showtime not found".equals(ex.getMessage())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
            }
            if ("Cannot delete showtime with existing bookings".equals(ex.getMessage())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}