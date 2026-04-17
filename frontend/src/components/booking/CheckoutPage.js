import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { isAuthenticated } from '../../utils/auth';
import { formatShowtimeLabel } from '../../utils/showtime';
import '../../styles/booking/CheckoutPage.css';

const TAX_RATE = 0.06;
const PENDING_CHECKOUT_KEY = 'cinemaPendingCheckout';

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailError, setEmailError] = useState('');

  const readPendingCheckout = (value) => {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const auth = isAuthenticated();
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

  useEffect(() => {
    if (!checkoutData) return;

    const storedEmail = localStorage.getItem('userEmail') || '';
    if (storedEmail) {
      setEmailAddress(storedEmail);
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const loadEmailFromProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/profile/${userId}`);
        if (!response.ok) return;
        const profile = await response.json();
        const profileEmail = profile?.user?.email || '';
        if (profileEmail) {
          setEmailAddress(profileEmail);
          localStorage.setItem('userEmail', profileEmail);
        }
      } catch {
        // Non-blocking fallback: user can enter email manually.
      }
    };

    loadEmailFromProfile();
  }, [checkoutData]);

  const pricing = useMemo(() => {
    if (!checkoutData) {
      return { subtotal: 0, tax: 0, total: 0 };
    }

    const subtotal = Number(checkoutData.subtotal ?? 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;
    return {
      subtotal,
      tax,
      total
    };
  }, [checkoutData]);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleProceedToPayment = () => {
    if (!checkoutData) return;

    if (!checkoutData.selectedSeats || checkoutData.selectedSeats.length === 0) {
      return;
    }

    const normalizedEmail = emailAddress.trim().toLowerCase();
    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      setEmailError('Please confirm a valid email address before proceeding to payment.');
      return;
    }

    setEmailError('');

    const updatedCheckout = {
      ...checkoutData,
      confirmationEmail: normalizedEmail
    };

    setCheckoutData(updatedCheckout);
    localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(updatedCheckout));
    localStorage.setItem('userEmail', normalizedEmail);

    navigate('/payment', {
      state: {
        checkoutData: updatedCheckout,
        pricing
      }
    });
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
  const showtimeLabel = formatShowtimeLabel(checkoutData.showtime);
  const ticketLines = [
    { label: 'Adult', quantity: Number(checkoutData.tickets?.adult?.quantity ?? 0), price: Number(checkoutData.tickets?.adult?.price ?? 0) },
    { label: 'Child', quantity: Number(checkoutData.tickets?.child?.quantity ?? 0), price: Number(checkoutData.tickets?.child?.price ?? 0) },
    { label: 'Senior', quantity: Number(checkoutData.tickets?.senior?.quantity ?? 0), price: Number(checkoutData.tickets?.senior?.price ?? 0) }
  ].filter((ticket) => ticket.quantity > 0);

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
            <p style={{ color: '#666', marginTop: '8px', fontSize: '0.9em' }}>
              Your seats will be locked when you complete payment.
            </p>
          </div>
          <Link to={`/booking/${checkoutData.movieId}/${checkoutData.showtimeId}`} className="back-link">
            ← Back to seats
          </Link>
        </div>

        <div className="checkout-grid">
          <section className="checkout-card movie-summary-card">
            <div className="movie-summary-top">
              {poster ? <img src={poster} alt={movieTitle} className="checkout-poster" /> : null}
              <div>
                <p className="section-label">Movie</p>
                <h2>{movieTitle}</h2>
                <p className="showtime-line">{showtimeLabel}</p>
              </div>
            </div>

            <div className="email-confirmation-box">
              <p className="section-label">Email confirmation</p>
              <p className="contact-line">Confirm your email address for booking confirmation.</p>
              <input
                type="email"
                className="email-input"
                value={emailAddress}
                onChange={(event) => {
                  setEmailAddress(event.target.value);
                  if (emailError) {
                    setEmailError('');
                  }
                }}
                placeholder="Enter email address"
                autoComplete="email"
              />
              {emailError ? <p className="email-error">{emailError}</p> : null}
            </div>
          </section>

          <section className="checkout-card summary-card">
            <h2>Order details</h2>
            <div className="summary-table">
              <div className="summary-row">
                <span>Movie name</span>
                <span>{movieTitle}</span>
              </div>
              <div className="summary-row">
                <span>Showtime</span>
                <span>{showtimeLabel}</span>
              </div>
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
                    {ticket.label} × {ticket.quantity} (@ ${ticket.price.toFixed(2)} each)
                  </span>
                  <span>${(ticket.quantity * ticket.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-row">
                <span>Total before tax</span>
                <span>${pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (6%)</span>
                <span>${pricing.tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${pricing.total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              className="confirm-btn" 
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
