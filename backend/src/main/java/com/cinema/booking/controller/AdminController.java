package com.cinema.booking.controller;

import com.cinema.booking.dto.AddMovieRequest;
import com.cinema.booking.dto.AddPromotionRequest;
import com.cinema.booking.dto.AddShowtimeRequest;
import com.cinema.booking.service.AdminFacade;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminFacade adminFacade;

    public AdminController(AdminFacade adminFacade) {
        this.adminFacade = adminFacade;
    }

    // ────────────────────────────── USERS ──────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(adminFacade.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving users: " + e.getMessage());
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        try {
            return ResponseEntity.ok(adminFacade.getUserById(userId));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user: " + e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Integer userId, @RequestParam String status) {
        try {
            return ResponseEntity.ok(adminFacade.updateUserStatus(userId, status));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating user status: " + e.getMessage());
        }
    }

    // ────────────────────────────── MOVIES ──────────────────────────────

    @GetMapping("/movies")
    public ResponseEntity<?> getAllMovies() {
        try {
            return ResponseEntity.ok(adminFacade.getAllMovies());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving movies: " + e.getMessage());
        }
    }

    @PostMapping("/movies")
    public ResponseEntity<?> addMovie(@Valid @RequestBody AddMovieRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(adminFacade.addMovie(request));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding movie: " + e.getMessage());
        }
    }

    @DeleteMapping("/movies/{movieId}")
    public ResponseEntity<?> deleteMovie(@PathVariable Integer movieId) {
        try {
            return ResponseEntity.ok(adminFacade.deleteMovie(movieId));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting movie: " + e.getMessage());
        }
    }

    // ────────────────────────────── SHOWROOMS ──────────────────────────────

    @GetMapping("/showrooms")
    public ResponseEntity<?> getAllShowrooms() {
        try {
            return ResponseEntity.ok(adminFacade.getAllShowrooms());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving showrooms: " + e.getMessage());
        }
    }

    // ────────────────────────────── SHOWTIMES ──────────────────────────────

    @GetMapping("/showtimes")
    public ResponseEntity<?> getAllShowtimes() {
        try {
            return ResponseEntity.ok(adminFacade.getAllShowtimes());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving showtimes: " + e.getMessage());
        }
    }

    @PostMapping("/showtimes")
    public ResponseEntity<?> addShowtime(@Valid @RequestBody AddShowtimeRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(adminFacade.addShowtime(request));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding showtime: " + e.getMessage());
        }
    }

    @DeleteMapping("/showtimes/{showtimeId}")
    public ResponseEntity<?> deleteShowtime(@PathVariable Integer showtimeId) {
        try {
            return ResponseEntity.ok(adminFacade.deleteShowtime(showtimeId));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting showtime: " + e.getMessage());
        }
    }

    // ────────────────────────────── PROMOTIONS ──────────────────────────────

    @GetMapping("/promotions")
    public ResponseEntity<?> getAllPromotions() {
        try {
            return ResponseEntity.ok(adminFacade.getAllPromotions());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving promotions: " + e.getMessage());
        }
    }

    @PostMapping("/promotions")
    public ResponseEntity<?> addPromotion(@Valid @RequestBody AddPromotionRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(adminFacade.addPromotion(request));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding promotion: " + e.getMessage());
        }
    }

    @DeleteMapping("/promotions/{promoId}")
    public ResponseEntity<?> deletePromotion(@PathVariable Integer promoId) {
        try {
            return ResponseEntity.ok(adminFacade.deletePromotion(promoId));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting promotion: " + e.getMessage());
        }
    }

    @PostMapping("/promotions/{promoId}/send")
    public ResponseEntity<?> sendPromotionEmail(@PathVariable Integer promoId) {
        try {
            return ResponseEntity.ok(adminFacade.sendPromotionEmail(promoId));
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending promotion emails: " + e.getMessage());
        }
    }

    @PostMapping("/promotions/validate")
    public ResponseEntity<?> validatePromotionCode(@RequestParam String promoCode) {
        try {
            return ResponseEntity.ok(adminFacade.validatePromotionCode(promoCode));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error validating promotion: " + e.getMessage());
        }
    }

    // ────────────────────────────── DASHBOARD ──────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardSummary() {
        try {
            return ResponseEntity.ok(adminFacade.getDashboardSummary());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving dashboard summary: " + e.getMessage());
        }
    }
}