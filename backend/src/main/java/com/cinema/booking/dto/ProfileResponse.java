package com.cinema.booking.dto;

import java.util.List;

import com.cinema.booking.model.Address;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.PaymentCard;
import com.cinema.booking.model.User;

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