import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import '../../styles/booking/CheckoutPage.css';

const TAX_RATE = 0.06;
const PENDING_CHECKOUT_KEY = 'cinemaPendingCheckout';

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const readPendingCheckout = (value) => {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('cinemaAuth') || localStorage.getItem('userId');
    const rawPending = localStorage.getItem(PENDING_CHECKOUT_KEY);
    const pendingFromState = location.state?.checkoutData;
    const pending = pendingFromState || readPendingCheckout(rawPending);

    if (!auth) {
      if (pending) {
        localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(pending));
      }
      navigate('/login', { replace: true, state: { from: '/checkout' } });
      return;
    }

    if (pending) {
      setCheckoutData(pending);
      return;
    }

    navigate('/', { replace: true });
  }, [location.state, navigate]);

  const pricing = useMemo(() => {
    if (!checkoutData) {
      return { subtotal: 0, tax: 0, total: 0 };
    }

    const subtotal = Number(checkoutData.subtotal ?? 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal;
    return {
      subtotal,
      tax,
      total
    };
  }, [checkoutData]);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = String(timeString).split(':');
    const hour = parseInt(hours, 10);
    const minute = minutes || '00';
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minute} ${period}`;
  };

  const handleProceedToPayment = async () => {
    if (!checkoutData || isSubmitting) return;

    if (!checkoutData.selectedSeats || checkoutData.selectedSeats.length === 0) {
      setSubmitError('Please select at least one seat before proceeding to payment.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`http://localhost:8080/api/showtimes/${checkoutData.showtimeId}/seats/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationToken: checkoutData.reservationToken,
          seatLabels: checkoutData.selectedSeats
        })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Unable to reserve seats before payment.');
      }

      const reserveResult = await response.json();
      const updatedCheckout = {
        ...checkoutData,
        reservationToken: reserveResult.reservationToken || checkoutData.reservationToken
      };

      localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(updatedCheckout));
      localStorage.setItem(`seat-hold-token:${checkoutData.showtimeId}`, updatedCheckout.reservationToken || '');

      navigate('/payment', {
        state: {
          checkoutData: updatedCheckout,
          pricing,
          seatReservation: reserveResult
        }
      });
    } catch (error) {
      setSubmitError(error.message || 'Unable to proceed to payment right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!checkoutData) {
    return (
      <div className="checkout-page">
        <Navbar />
        <main className="checkout-main">
          <section className="checkout-card loading-card">
            <h1>Loading checkout...</h1>
            <p>Preparing your order summary.</p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const movieTitle = checkoutData.movie?.title || 'Selected Movie';
  const poster = checkoutData.movie?.poster;
  const showtimeLabel = checkoutData.showtime
    ? `${new Date(checkoutData.showtime.showdate).toDateString()} • ${formatTime(checkoutData.showtime.showtime)} • ${checkoutData.showtime.showroomName || 'TBD'}`
    : 'Showtime details unavailable';
  const ticketLines = [
    { label: 'Adult', quantity: Number(checkoutData.tickets?.adult?.quantity ?? 0), price: Number(checkoutData.tickets?.adult?.price ?? 0) },
    { label: 'Child', quantity: Number(checkoutData.tickets?.child?.quantity ?? 0), price: Number(checkoutData.tickets?.child?.price ?? 0) },
    { label: 'Senior', quantity: Number(checkoutData.tickets?.senior?.quantity ?? 0), price: Number(checkoutData.tickets?.senior?.price ?? 0) }
  ].filter((ticket) => ticket.quantity > 0);

  const userEmail = localStorage.getItem('userEmail') || 'Not available';

  return (
    <div className="checkout-page">
      <Navbar />
      <main className="checkout-main">
        <div className="checkout-header">
          <div>
            <p className="checkout-kicker">Final review</p>
            <h1>Checkout Order Summary</h1>
            <p className="checkout-subtitle">
              Confirm your tickets, seats, and payment details before completing the order.
            </p>
          </div>
          <Link to={`/booking/${checkoutData.movieId}/${checkoutData.showtimeId}`} className="back-link">
            ← Back to seats
          </Link>
        </div>

        {submitError ? (
          <section className="checkout-card error-card">
            <h2>Unable to continue</h2>
            <p>{submitError}</p>
          </section>
        ) : null}

        <div className="checkout-grid">
          <section className="checkout-card movie-summary-card">
            <div className="movie-summary-top">
              {poster ? <img src={poster} alt={movieTitle} className="checkout-poster" /> : null}
              <div>
                <p className="section-label">Movie</p>
                <h2>{movieTitle}</h2>
                <p className="showtime-line">{showtimeLabel}</p>
                <p className="contact-line">Confirmation email: {userEmail}</p>
              </div>
            </div>
          </section>

          <section className="checkout-card summary-card">
            <h2>Order details</h2>
            <div className="summary-table">
              <div className="summary-row">
                <span>Tickets</span>
                <span>{ticketLines.reduce((sum, ticket) => sum + ticket.quantity, 0)}</span>
              </div>
              <div className="summary-row">
                <span>Selected seats</span>
                <span>{checkoutData.selectedSeats?.join(', ') || 'None'}</span>
              </div>
              {ticketLines.map((ticket) => (
                <div key={ticket.label} className="summary-row ticket-row">
                  <span>
                    {ticket.label} × {ticket.quantity}
                  </span>
                  <span>${(ticket.quantity * ticket.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${pricing.total.toFixed(2)}</span>
              </div>
            </div>
            <button className="confirm-btn" onClick={handleProceedToPayment} disabled={isSubmitting}>
              {isSubmitting ? 'Reserving Seats...' : 'Proceed to Payment'}
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
