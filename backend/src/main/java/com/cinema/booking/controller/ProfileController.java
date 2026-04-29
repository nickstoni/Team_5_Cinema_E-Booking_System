package com.cinema.booking.controller;

import com.cinema.booking.dto.ProfileResponse;
import com.cinema.booking.dto.PaymentCardUpsertRequest;
import com.cinema.booking.service.ProfileFacade;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final ProfileFacade profileFacade;

    public ProfileController(ProfileFacade profileFacade) {
        this.profileFacade = profileFacade;
    }

    @GetMapping("/{userId}")
    public ProfileResponse getProfile(@PathVariable Integer userId) {
        return profileFacade.getProfile(userId);
    }

    @PutMapping("/{userId}")
    public String updateProfile(@PathVariable Integer userId, @RequestBody ProfileResponse request) {
        return profileFacade.updateProfile(userId, request);
    }

    @PostMapping("/{userId}/cards")
    public Object addCard(@PathVariable Integer userId, @RequestBody PaymentCardUpsertRequest card) {
        return profileFacade.addCard(userId, card);
    }

    @PutMapping("/{userId}/cards/{cardId}")
    public Object updateCard(@PathVariable Integer userId,
                             @PathVariable Integer cardId,
                             @RequestBody PaymentCardUpsertRequest updatedCard) {
        return profileFacade.updateCard(userId, cardId, updatedCard);
    }

    @DeleteMapping("/{userId}/cards/{cardId}")
    public String deleteCard(@PathVariable Integer userId, @PathVariable Integer cardId) {
        return profileFacade.deleteCard(userId, cardId);
    }

    @GetMapping("/{userId}/favorites")
    public Object getFavorites(@PathVariable Integer userId) {
        return profileFacade.getFavorites(userId);
    }

    @PostMapping("/{userId}/favorites/{movieId}")
    public Object addFavorite(@PathVariable Integer userId, @PathVariable Integer movieId) {
        return profileFacade.addFavorite(userId, movieId);
    }

    @DeleteMapping("/{userId}/favorites/{movieId}")
    public String deleteFavorite(@PathVariable Integer userId, @PathVariable Integer movieId) {
        return profileFacade.deleteFavorite(userId, movieId);
    }
}