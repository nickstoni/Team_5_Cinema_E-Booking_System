package com.cinema.booking.controller;

import com.cinema.booking.dto.ProfileResponse;
import com.cinema.booking.dto.PaymentCardUpsertRequest;
import com.cinema.booking.service.ProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/{userId}")
    public ProfileResponse getProfile(@PathVariable Integer userId) {
        return profileService.getProfile(userId);
    }

    @PutMapping("/{userId}")
    public String updateProfile(@PathVariable Integer userId, @RequestBody ProfileResponse request) {
        return profileService.updateProfile(userId, request);
    }

    @PostMapping("/{userId}/cards")
    public Object addCard(@PathVariable Integer userId, @RequestBody PaymentCardUpsertRequest card) {
        return profileService.addCard(userId, card);
    }

    @PutMapping("/{userId}/cards/{cardId}")
    public Object updateCard(@PathVariable Integer userId,
                             @PathVariable Integer cardId,
                             @RequestBody PaymentCardUpsertRequest updatedCard) {
        return profileService.updateCard(userId, cardId, updatedCard);
    }

    @DeleteMapping("/{userId}/cards/{cardId}")
    public String deleteCard(@PathVariable Integer userId, @PathVariable Integer cardId) {
        return profileService.deleteCard(userId, cardId);
    }

    @GetMapping("/{userId}/favorites")
    public Object getFavorites(@PathVariable Integer userId) {
        return profileService.getFavorites(userId);
    }

    @PostMapping("/{userId}/favorites/{movieId}")
    public Object addFavorite(@PathVariable Integer userId, @PathVariable Integer movieId) {
        return profileService.addFavorite(userId, movieId);
    }

    @DeleteMapping("/{userId}/favorites/{movieId}")
    public String deleteFavorite(@PathVariable Integer userId, @PathVariable Integer movieId) {
        return profileService.deleteFavorite(userId, movieId);
    }
}