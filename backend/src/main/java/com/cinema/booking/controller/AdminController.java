package com.cinema.booking.controller;

import com.cinema.booking.model.User;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.repository.UserRepository;
import com.cinema.booking.repository.MovieRepository;
import com.cinema.booking.repository.ShowtimeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;

    public AdminController(UserRepository userRepository, MovieRepository movieRepository, ShowtimeRepository showtimeRepository) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.showtimeRepository = showtimeRepository;
    }

    /**
     * Get all users (Admin only)
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving users: " + e.getMessage());
        }
    }

    /**
     * Get user by ID (Admin only)
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }
            return ResponseEntity.ok(user.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving user: " + e.getMessage());
        }
    }

    /**
     * Get all movies (Admin only)
     */
    @GetMapping("/movies")
    public ResponseEntity<?> getAllMovies() {
        try {
            List<Movie> movies = movieRepository.findAll();
            return ResponseEntity.ok(movies);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving movies: " + e.getMessage());
        }
    }

    /**
     * Update user status (Admin only)
     */
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Integer userId, @RequestParam String status) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
            }

            User user = userOpt.get();
            if (!status.equals("ACTIVE") && !status.equals("INACTIVE")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid status. Use ACTIVE or INACTIVE");
            }

            user.setStatus(status);
            userRepository.save(user);
            return ResponseEntity.ok("User status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating user status: " + e.getMessage());
        }
    }

    /**
     * Get dashboard summary (Admin only)
     */
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardSummary() {
        try {
            long totalUsers = userRepository.count();
            long totalMovies = movieRepository.count();
            
            // Count active and inactive users
            List<User> allUsers = userRepository.findAll();
            long activeUsers = allUsers.stream()
                .filter(u -> "ACTIVE".equals(u.getStatus()))
                .count();
            long inactiveUsers = allUsers.stream()
                .filter(u -> "INACTIVE".equals(u.getStatus()))
                .count();

            return ResponseEntity.ok(new DashboardSummary(
                totalUsers,
                activeUsers,
                inactiveUsers,
                totalMovies
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving dashboard summary: " + e.getMessage());
        }
    }

    /**
     * Shows all the scheduled showtimes
     */
    @GetMapping("/showtimes")
    public ResponseEntity<?> getAllShowtimes() {
        try {
            List<Showtime> showtimes = showtimeRepository.findAll();
            return ResponseEntity.ok(showtimes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving showtimes: " + e.getMessage());
        }
    }

    /**
     * Inner class for dashboard summary response
     */
    public static class DashboardSummary {
        public long totalUsers;
        public long activeUsers;
        public long inactiveUsers;
        public long totalMovies;

        public DashboardSummary(long totalUsers, long activeUsers, long inactiveUsers, long totalMovies) {
            this.totalUsers = totalUsers;
            this.activeUsers = activeUsers;
            this.inactiveUsers = inactiveUsers;
            this.totalMovies = totalMovies;
        }

        // Getters for JSON serialization
        public long getTotalUsers() { return totalUsers; }
        public long getActiveUsers() { return activeUsers; }
        public long getInactiveUsers() { return inactiveUsers; }
        public long getTotalMovies() { return totalMovies; }
    }
}
