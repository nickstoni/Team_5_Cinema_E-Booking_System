package com.cinema.booking.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.cinema.booking.dto.ProfileResponse;
import com.cinema.booking.dto.PaymentCardUpsertRequest;
import com.cinema.booking.model.Address;
import com.cinema.booking.model.FavoriteMovie;
import com.cinema.booking.model.Movie;
import com.cinema.booking.model.PaymentCard;
import com.cinema.booking.model.User;
import com.cinema.booking.repository.AddressRepository;
import com.cinema.booking.repository.FavoriteMovieRepository;
import com.cinema.booking.repository.MovieRepository;
import com.cinema.booking.repository.PaymentCardRepository;
import com.cinema.booking.repository.UserRepository;
import com.cinema.booking.service.EmailService;
import com.cinema.booking.service.EncryptionService;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PaymentCardRepository paymentCardRepository;
    private final FavoriteMovieRepository favoriteMovieRepository;
    private final MovieRepository movieRepository;
    private final EmailService emailService;
    private final EncryptionService encryptionService;

    public ProfileService(
            UserRepository userRepository,
            AddressRepository addressRepository,
            PaymentCardRepository paymentCardRepository,
            FavoriteMovieRepository favoriteMovieRepository,
            MovieRepository movieRepository,
            EmailService emailService,
            EncryptionService encryptionService) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.paymentCardRepository = paymentCardRepository;
        this.favoriteMovieRepository = favoriteMovieRepository;
        this.movieRepository = movieRepository;
        this.emailService = emailService;
        this.encryptionService = encryptionService;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Optional<Address> addressOpt = addressRepository.findByUserId(userId);
        List<PaymentCard> cards = paymentCardRepository.findByUserId(userId);
        List<Movie> favoriteMovies = loadFavoriteMovies(userId);

        ProfileResponse response = new ProfileResponse();
        response.setUser(user);
        response.setAddress(addressOpt.orElse(null));
        response.setCards(cards);
        response.setFavoriteMovies(favoriteMovies);
        return response;
    }

    @Transactional
    public String updateProfile(Integer userId, ProfileResponse request) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        User incomingUser = request.getUser();
        boolean profileUpdated = false;

        if (incomingUser != null) {
            existingUser.setFirstName(incomingUser.getFirstName());
            existingUser.setLastName(incomingUser.getLastName());
            existingUser.setPhoneNumber(incomingUser.getPhoneNumber());
            existingUser.setPromotionsEnabled(incomingUser.getPromotionsEnabled());
            userRepository.save(existingUser);
            profileUpdated = true;
        }

        Address incomingAddress = request.getAddress();
        if (incomingAddress != null) {
            Address address = addressRepository.findByUserId(userId).orElse(new Address());
            address.setUserId(userId);
            address.setAddressLine1(incomingAddress.getAddressLine1());
            address.setAddressLine2(incomingAddress.getAddressLine2());
            address.setCity(incomingAddress.getCity());
            address.setState(incomingAddress.getState());
            address.setPostalCode(incomingAddress.getPostalCode());
            address.setCountry(incomingAddress.getCountry());
            addressRepository.save(address);
            profileUpdated = true;
        }

        if (profileUpdated) {
            try {
                String fullName = existingUser.getFirstName() + " " + existingUser.getLastName();
                emailService.sendProfileChangeNotification(existingUser.getEmail(), fullName);
            } catch (Exception e) {
                System.err.println("Failed to send profile change notification: " + e.getMessage());
            }
        }

        return "Profile updated successfully";
    }

    @Transactional
    public PaymentCard addCard(Integer userId, PaymentCardUpsertRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        long cardCount = paymentCardRepository.countByUserId(userId);
        if (cardCount >= 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Users cannot store more than 3 payment cards.");
        }

        PaymentCard card = new PaymentCard();
        card.setUser(user);
        card.setCardType(request.getCardType());
        card.setCardHolderName(request.getCardHolderName());
        card.setExpiryMonth(request.getExpiryMonth());
        card.setExpiryYear(request.getExpiryYear());
        encryptPaymentCard(card, request.getCardNumber(), request.getCvv());
        return paymentCardRepository.save(card);
    }

    @Transactional
    public PaymentCard updateCard(Integer userId, Integer cardId, PaymentCardUpsertRequest request) {
        PaymentCard existingCard = paymentCardRepository.findById(cardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found"));

        if (!existingCard.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This card does not belong to the user");
        }

        existingCard.setCardType(request.getCardType());
        existingCard.setCardHolderName(request.getCardHolderName());
        existingCard.setExpiryMonth(request.getExpiryMonth());
        existingCard.setExpiryYear(request.getExpiryYear());

        encryptPaymentCard(existingCard, request.getCardNumber(), request.getCvv());
        return paymentCardRepository.save(existingCard);
    }

    @Transactional
    public String deleteCard(Integer userId, Integer cardId) {
        PaymentCard card = paymentCardRepository.findById(cardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found"));

        if (!card.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This card does not belong to the user");
        }

        paymentCardRepository.delete(card);
        return "Card deleted successfully";
    }

    @Transactional(readOnly = true)
    public List<Movie> getFavorites(Integer userId) {
        return loadFavoriteMovies(userId);
    }

    @Transactional
    public FavoriteMovie addFavorite(Integer userId, Integer movieId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (!movieRepository.existsById(movieId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found");
        }

        if (favoriteMovieRepository.existsByUserIdAndMovieId(userId, movieId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Movie is already in favorites");
        }

        FavoriteMovie favorite = new FavoriteMovie();
        favorite.setUserId(userId);
        favorite.setMovieId(movieId);
        return favoriteMovieRepository.save(favorite);
    }

    @Transactional
    public String deleteFavorite(Integer userId, Integer movieId) {
        FavoriteMovie favorite = favoriteMovieRepository.findByUserIdAndMovieId(userId, movieId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorite not found"));
        paymentCardRepository.flush();
        favoriteMovieRepository.delete(favorite);
        return "Favorite removed successfully";
    }

    private List<Movie> loadFavoriteMovies(Integer userId) {
        List<FavoriteMovie> favorites = favoriteMovieRepository.findByUserId(userId);
        List<Movie> favoriteMovies = new ArrayList<>();
        for (FavoriteMovie favorite : favorites) {
            movieRepository.findById(favorite.getMovieId()).ifPresent(favoriteMovies::add);
        }
        return favoriteMovies;
    }

    private void encryptPaymentCard(PaymentCard card, String rawCardNumber, String rawCvv) {
        if (rawCardNumber != null && !rawCardNumber.isBlank()) {
            if (rawCardNumber.length() >= 4) {
                card.setLastFour(rawCardNumber.substring(rawCardNumber.length() - 4));
            } else {
                card.setLastFour("");
            }
            card.setCardNumber(encryptionService.encrypt(rawCardNumber));
        } else {
            if (card.getCardId() == null) {
                card.setCardNumber("");
                card.setLastFour("");
            }
        }

        if (rawCvv != null && !rawCvv.isBlank()) {
            card.setCvv(encryptionService.encrypt(rawCvv));
        } else if (card.getCardId() == null) {
            card.setCvv("");
        }
    }
}