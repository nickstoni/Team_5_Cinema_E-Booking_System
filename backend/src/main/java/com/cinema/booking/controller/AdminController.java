package com.cinema.booking.controller;

import com.cinema.booking.dto.AddMovieRequest;
import com.cinema.booking.dto.AddPromotionRequest;
import com.cinema.booking.dto.AddShowtimeRequest;
import com.cinema.booking.dto.AdminShowtimeResponse;
import com.cinema.booking.model.Genre;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.Promotion;
import com.cinema.booking.model.Showroom;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.model.User;
import com.cinema.booking.repository.GenreRepository;
import com.cinema.booking.repository.MovieRepository;
import com.cinema.booking.repository.PromotionRepository;
import com.cinema.booking.repository.ShowroomRepository;
import com.cinema.booking.repository.ShowtimeRepository;
import com.cinema.booking.repository.UserRepository;
import com.cinema.booking.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final ShowtimeRepository showtimeRepository;
    private final ShowroomRepository showroomRepository;
    private final PromotionRepository promotionRepository;
    private final EmailService emailService;

    public AdminController(UserRepository userRepository, MovieRepository movieRepository,
            GenreRepository genreRepository, ShowtimeRepository showtimeRepository,
            ShowroomRepository showroomRepository, PromotionRepository promotionRepository,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.showtimeRepository = showtimeRepository;
        this.showroomRepository = showroomRepository;
        this.promotionRepository = promotionRepository;
        this.emailService = emailService;
    }

    // ────────────────────────────── USERS ──────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving users: " + e.getMessage());
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
        try {
            Optional<User> user = userRepository.findById(userId);
            if (user.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            return ResponseEntity.ok(user.get());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving user: " + e.getMessage());
        }
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Integer userId, @RequestParam String status) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            if (!status.equals("ACTIVE") && !status.equals("INACTIVE")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid status. Use ACTIVE or INACTIVE");
            }
            User user = userOpt.get();
            user.setStatus(status);
            userRepository.save(user);
            return ResponseEntity.ok("User status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating user status: " + e.getMessage());
        }
    }

    // ────────────────────────────── MOVIES ──────────────────────────────

    @GetMapping("/movies")
    public ResponseEntity<?> getAllMovies() {
        try {
            return ResponseEntity.ok(movieRepository.findAllWithGenres());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving movies: " + e.getMessage());
        }
    }

    @PostMapping("/movies")
    public ResponseEntity<?> addMovie(@Valid @RequestBody AddMovieRequest request) {
        try {
            if (request.getTitle() == null || request.getTitle().isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Title is required");
            }
            if (request.getShowAvailability() == null ||
                    (!request.getShowAvailability().equals("current") && !request.getShowAvailability().equals("upcoming"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Show availability must be 'current' or 'upcoming'");
            }

            Movie movie = new Movie();
            movie.setTitle(request.getTitle().trim());
            movie.setDescription(request.getDescription());
            movie.setPoster(request.getPoster());
            movie.setTrailer(request.getTrailer());
            movie.setDirector(request.getDirector());
            movie.setProducer(request.getProducer());
            movie.setMpaaRating(request.getRating());
            movie.setDurationMins(request.getDurationMins());
            movie.setReleaseDate(request.getReleaseDate());
            movie.setShowAvailability(request.getShowAvailability());

            if (request.getGenres() != null) {
                for (String genreName : request.getGenres()) {
                    Optional<Genre> genreOpt = genreRepository.findByGenreName(genreName.toLowerCase().trim());
                    genreOpt.ifPresent(movie::addGenre);
                }
            }

            Movie saved = movieRepository.save(movie);
            // Re-fetch with genres eagerly loaded for the response
            Movie withGenres = movieRepository.findAllWithGenres().stream()
                    .filter(m -> m.getMovieId().equals(saved.getMovieId()))
                    .findFirst().orElse(saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(withGenres);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding movie: " + e.getMessage());
        }
    }

    // ────────────────────────────── SHOWROOMS ──────────────────────────────

    @GetMapping("/showrooms")
    public ResponseEntity<?> getAllShowrooms() {
        try {
            return ResponseEntity.ok(showroomRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving showrooms: " + e.getMessage());
        }
    }

    // ────────────────────────────── SHOWTIMES ──────────────────────────────

    @GetMapping("/showtimes")
    public ResponseEntity<?> getAllShowtimes() {
        try {
            List<Showtime> showtimes = showtimeRepository.findAllWithMovieAndShowroom();
            List<AdminShowtimeResponse> response = showtimes.stream()
                    .map(s -> new AdminShowtimeResponse(
                            s.getShowtimeId(),
                            s.getMovie().getTitle(),
                            s.getShowroom() != null ? s.getShowroom().getRoomName() : "TBD",
                            s.getShowdate(),
                            s.getShowtime(),
                            s.getDurationMins(),
                            s.getShowroom() != null ? s.getShowroom().getTotalSeats() : 0))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving showtimes: " + e.getMessage());
        }
    }

    @PostMapping("/showtimes")
    public ResponseEntity<?> addShowtime(@Valid @RequestBody AddShowtimeRequest request) {
        try {
            Optional<Movie> movieOpt = movieRepository.findById(request.getMovieId());
            if (movieOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found");
            }
            Optional<Showroom> showroomOpt = showroomRepository.findById(request.getShowroomId());
            if (showroomOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Showroom not found");
            }

            boolean conflict = showtimeRepository.existsByShowtimeAndShowdateAndShowroom_RoomId(
                    request.getStartTime(), request.getShowDate(), request.getShowroomId());
            if (conflict) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Scheduling conflict: " + showroomOpt.get().getRoomName() +
                              " is already booked on " + request.getShowDate() +
                              " at " + request.getStartTime());
            }

            Showtime showtime = new Showtime();
            showtime.setMovie(movieOpt.get());
            showtime.setShowroom(showroomOpt.get());
            showtime.setShowdate(request.getShowDate());
            showtime.setShowtime(request.getStartTime());
            showtime.setDurationMins(request.getDurationMins());

            Showtime saved = showtimeRepository.save(showtime);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new AdminShowtimeResponse(
                            saved.getShowtimeId(),
                            saved.getMovie().getTitle(),
                            saved.getShowroom().getRoomName(),
                            saved.getShowdate(),
                            saved.getShowtime(),
                            saved.getDurationMins(),
                            saved.getShowroom().getTotalSeats()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding showtime: " + e.getMessage());
        }
    }

    // ────────────────────────────── PROMOTIONS ──────────────────────────────

    @GetMapping("/promotions")
    public ResponseEntity<?> getAllPromotions() {
        try {
            return ResponseEntity.ok(promotionRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving promotions: " + e.getMessage());
        }
    }

    @PostMapping("/promotions")
    public ResponseEntity<?> addPromotion(@Valid @RequestBody AddPromotionRequest request) {
        try {
            if (request.getEndDate() != null && request.getStartDate() != null &&
                    request.getEndDate().isBefore(request.getStartDate())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("End date must be after start date");
            }
            if (promotionRepository.existsByPromoCode(request.getPromoCode().toUpperCase().trim())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Promotion code already exists: " + request.getPromoCode());
            }

            Promotion promotion = new Promotion();
            promotion.setPromoCode(request.getPromoCode().toUpperCase().trim());
            promotion.setDiscountPercent(request.getDiscountPercent());
            promotion.setStartDate(request.getStartDate());
            promotion.setEndDate(request.getEndDate());
            promotion.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

            Promotion saved = promotionRepository.save(promotion);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding promotion: " + e.getMessage());
        }
    }

    @PostMapping("/promotions/{promoId}/send")
    public ResponseEntity<?> sendPromotionEmail(@PathVariable Integer promoId) {
        try {
            Optional<Promotion> promoOpt = promotionRepository.findById(promoId);
            if (promoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Promotion not found");
            }
            Promotion promo = promoOpt.get();

            List<User> subscribedUsers = userRepository.findAll().stream()
                    .filter(u -> Boolean.TRUE.equals(u.getPromotionsEnabled())
                            && "ACTIVE".equals(u.getStatus()))
                    .collect(Collectors.toList());

            if (subscribedUsers.isEmpty()) {
                return ResponseEntity.ok("No subscribed users to notify");
            }

            int sent = 0;
            int failed = 0;
            for (User user : subscribedUsers) {
                try {
                    emailService.sendPromotionEmail(
                            user.getEmail(),
                            user.getFirstName() + " " + user.getLastName(),
                            promo.getPromoCode(),
                            promo.getDiscountPercent(),
                            promo.getStartDate(),
                            promo.getEndDate());
                    sent++;
                } catch (Exception ex) {
                    failed++;
                }
            }
            return ResponseEntity.ok("Promotion email sent to " + sent + " users" +
                    (failed > 0 ? " (" + failed + " failed)" : ""));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending promotion emails: " + e.getMessage());
        }
    }

    // ────────────────────────────── DASHBOARD ──────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardSummary() {
        try {
            long totalUsers = userRepository.count();
            long totalMovies = movieRepository.count();
            List<User> allUsers = userRepository.findAll();
            long activeUsers = allUsers.stream().filter(u -> "ACTIVE".equals(u.getStatus())).count();
            long inactiveUsers = allUsers.stream().filter(u -> "INACTIVE".equals(u.getStatus())).count();
            long totalShowtimes = showtimeRepository.count();
            long totalPromotions = promotionRepository.count();

            return ResponseEntity.ok(new DashboardSummary(
                    totalUsers, activeUsers, inactiveUsers, totalMovies, totalShowtimes, totalPromotions));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving dashboard summary: " + e.getMessage());
        }
    }

    /**
     * Inner class for dashboard summary response
     */
    public static class DashboardSummary {
        public final long totalUsers;
        public final long activeUsers;
        public final long inactiveUsers;
        public final long totalMovies;
        public final long totalShowtimes;
        public final long totalPromotions;

        public DashboardSummary(long totalUsers, long activeUsers, long inactiveUsers,
                long totalMovies, long totalShowtimes, long totalPromotions) {
            this.totalUsers = totalUsers;
            this.activeUsers = activeUsers;
            this.inactiveUsers = inactiveUsers;
            this.totalMovies = totalMovies;
            this.totalShowtimes = totalShowtimes;
            this.totalPromotions = totalPromotions;
        }

        public long getTotalUsers() { return totalUsers; }
        public long getActiveUsers() { return activeUsers; }
        public long getInactiveUsers() { return inactiveUsers; }
        public long getTotalMovies() { return totalMovies; }
        public long getTotalShowtimes() { return totalShowtimes; }
        public long getTotalPromotions() { return totalPromotions; }
    }
}