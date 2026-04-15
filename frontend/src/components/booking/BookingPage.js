import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import TicketPrices from './TicketPrices';
import SeatSelection from './SeatSelection';
import { isAuthenticated } from '../../utils/auth';
import { formatTime12Hour } from '../../utils/time';
import { formatRoomNumber } from '../../utils/showtime';
import '../../styles/booking/BookingPage.css';

function BookingPage() {
  const { movieId, showtimeId } = useParams();
  const navigate = useNavigate();
  const reservationStorageKey = `seat-hold-token:${showtimeId}`;
  const pendingCheckoutStorageKey = 'cinemaPendingCheckout';
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [seatRows, setSeatRows] = useState([]);
  const [reservationToken, setReservationToken] = useState('');
  const [seatAvailability, setSeatAvailability] = useState({
    totalSeats: 0,
    bookedSeats: 0,
    availableSeats: 0
  });

  const loadSeatMap = useCallback(async (token) => {
    const response = await fetch(`http://localhost:8080/api/showtimes/${showtimeId}/seats${token ? `?reservationToken=${encodeURIComponent(token)}` : ''}`);
    const data = await response.json();

    setSeatRows(data.rows || []);
    setOccupiedSeats(
      (data.rows || [])
        .flatMap(row => row.seats || [])
        .filter(seat => seat.status === 'occupied' || seat.status === 'reserved')
        .map(seat => seat.seatLabel)
    );
    setSeatAvailability({
      totalSeats: Number(data.totalSeats ?? 0),
      bookedSeats: Number(data.bookedSeats ?? 0),
      availableSeats: Number(data.availableSeats ?? 0)
    });
  }, [showtimeId]);

  const [tickets, setTickets] = useState({
    adult: { quantity: 0, price: 0.00 },
    child: { quantity: 0, price: 0.00 },
    senior: { quantity: 0, price: 0.00 }
  });

  useEffect(() => {
    // Retrieve information from the movie that we want to book
    fetch(`http://localhost:8080/api/movies`)
      .then(res => res.json())
      .then(data => setMovie(data.find(m => m.movieId === parseInt(movieId))))
      .catch(err => console.error(err));

    // Retrieve selected showtime from shows (includes showroom visibility fields)
    fetch(`http://localhost:8080/api/showtimes/movie/${movieId}`)
      .then(res => res.json())
      .then(data => setShowtime(data.find(s => s.showtimeId === parseInt(showtimeId))))
      .catch(err => console.error(err));

    fetch('http://localhost:8080/api/showtimes/ticket-prices')
      .then(res => res.json())
      .then(data => {
        setTickets(prev => ({
          adult: { ...prev.adult, price: Number(data.adult ?? 0) },
          child: { ...prev.child, price: Number(data.child ?? 0) },
          senior: { ...prev.senior, price: Number(data.senior ?? 0) }
        }));
      })
      .catch(err => console.error(err));

    // Generate and store a reservation token for this session
    const key = reservationStorageKey;
    let token = localStorage.getItem(key);
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem(key, token);
    }
    setReservationToken(token);

    // Load seat map once on mount (without token to only show occupied seats, not other users' selections)
    loadSeatMap(null).catch(err => console.error(err));

    return () => {
      // Cleanup
    };
  }, [movieId, showtimeId, loadSeatMap, reservationStorageKey]);

  // function to update the tickets on hand
  const handleTicketChange = (type, change) => {
    if (change > 0 && totalTickets >= seatAvailability.availableSeats) {
      return;
    }

    setTickets(prev => ({
      ...prev,
      [type]: { ...prev[type], quantity: Math.max(0, prev[type].quantity + change) }
    }));
  };

  // function to update selected seats when clicking on them
  // NOTE: Seats are NOT reserved in DB here, only marked as selected locally
  // Reservation happens when user commits to checkout (after authentication)
  const handleSeatClick = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    const alreadySelected = selectedSeats.includes(seatId);

    if (alreadySelected) {
      // Remove from selection
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
    } else {
      // Add to selection
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const handleProceedToCheckout = () => {
    const auth = isAuthenticated();
    
    // Save checkout data including reservation token for CheckoutPage to use
    const checkoutPayload = {
      movieId,
      showtimeId,
      movie,
      showtime,
      tickets,
      selectedSeats,
      seatAvailability,
      reservationToken, // CheckoutPage will use this to reserve seats
      subtotal: Number(totalPrice),
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(pendingCheckoutStorageKey, JSON.stringify(checkoutPayload));
    if (!auth) {
      // Redirect to login - CheckoutPage will reserve seats after login
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    navigate('/checkout');
  };

  // compute the total amount of tickets
  const totalTickets = tickets.adult.quantity + tickets.child.quantity + tickets.senior.quantity;
  // compute the total ticket price
  const totalPrice = (
    tickets.adult.quantity * tickets.adult.price +
    tickets.child.quantity * tickets.child.price +
    tickets.senior.quantity * tickets.senior.price
  ).toFixed(2);

  if (!movie || !showtime) {
    return (
      <div className="booking-page">
        <Navbar />
        <div className="booking-container">
          <h2>Loading...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="booking-page">
      <Navbar />
      <div className="booking-container">
        <Link to={`/movie/${movieId}`} className="back-link">← Back</Link>
        <h1 className="booking-title">Book Tickets</h1>
        
        <div className="movie-booking-info">
          <img src={movie.poster} alt={movie.title} className="booking-poster" />
          <div className="booking-details">
            <h2 className="booking-movie-title">{movie.title}</h2>
            <p><strong>Date:</strong> {new Date(showtime.showdate).toDateString()}</p>
            <p><strong>Time:</strong> {formatTime12Hour(showtime.showtime)}</p>
            <p><strong>Room:</strong> {formatRoomNumber(showtime.showroomName)}</p>
            <p><strong>Available Seats:</strong> {seatAvailability.availableSeats}</p>
          </div>
        </div>
        {/* Ticket Prices component */}
        <TicketPrices tickets={tickets} onTicketChange={handleTicketChange} />
        
        {/* Seat selection component */}
        <SeatSelection 
          seatRows={seatRows}
          selectedSeats={selectedSeats}
          occupiedSeats={occupiedSeats}
          onSeatClick={handleSeatClick}
        />

        {/* Order summary section */}
        <section className="order-summary">
          <h2 className="section-heading">Order Summary</h2>
          <div className="summary-content">
            <div className="summary-row">
              <span>Tickets:</span>
              <span>{totalTickets}</span>
            </div>
            <div className="summary-row">
              <span>Seats:</span>
              <span>{selectedSeats.join(', ') || 'None'}</span>
            </div>
            <div className="summary-row">
              <span>Seats Remaining:</span>
              <span>{seatAvailability.availableSeats}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span className="total-price">${totalPrice}</span>
            </div>
          </div>
          <button 
            className="proceed-btn"
            onClick={handleProceedToCheckout}
            disabled={
              totalTickets === 0 ||
              selectedSeats.length !== totalTickets ||
              totalTickets > seatAvailability.availableSeats
            }
          >
            {totalTickets > seatAvailability.availableSeats
              ? 'Not enough seats available'
              : selectedSeats.length !== totalTickets 
              ? `Select ${totalTickets} seat(s)`
              : 'Proceed to Checkout'}
          </button>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default BookingPage;
