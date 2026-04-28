package com.cinema.booking.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.cinema.booking.dto.AddMovieRequest;
import com.cinema.booking.dto.AddPromotionRequest;
import com.cinema.booking.dto.AddShowtimeRequest;
import com.cinema.booking.dto.AdminDashboardSummary;
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

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final ShowtimeRepository showtimeRepository;
    private final ShowroomRepository showroomRepository;
    private final PromotionRepository promotionRepository;
    private final EmailService emailService;

    public AdminService(UserRepository userRepository, MovieRepository movieRepository,
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

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional
    public String updateUserStatus(Integer userId, String status) {
        if (!"ACTIVE".equals(status) && !"INACTIVE".equals(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status. Use ACTIVE or INACTIVE");
        }

        User user = getUserById(userId);
        user.setStatus(status);
        userRepository.save(user);
        return "User status updated successfully";
    }

    @Transactional(readOnly = true)
    public List<Movie> getAllMovies() {
        return movieRepository.findAllWithGenres();
    }

    @Transactional
    public Movie addMovie(AddMovieRequest request) {
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }

        if (request.getShowAvailability() == null
                || (!"current".equals(request.getShowAvailability())
                && !"upcoming".equals(request.getShowAvailability()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Show availability must be 'current' or 'upcoming'");
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
                genreRepository.findByGenreName(genreName.toLowerCase().trim()).ifPresent(movie::addGenre);
            }
        }

        Movie saved = movieRepository.save(movie);
        return movieRepository.findAllWithGenres().stream()
                .filter(existingMovie -> existingMovie.getMovieId().equals(saved.getMovieId()))
                .findFirst()
                .orElse(saved);
    }

    @Transactional(readOnly = true)
    public List<Showroom> getAllShowrooms() {
        return showroomRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<AdminShowtimeResponse> getAllShowtimes() {
        return showtimeRepository.findAllWithMovieAndShowroom().stream()
                .map(this::toAdminShowtimeResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminShowtimeResponse addShowtime(AddShowtimeRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found"));
        Showroom showroom = showroomRepository.findById(request.getShowroomId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Showroom not found"));

        boolean conflict = showtimeRepository.existsByShowtimeAndShowdateAndShowroom_RoomId(
                request.getStartTime(), request.getShowDate(), request.getShowroomId());
        if (conflict) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Scheduling conflict: " + showroom.getRoomName()
                            + " is already booked on " + request.getShowDate()
                            + " at " + request.getStartTime());
        }

        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setShowroom(showroom);
        showtime.setShowdate(request.getShowDate());
        showtime.setShowtime(request.getStartTime());
        showtime.setDurationMins(request.getDurationMins());

        return toAdminShowtimeResponse(showtimeRepository.save(showtime));
    }

    @Transactional(readOnly = true)
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    @Transactional
    public Promotion addPromotion(AddPromotionRequest request) {
        if (request.getEndDate() != null && request.getStartDate() != null
                && request.getEndDate().isBefore(request.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date must be after start date");
        }

        String promoCode = request.getPromoCode().toUpperCase().trim();
        if (promotionRepository.existsByPromoCode(promoCode)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Promotion code already exists: " + request.getPromoCode());
        }

        Promotion promotion = new Promotion();
        promotion.setPromoCode(promoCode);
        promotion.setDiscountPercent(request.getDiscountPercent());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        return promotionRepository.save(promotion);
    }

    @Transactional(readOnly = true)
    public String sendPromotionEmail(Integer promoId) {
        Promotion promotion = promotionRepository.findById(promoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Promotion not found"));

        List<User> subscribedUsers = userRepository.findAll().stream()
                .filter(user -> Boolean.TRUE.equals(user.getPromotionsEnabled())
                        && "ACTIVE".equals(user.getStatus()))
                .collect(Collectors.toList());

        if (subscribedUsers.isEmpty()) {
            return "No subscribed users to notify";
        }

        int sent = 0;
        int failed = 0;
        for (User user : subscribedUsers) {
            try {
                emailService.sendPromotionEmail(
                        user.getEmail(),
                        user.getFirstName() + " " + user.getLastName(),
                        promotion.getPromoCode(),
                        promotion.getDiscountPercent(),
                        promotion.getStartDate(),
                        promotion.getEndDate());
                sent++;
            } catch (Exception ex) {
                failed++;
            }
        }

        return "Promotion email sent to " + sent + " users" + (failed > 0 ? " (" + failed + " failed)" : "");
    }

    @Transactional(readOnly = true)
    public AdminDashboardSummary getDashboardSummary() {
        long totalUsers = userRepository.count();
        long totalMovies = movieRepository.count();
        List<User> allUsers = userRepository.findAll();
        long activeUsers = allUsers.stream().filter(user -> "ACTIVE".equals(user.getStatus())).count();
        long inactiveUsers = allUsers.stream().filter(user -> "INACTIVE".equals(user.getStatus())).count();
        long totalShowtimes = showtimeRepository.count();
        long totalPromotions = promotionRepository.count();

        return new AdminDashboardSummary(
                totalUsers,
                activeUsers,
                inactiveUsers,
                totalMovies,
                totalShowtimes,
                totalPromotions);
    }

    private AdminShowtimeResponse toAdminShowtimeResponse(Showtime showtime) {
        return new AdminShowtimeResponse(
                showtime.getShowtimeId(),
                showtime.getMovie().getTitle(),
                showtime.getShowroom() != null ? showtime.getShowroom().getRoomName() : "TBD",
                showtime.getShowdate(),
                showtime.getShowtime(),
                showtime.getDurationMins(),
                showtime.getShowroom() != null ? showtime.getShowroom().getTotalSeats() : 0);
    }
}