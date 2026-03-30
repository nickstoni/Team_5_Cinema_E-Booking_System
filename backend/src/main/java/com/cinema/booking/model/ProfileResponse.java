package com.cinema.booking.model;

import java.util.List;

public class ProfileResponse {
    private User user;
    private Address address;
    private List<PaymentCard> cards;
    private List<Movie> favoriteMovies;

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }

    public List<PaymentCard> getCards() { return cards; }
    public void setCards(List<PaymentCard> cards) { this.cards = cards; }

    public List<Movie> getFavoriteMovies() { return favoriteMovies; }
    public void setFavoriteMovies(List<Movie> favoriteMovies) { this.favoriteMovies = favoriteMovies; }
}