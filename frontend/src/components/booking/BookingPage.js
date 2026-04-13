import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import TicketPrices from './TicketPrices';
import SeatSelection from './SeatSelection';
import '../../styles/booking/BookingPage.css';

function BookingPage() {
  const { movieId, showtimeId } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats] = useState([]);

  // Format the time (assuming it comes as HH:MM:SS)
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // Parse the time string (format: HH:MM:SS or HH:MM)
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const minute = minutes || '00';
    
    // Convert to 12-hour format
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    return `${hour12}:${minute} ${period}`;
  };

  const formatRoomNumber = (roomName) => {
    if (!roomName) return 'TBD';
    return String(roomName).replace(/^room\s*/i, '').trim() || 'TBD';
  };

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
  }, [movieId, showtimeId]);

  // function to update the tickets on hand
  const handleTicketChange = (type, change) => {
    setTickets(prev => ({
      ...prev,
      [type]: { ...prev[type], quantity: Math.max(0, prev[type].quantity + change) }
    }));
  };

  // function to update selected seats when clicking on them
  const handleSeatClick = (seatId) => {
    // if seat is occupied, do nothing
    if (occupiedSeats.includes(seatId)) return;
    // update the selected seats, if it is already selected, remove it from the selected seats, if not selected add it to the array
    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]);
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
            <p><strong>Time:</strong> {formatTime(showtime.showtime)}</p>
            <p><strong>Room:</strong> {formatRoomNumber(showtime.showroomName)}</p>
          </div>
        </div>
        {/* Ticket Prices component */}
        <TicketPrices tickets={tickets} onTicketChange={handleTicketChange} />
        
        {/* Seat selection component */}
        <SeatSelection 
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
            <div className="summary-row total">
              <span>Total:</span>
              <span className="total-price">${totalPrice}</span>
            </div>
          </div>
          <button 
            className="proceed-btn"
            disabled={totalTickets === 0 || selectedSeats.length !== totalTickets}
          >
            {selectedSeats.length !== totalTickets 
              ? `Select ${totalTickets} seat(s)`
              : 'Checkout'}
          </button>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default BookingPage;
