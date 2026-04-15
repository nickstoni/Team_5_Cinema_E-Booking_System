# Users' Portal Sprint - Implementation Status

## Overview
This status is updated from the current codebase (frontend + backend) and lists what is completed and what is still missing for the Users' Portal sprint (50 points).

---

## Feature Status (Completed vs Not Completed)

### 1. Showtime Visibility - 5 pts
**Status:** DONE (~100%)

- Completed:
  - `MovieDetails` fetches movie-specific showtimes from `GET /api/showtimes/movie/{movieId}`.
  - `ShowtimeCard` displays date, time, room name, and available seat count.
  - Backend `ShowtimeController` and `ShowtimeRepository` return showroom + availability fields (`showroomName`, `totalSeats`, `bookedSeats`, `availableSeats`).
  - "Book Now" navigation is wired to booking route.

- Not completed:
  - None identified in code for this requirement.

### 2. Start Booking - 5 pts
**Status:** DONE (~100%)

- Completed:
  - "Book Now" goes to `/booking/:movieId/:showtimeId`.
  - `BookingPage` reads `movieId` and `showtimeId` from URL.
  - Booking page displays movie details, show date/time, room, and available seats.
  - Ticket quantities by type (Adult/Child/Senior) are selectable.
  - Ticket prices are fetched from backend `GET /api/showtimes/ticket-prices`.
  - Navigation back to movie details is present.

- Not completed:
  - None identified in code for this requirement.

### 3. Seat Map Display - 5 pts
**Status:** DONE (~95%)

- Completed:
  - Backend seat map endpoint exists: `GET /api/showtimes/{showtimeId}/seats`.
  - Seat layout is loaded from `seats` + `showrooms` tables (not hardcoded on backend).
  - Seat statuses supported: `available`, `occupied` (booked), `reserved` (other user's hold), `selected` (current user's hold).
  - Frontend `SeatSelection` renders seat map with status legend and screen indicator.
  - Seat capacity/availability is returned and displayed.

- Not completed:
  - Frontend still has a hardcoded fallback layout when backend rows are empty.

### 4. Seat Selection - 15 pts
**Status:** MOSTLY DONE (~85%)

- Completed:
  - Click-to-select / deselect seats on booking page.
  - Backend reservation APIs implemented:
    - `POST /api/showtimes/{showtimeId}/seats/reserve`
    - `DELETE /api/showtimes/{showtimeId}/seats/reserve/{seatLabel}`
    - `DELETE /api/showtimes/{showtimeId}/seats/reserve`
  - 5-minute hold window implemented in backend (`SeatReservationService`).
  - Concurrency protection present (unique `(show_id, seat_id)` + conflict checks).
  - Checkout button enforces ticket count must match selected seats.

- Not completed:
  - No final conversion of held seats into booked tickets yet (depends on booking/order creation).

### 5. Checkout Order Summary - 13 pts
**Status:** PARTIALLY DONE (~70%)

- Completed:
  - `CheckoutPage.js` exists and route `/checkout` is configured.
  - Checkout shows movie title/poster, showtime, selected seats, ticket breakdown, subtotal, and total.
  - Checkout attempts to re-validate/re-reserve seats before payment.

- Not completed:
  - No booking/order creation API call (no `POST /api/bookings` flow implemented).
  - No persisted order record or confirmation step.
  - Tax value is computed in code but not displayed/applied separately in final total.

### 6. Email Confirmation Page - 5 pts
**Status:** PARTIALLY DONE (~30%)

- Completed:
  - Checkout shows an email line (from `localStorage.userEmail`).

- Not completed:
  - No dedicated email confirmation component/step.
  - User cannot edit/confirm email during checkout.
  - No backend endpoint for checkout-time email validation/update.

### 7. Payment Processing Page (Mockup) - 5 pts
**Status:** PARTIALLY DONE (~60%)

- Completed:
  - `PaymentPage.js` exists and route `/payment` is configured.
  - Payment page shows selected seats, amount due, and reservation expiry time.
  - Navigation from checkout to payment is implemented.

- Not completed:
  - "Complete Payment (Mock)" button does not create booking/tickets.
  - No order number/reference generation and display.
  - No payment confirmation completion state.

