package com.cinema.booking.dto.profile;

import java.util.List;

import com.cinema.booking.model.auth.Address;
import com.cinema.booking.model.catalog.Movie;
import com.cinema.booking.model.auth.PaymentCard;
import com.cinema.booking.model.auth.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private User user;
    private Address address;
    private List<PaymentCard> cards;
    private List<Movie> favoriteMovies;
}