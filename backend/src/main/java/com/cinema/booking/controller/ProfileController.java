package com.cinema.booking.controller;

import com.cinema.booking.util.EncryptionUtil;
import com.cinema.booking.model.*;
import com.cinema.booking.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PaymentCardRepository paymentCardRepository;
    private final FavoriteMovieRepository favoriteMovieRepository;
    private final MovieRepository movieRepository;

    public ProfileController(UserRepository userRepository,
                             AddressRepository addressRepository,
                             PaymentCardRepository paymentCardRepository,
                             FavoriteMovieRepository favoriteMovieRepository,
                             MovieRepository movieRepository) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.paymentCardRepository = paymentCardRepository;
        this.favoriteMovieRepository = favoriteMovieRepository;
        this.movieRepository = movieRepository;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Integer userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOpt.get();
        Optional<Address> addressOpt = addressRepository.findByUserId(userId);
        List<PaymentCard> cards = paymentCardRepository.findByUserId(userId);

        List<FavoriteMovie> favorites = favoriteMovieRepository.findByUserId(userId);
        List<Movie> favoriteMovies = new ArrayList<>();
        for (FavoriteMovie favorite : favorites) {
            movieRepository.findById(favorite.getMovieId()).ifPresent(favoriteMovies::add);
        }

        ProfileResponse response = new ProfileResponse();
        response.setUser(user);
        response.setAddress(addressOpt.orElse(null));
        response.setCards(cards);
        response.setFavoriteMovies(favoriteMovies);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateProfile(@PathVariable Integer userId, @RequestBody ProfileResponse request) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User existingUser = userOpt.get();
        User incomingUser = request.getUser();

        if (incomingUser != null) {
            existingUser.setFullName(incomingUser.getFullName());
            existingUser.setPhoneNumber(incomingUser.getPhoneNumber());
            existingUser.setPromotionsEnabled(incomingUser.getPromotionsEnabled());
            // Email is intentionally NOT updated
            userRepository.save(existingUser);
        }

        Address incomingAddress = request.getAddress();
        if (incomingAddress != null) {
            Optional<Address> addressOpt = addressRepository.findByUserId(userId);
            Address address = addressOpt.orElse(new Address());

            address.setUserId(userId);
            address.setAddressLine1(incomingAddress.getAddressLine1());
            address.setAddressLine2(incomingAddress.getAddressLine2());
            address.setCity(incomingAddress.getCity());
            address.setState(incomingAddress.getState());
            address.setPostalCode(incomingAddress.getPostalCode());
            address.setCountry(incomingAddress.getCountry());

            addressRepository.save(address);
        }

        return ResponseEntity.ok("Profile updated successfully");
    }

    @PostMapping("/{userId}/cards")
    public ResponseEntity<?> addCard(@PathVariable Integer userId, @RequestBody PaymentCard card) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        long cardCount = paymentCardRepository.countByUserId(userId);
        if (cardCount >= 3) {
            return ResponseEntity.badRequest().body("Users cannot store more than 3 payment cards.");
        }

        card.setUserId(userId);

        String rawCardNumber = card.getCardNumber();
        String rawCvv = card.getCvv();

        if (rawCardNumber != null && !rawCardNumber.isBlank()) {
            if (rawCardNumber.length() >= 4) {
                card.setLastFour(rawCardNumber.substring(rawCardNumber.length() - 4));
            } else {
                card.setLastFour("");
            }

            System.out.println("RAW CARD NUMBER: " + rawCardNumber);
            System.out.println("ENCRYPTED CARD NUMBER: " + EncryptionUtil.encrypt(rawCardNumber));

            card.setCardNumber(EncryptionUtil.encrypt(rawCardNumber));
        } else {
            card.setCardNumber("");
            card.setLastFour("");
        }

        if (rawCvv != null && !rawCvv.isBlank()) {
            System.out.println("RAW CVV: " + rawCvv);
            System.out.println("ENCRYPTED CVV: " + EncryptionUtil.encrypt(rawCvv));

            card.setCvv(EncryptionUtil.encrypt(rawCvv));
        } else {
            card.setCvv("");
        }

        PaymentCard saved = paymentCardRepository.save(card);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{userId}/cards/{cardId}")
    public ResponseEntity<?> updateCard(@PathVariable Integer userId,
                                        @PathVariable Integer cardId,
                                        @RequestBody PaymentCard updatedCard) {
        Optional<PaymentCard> cardOpt = paymentCardRepository.findById(cardId);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Card not found");
        }

        PaymentCard existingCard = cardOpt.get();
        if (!existingCard.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("This card does not belong to the user");
        }

        existingCard.setCardType(updatedCard.getCardType());
        existingCard.setCardHolderName(updatedCard.getCardHolderName());
        existingCard.setExpiryMonth(updatedCard.getExpiryMonth());
        existingCard.setExpiryYear(updatedCard.getExpiryYear());

        String rawCardNumber = updatedCard.getCardNumber();
        String rawCvv = updatedCard.getCvv();

        if (rawCardNumber != null && !rawCardNumber.isBlank()) {
            System.out.println("UPDATING RAW CARD NUMBER: " + rawCardNumber);
            System.out.println("UPDATING ENCRYPTED CARD NUMBER: " + EncryptionUtil.encrypt(rawCardNumber));

            existingCard.setCardNumber(EncryptionUtil.encrypt(rawCardNumber));

            if (rawCardNumber.length() >= 4) {
                existingCard.setLastFour(rawCardNumber.substring(rawCardNumber.length() - 4));
            } else {
                existingCard.setLastFour("");
            }
        }

        if (rawCvv != null && !rawCvv.isBlank()) {
            System.out.println("UPDATING RAW CVV: " + rawCvv);
            System.out.println("UPDATING ENCRYPTED CVV: " + EncryptionUtil.encrypt(rawCvv));

            existingCard.setCvv(EncryptionUtil.encrypt(rawCvv));
        }

        return ResponseEntity.ok(paymentCardRepository.save(existingCard));
    }

    @DeleteMapping("/{userId}/cards/{cardId}")
    public ResponseEntity<?> deleteCard(@PathVariable Integer userId, @PathVariable Integer cardId) {
        Optional<PaymentCard> cardOpt = paymentCardRepository.findById(cardId);
        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Card not found");
        }

        PaymentCard card = cardOpt.get();
        if (!card.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("This card does not belong to the user");
        }

        paymentCardRepository.delete(card);
        return ResponseEntity.ok("Card deleted successfully");
    }

    @GetMapping("/{userId}/favorites")
    public ResponseEntity<?> getFavorites(@PathVariable Integer userId) {
        List<FavoriteMovie> favorites = favoriteMovieRepository.findByUserId(userId);
        List<Movie> movies = new ArrayList<>();

        for (FavoriteMovie favorite : favorites) {
            movieRepository.findById(favorite.getMovieId()).ifPresent(movies::add);
        }

        return ResponseEntity.ok(movies);
    }

    @PostMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<?> addFavorite(@PathVariable Integer userId, @PathVariable Integer movieId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (!movieRepository.existsById(movieId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Movie not found");
        }

        if (favoriteMovieRepository.existsByUserIdAndMovieId(userId, movieId)) {
            return ResponseEntity.badRequest().body("Movie is already in favorites");
        }

        FavoriteMovie favorite = new FavoriteMovie();
        favorite.setUserId(userId);
        favorite.setMovieId(movieId);

        return ResponseEntity.ok(favoriteMovieRepository.save(favorite));
    }

    @DeleteMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<?> deleteFavorite(@PathVariable Integer userId, @PathVariable Integer movieId) {
        Optional<FavoriteMovie> favoriteOpt = favoriteMovieRepository.findByUserIdAndMovieId(userId, movieId);
        if (favoriteOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Favorite not found");
        }

        favoriteMovieRepository.delete(favoriteOpt.get());
        return ResponseEntity.ok("Favorite removed successfully");
    }
}