package com.cinema.booking.controller;

import com.cinema.booking.model.Address;
import com.cinema.booking.model.PaymentCard;
import com.cinema.booking.model.RegisterRequest;
import com.cinema.booking.model.User;
import com.cinema.booking.repository.AddressRepository;
import com.cinema.booking.repository.PaymentCardRepository;
import com.cinema.booking.repository.UserRepository;
import com.cinema.booking.util.EncryptionUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PaymentCardRepository paymentCardRepository;

    public AuthController(UserRepository userRepository,
                          AddressRepository addressRepository,
                          PaymentCardRepository paymentCardRepository) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.paymentCardRepository = paymentCardRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\":\"Full name is required\"}");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\":\"Email is required\"}");
        }

        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"message\":\"Phone number is required\"}");
        }

        if (request.getPassword() == null || request.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body("{\"message\":\"Password must be at least 8 characters\"}");
        }

        if (request.getConfirmPassword() == null || !request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("{\"message\":\"Passwords do not match\"}");
        }

        if (userRepository.findByEmail(request.getEmail().trim().toLowerCase()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("{\"message\":\"An account with this email already exists\"}");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPhoneNumber(request.getPhoneNumber().trim());
        user.setPassword(request.getPassword()); // later replace with hashed password
        user.setPromotionsEnabled(false);
        user.setStatus("Active");

        User savedUser = userRepository.save(user);

        if (request.getAddress() != null) {
            RegisterRequest.AddressRequest addressRequest = request.getAddress();

            Address address = new Address();
            address.setUserId(savedUser.getUserId());
            address.setAddressLine1(addressRequest.getAddressLine1());
            address.setAddressLine2(addressRequest.getAddressLine2());
            address.setCity(addressRequest.getCity());
            address.setState(addressRequest.getState());
            address.setPostalCode(addressRequest.getPostalCode());
            address.setCountry(addressRequest.getCountry());

            addressRepository.save(address);
        }

        if (request.getPaymentCards() != null) {
            if (request.getPaymentCards().size() > 3) {
                return ResponseEntity.badRequest()
                        .body("{\"message\":\"Users cannot store more than 3 payment cards\"}");
            }

            for (RegisterRequest.PaymentCardRequest cardRequest : request.getPaymentCards()) {
                PaymentCard card = new PaymentCard();
                card.setUserId(savedUser.getUserId());
                card.setCardType(cardRequest.getCardType());

                String cardNumber = cardRequest.getCardNumber();
                String cvv = cardRequest.getCvv();

                if (cardNumber != null && !cardNumber.isBlank()) {
                    card.setCardNumber(EncryptionUtil.encrypt(cardNumber));
                    if (cardNumber.length() >= 4) {
                        card.setLastFour(cardNumber.substring(cardNumber.length() - 4));
                    } else {
                        card.setLastFour("");
                    }
                } else {
                    card.setCardNumber("");
                    card.setLastFour("");
                }

                card.setCardHolderName(cardRequest.getCardHolderName());
                card.setExpiryMonth(cardRequest.getExpiryMonth());
                card.setExpiryYear(cardRequest.getExpiryYear());

                if (cvv != null && !cvv.isBlank()) {
                    card.setCvv(EncryptionUtil.encrypt(cvv));
                } else {
                    card.setCvv("");
                }

                paymentCardRepository.save(card);
            }
        }

        return ResponseEntity.ok("{\"success\":true,\"message\":\"Account created successfully\"}");
    }
}