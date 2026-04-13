# Users' Portal Sprint - Implementation Status

## Overview
This document outlines what has been implemented and what still needs to be completed for the Users' Portal sprint (50 Points).

---

## ✅ COMPLETED (Partially Implemented)

### 1. **Showtimes Visibility – 5 pts** [DONE ~80%]
- ✅ **What's Done:**
  - Showtimes loaded from database in MovieDetails component
  - Showtimes displayed for each movie using `ShowtimeCard` component
  - Showtime data fetched from `/api/showtimes` endpoint
  - Shows date and time properly formatted
  - Shows "Book Now" button for each showtime
  
- ❌ **What's Missing:**
  - Verify backend endpoint returns data properly filtered by movie
  - Ensure showroom information is included in response
  - Add availability information (seats available count)

### 2. **Start Booking – 5 pts** [DONE ~90%]
- ✅ **What's Done:**
  - User can click "Book Now" from ShowtimeCard
  - BookingPage component receives movieId and showtimeId via URL parameters
  - Movie and showtime information displayed on booking page
  - User can select number of tickets by category (Adult, Child, Senior)
  - Navigation back to movie details works
  
- ❌ **What's Missing:**
  - Backend endpoint to fetch ticket prices (prices are hardcoded as 0.00)
  - Backend endpoint to verify seat availability for specific showtimes

### 3. **Seat Map Display – 5 pts** [DONE ~70%]
- ✅ **What's Done:**
  - SeatSelection component displays seat layout
  - Shows 10 rows (A-J) × 12 seats per row (hardcoded)
  - Visual distinction between available/selected/occupied seats
  - Legend showing seat status meanings
  - Screen indicator at top
  
- ❌ **What's Missing:**
  - **CRITICAL:** Backend doesn't track occupied seats
  - Integration with database `seats` and `bookings` tables
  - Fetch actual showroom information (room layout varies by showroom)
  - Fetch actually booked seats for selected showtime
  - Fetch showroom capacity data
  - Prevent users from seeing occupied seats locked by other users

### 4. **Seat Selection – 15 pts** [DONE ~50%]
- ✅ **What's Done:**
  - User can click seats to select/deselect them
  - Selected seats displayed in order summary
  - System prevents deselecting unavailable seats
  - UI shows selected seats count
  - Validation: Can't checkout if seat count ≠ ticket count
  
- ❌ **What's Missing:**
  - **CRITICAL:** No backend persistence of selected seats
  - No session-based seat reservation (should lock seats for 5 minutes)
  - No concurrency handling for seat locking
  - No API endpoint to reserve seats
  - No validation that selected seats match total tickets exactly (frontend-only)
  - Backend seat availability not fetched or updated

### 5. **Checkout Order Summary – 13 pts** [DONE ~40%]
- ✅ **What's Done:**
  - Order summary section in BookingPage shows:
    - Ticket count
    - Selected seats
    - Total price (calculated dynamically)
  - "Checkout" button (labeled but not functional)
  - Display of basic pricing
  
- ❌ **What's Missing:**
  - **CRITICAL:** No checkout page component created
  - Order summary missing: Movie title name (showtime card needs title)
  - Order summary missing: Showtime display
  - Order summary missing: Price per ticket by type
  - Order summary missing: Tax calculation and display
  - No API endpoint to create order
  - No confirmation functionality
  - All price information is hardcoded or comes from incomplete backend

### 6. **Email Confirmation Page – 5 pts** [NOT STARTED]
- ❌ **What's Missing:**
  - Email confirmation component not created
  - User can confirm existing email or enter new one
  - Backend endpoint to retrieve user email
  - Backend endpoint to validate/update email before checkout
  - Email service integration (partially exists in backend)

### 7. **Payment Processing Page (Mockup) – 5 pts** [NOT STARTED]
- ❌ **What's Missing:**
  - Payment page component not created
  - Mock payment processing display
  - Order number/reference display
  - Payment confirmation message
  - Navigation from checkout to payment page

