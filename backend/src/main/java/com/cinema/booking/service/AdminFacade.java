package com.cinema.booking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cinema.booking.dto.AddMovieRequest;
import com.cinema.booking.dto.AddPromotionRequest;
import com.cinema.booking.dto.AddShowtimeRequest;
import com.cinema.booking.dto.AdminDashboardSummary;
import com.cinema.booking.dto.AdminShowtimeResponse;
import com.cinema.booking.dto.PromotionValidationResponse;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.Promotion;
import com.cinema.booking.model.Showroom;
import com.cinema.booking.model.Showtime;
import com.cinema.booking.model.User;

@Service
public class AdminFacade {

    private final AdminService adminService;

    public AdminFacade(AdminService adminService) {
        this.adminService = adminService;
    }

    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    public User getUserById(Integer userId) {
        return adminService.getUserById(userId);
    }

    public String updateUserStatus(Integer userId, String status) {
        return adminService.updateUserStatus(userId, status);
    }

    public List<Movie> getAllMovies() {
        return adminService.getAllMovies();
    }

    public Movie addMovie(AddMovieRequest request) {
        return adminService.addMovie(request);
    }

    public String deleteMovie(Integer movieId) {
        return adminService.deleteMovie(movieId);
    }

    public List<Showroom> getAllShowrooms() {
        return adminService.getAllShowrooms();
    }

    public List<AdminShowtimeResponse> getAllShowtimes() {
        return adminService.getAllShowtimes();
    }

    public AdminShowtimeResponse addShowtime(AddShowtimeRequest request) {
        return adminService.addShowtime(request);
    }

    public String deleteShowtime(Integer showtimeId) {
        return adminService.deleteShowtime(showtimeId);
    }

    public List<Promotion> getAllPromotions() {
        return adminService.getAllPromotions();
    }

    public Promotion addPromotion(AddPromotionRequest request) {
        return adminService.addPromotion(request);
    }

    public String deletePromotion(Integer promoId) {
        return adminService.deletePromotion(promoId);
    }

    public String sendPromotionEmail(Integer promoId) {
        return adminService.sendPromotionEmail(promoId);
    }

    public PromotionValidationResponse validatePromotionCode(String promoCode) {
        return adminService.validatePromotionCode(promoCode);
    }

    public AdminDashboardSummary getDashboardSummary() {
        return adminService.getDashboardSummary();
    }
}