### 8. Login Requirement at Checkout - 2 pts
**Status:** DONE (~100%)

- Completed:
  - Checkout access checks authentication.
  - Unauthenticated users are redirected to `/login`.
  - Pending checkout data and seat hold token are preserved in local storage.
  - Post-login resume to `/checkout` is implemented.

- Not completed:
  - None identified in code for this requirement.

---

## Backend Implementation Status

### Implemented Models/Entities
- `Seat`
- `Ticket`
- `Showroom`
- `SeatReservation`

### Missing Models/Entities
- `Booking` entity (still missing)

### Implemented Repositories
- `SeatRepository`
- `TicketRepository`
- `ShowroomRepository`
- `SeatReservationRepository`
- `ShowtimeRepository` (availability/visibility queries)

### Missing Repositories
- `BookingRepository`

### Implemented Controllers/Endpoints
- `ShowtimeController`
  - `GET /api/showtimes`
  - `GET /api/showtimes/movie/{movieId}`
  - `GET /api/showtimes/{showtimeId}/availability`
  - `GET /api/showtimes/ticket-prices`
- `SeatReservationController`
  - `GET /api/showtimes/{showtimeId}/seats`
  - `POST /api/showtimes/{showtimeId}/seats/reserve`
  - `DELETE /api/showtimes/{showtimeId}/seats/reserve/{seatLabel}`
  - `DELETE /api/showtimes/{showtimeId}/seats/reserve`

### Missing Controllers/Endpoints
- `BookingController` and booking endpoints:
  - `POST /api/bookings`
  - `GET /api/bookings/{id}`
  - `GET /api/bookings/user/{userId}`
  - `PATCH /api/bookings/{id}/confirm`
- `ShowroomController`:
  - `GET /api/showrooms`
  - `GET /api/showrooms/{id}`

### Service Layer Status
- Implemented:
  - `SeatReservationService` (hold, release, concurrency, expiry)
- Missing:
  - `BookingService`
  - `TicketService` for booking finalization workflow

### DTO Status
- Implemented DTOs for showtime visibility/availability, seat map, seat reservation, ticket prices.
- Missing DTOs for booking creation/confirmation payloads.

---

## Frontend Implementation Status

### Implemented Components (Booking Flow)
- `BookingPage.js`
- `SeatSelection.js`
- `TicketPrices.js`
- `CheckoutPage.js`
- `PaymentPage.js`
- `ShowtimeCard.js`

### Implemented Routes
- `/booking/:movieId/:showtimeId`
- `/checkout`
- `/payment`

### Remaining Frontend Gaps
- No finalized order confirmation page/state after mock payment.
- No booking history / booking details view tied to backend bookings.
- No checkout email edit/confirm UI.

---

## Database Utilization Status

### Existing Tables Used in Current Flow
- `shows`
- `showrooms`
- `seats`
- `seat_reservations`
- `bookings` (read for availability calculations)
- `tickets` (read for occupied seat calculations)

### Existing Tables Not Fully Used Yet
- `bookings` (no create/update from checkout flow)
- `tickets` (no create from checkout flow)

---

## Priority Remaining Work

### Phase 1 - Booking Finalization (Critical)
1. Add `Booking` entity + `BookingRepository` + booking DTOs.
2. Add `BookingController` (`POST /api/bookings`) to create booking + tickets from checkout payload.
3. On successful booking creation, clear seat reservation token and persist confirmation details.

### Phase 2 - Checkout/Payment Completion
1. Wire `PaymentPage` "Complete Payment (Mock)" button to booking creation endpoint.
2. Generate/display booking number or payment reference.
3. Add final confirmation UI (success/failure states).

### Phase 3 - UX/Polish
1. Add email confirmation/edit step in checkout.
2. Display tax explicitly (and include correctly in total).
3. Optional: booking history page for user profile.

---

## Updated Effort Estimate (Remaining)

- Booking backend (entity/repository/controller/service + DTOs): 3-5 hours
- Checkout/payment wiring + confirmation UI: 2-4 hours
- Email/tax polish + testing: 2-3 hours

**Total remaining:** ~7-12 hours
