package com.cinema.booking.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cinema.booking.dto.admin.AddMovieRequest;
import com.cinema.booking.dto.admin.AddPromotionRequest;
import com.cinema.booking.dto.admin.AddShowtimeRequest;
import com.cinema.booking.dto.admin.AdminDashboardSummary;
import com.cinema.booking.dto.admin.AdminShowtimeResponse;
import com.cinema.booking.model.catalog.Movie;
import com.cinema.booking.model.catalog.Promotion;
import com.cinema.booking.model.catalog.Showroom;
import com.cinema.booking.model.catalog.Showtime;
import com.cinema.booking.model.auth.User;

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

    public AdminDashboardSummary getDashboardSummary() {
        return adminService.getDashboardSummary();
    }
}