### 8. **Login Requirement at Checkout – 2 pts** [NOT DONE]
- ❌ **What's Missing:**
  - Check if user is authenticated before allowing checkout
  - Redirect to login if not authenticated
  - Preserve selected seats during login redirect
  - Resume checkout after login

---

## 🔴 NOT STARTED / MISSING BACKEND

### Models/Entities to Create:
- [ ] `Booking` entity (mapped to `bookings` table)
- [ ] `Ticket` entity (mapped to `tickets` table)
- [ ] `Seat` entity (mapped to `seats` table)
- [ ] `Showroom` entity (mapped to `showrooms` table)
- [ ] DTOs for API requests/responses

### Repositories Needed:
- [ ] `BookingRepository` (CRUD + custom queries)
- [ ] `TicketRepository` (CRUD)
- [ ] `SeatRepository` (find by showroom, check availability)
- [ ] `ShowroomRepository` (find by id, get seat layout)

### Controllers/Endpoints Needed:
- [ ] `BookingController` with endpoints:
  - `POST /api/bookings` - Create booking
  - `GET /api/bookings/{id}` - Get booking details
  - `GET /api/bookings/user/{userId}` - Get user's bookings
  - `PATCH /api/bookings/{id}/confirm` - Confirm order

- [ ] `SeatController` with endpoints:
  - `GET /api/showtimes/{showtimeId}/seats` - Get seat layout + availability
  - `POST /api/seats/reserve` - Reserve seats temporarily
  - `DELETE /api/seats/reserve/{reservationId}` - Release seats
  - `GET /api/seats/showroom/{showtimeId}` - Get available seats

- [ ] `ShowroomController` with endpoints:
  - `GET /api/showrooms` - List all showrooms
  - `GET /api/showrooms/{id}` - Get showroom details

### Services Needed:
- [ ] `BookingService` - Booking business logic
- [ ] `SeatReservationService` - Handle seat locking/unlocking
- [ ] `TicketService` - Ticket generation and pricing

### Frontend Components to Create:
- [ ] `CheckoutPage.js` - Order review and email confirmation
- [ ] `PaymentPage.js` - Mock payment processing
- [ ] Possibly: `SeatReservation.js` - Handle reserved seats state

### Frontend Updates Needed:
- [ ] BookingPage: Add navigation to CheckoutPage
- [ ] BookingPage: Fetch actual prices from backend
- [ ] BookingPage: Fetch occupied seats from backend
- [ ] BookingPage: Show seat count availability per showtime
- [ ] Add route: `/checkout`
- [ ] Add route: `/payment`

---

## Database Status

✅ **Tables Exist:**
- `shows` - Showtimes with showroom reference
- `seats` - Seats by showroom
- `bookings` - Booking records
- `tickets` - Ticket records linked to bookings
- `showrooms` - Theater room information
- `users` - User accounts

❌ **Not Utilized Yet:**
- Seat availability tracking
- Booking creation
- Ticket pricing from database
- Email integration with orders

---

## Priority Implementation Order

### Phase 1 (Critical Path):
1. Create Booking, Ticket, Seat, Showroom models
2. Create SeatController with `/api/showtimes/{id}/seats` endpoint
3. Update BookingPage to fetch actual occupied seats
4. Create CheckoutPage component with order summary

### Phase 2 (Core Functionality):
5. Create BookingController with POST `/api/bookings` endpoint
6. Fetch ticket prices from backend
7. Add email confirmation on checkout page
8. Create PaymentPage component (mockup)

### Phase 3 (Authentication & Polish):
9. Add login requirement at checkout
10. Preserve seats during login redirect
11. Add order confirmation functionality
12. Email service integration

---

## Estimated Effort

- **Backend Models & Repositories:** 2-3 hours
- **Backend Controllers & Services:** 3-4 hours
- **Frontend Checkout/Payment Pages:** 2-3 hours
- **Frontend Integration:** 2-3 hours
- **Testing & Bug Fixes:** 2-3 hours

**Total:** ~12-16 hours of development

