package com.cinema.booking.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.cinema.booking.dto.PaymentCardUpsertRequest;
import com.cinema.booking.dto.ProfileResponse;
import com.cinema.booking.model.FavoriteMovie;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.PaymentCard;

@Service
public class ProfileFacade {

    private final ProfileService profileService;

    public ProfileFacade(ProfileService profileService) {
        this.profileService = profileService;
    }

    public ProfileResponse getProfile(Integer userId) {
        return profileService.getProfile(userId);
    }

    public String updateProfile(Integer userId, ProfileResponse request) {
        return profileService.updateProfile(userId, request);
    }

    public PaymentCard addCard(Integer userId, PaymentCardUpsertRequest request) {
        return profileService.addCard(userId, request);
    }

    public PaymentCard updateCard(Integer userId, Integer cardId, PaymentCardUpsertRequest request) {
        return profileService.updateCard(userId, cardId, request);
    }

    public String deleteCard(Integer userId, Integer cardId) {
        return profileService.deleteCard(userId, cardId);
    }

    public List<Movie> getFavorites(Integer userId) {
        return profileService.getFavorites(userId);
    }

    public FavoriteMovie addFavorite(Integer userId, Integer movieId) {
        return profileService.addFavorite(userId, movieId);
    }

    public String deleteFavorite(Integer userId, Integer movieId) {
        return profileService.deleteFavorite(userId, movieId);
    }
}
