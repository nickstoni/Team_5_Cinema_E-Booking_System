import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { isAuthenticated } from '../../utils/auth';
import { formatShowtimeLabel } from '../../utils/showtime';
import { API_BASE_URL } from '../../config/api';
import '../../styles/booking/CheckoutPage.css';

const TAX_RATE = 0.06;
const PENDING_CHECKOUT_KEY = 'cinemaPendingCheckout';

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState(null);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailError, setEmailError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

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
        const response = await fetch(`${API_BASE_URL}/api/profile/${userId}`);
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
      return { subtotal: 0, discountAmount: 0, subtotalAfterDiscount: 0, tax: 0, total: 0 };
    }

    let subtotal = Number(checkoutData.subtotal ?? 0);
    let discountAmount = 0;

    // Apply discount if promo code is valid
    if (appliedPromo && appliedPromo.discountPercent) {
      discountAmount = subtotal * (Number(appliedPromo.discountPercent) / 100);
    }

    const subtotalAfterDiscount = subtotal - discountAmount;
    const tax = subtotalAfterDiscount * TAX_RATE;
    const total = subtotalAfterDiscount + tax;

    return {
      subtotal,
      discountAmount,
      subtotalAfterDiscount,
      tax,
      total
    };
  }, [checkoutData, appliedPromo]);

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleApplyPromo = async () => {
    setPromoError('');
    setPromoSuccess('');

    if (!promoCode.trim()) {
      setPromoError('Please enter a promotion code.');
      return;
    }

    setIsValidatingPromo(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/promotions/validate?promoCode=${encodeURIComponent(promoCode)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        setPromoError('Failed to validate promotion code.');
        setIsValidatingPromo(false);
        return;
      }

      const result = await response.json();

      if (!result.valid) {
        setPromoError(result.message || 'Invalid promotion code.');
        setAppliedPromo(null);
      } else {
        setAppliedPromo(result);
        setPromoSuccess(`Promotion applied! ${result.discountPercent}% off`);
      }
    } catch (error) {
      setPromoError('Error validating promotion code. Please try again.');
      setAppliedPromo(null);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
    setPromoSuccess('');
  };

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
      confirmationEmail: normalizedEmail,
      appliedPromoCode: appliedPromo?.promoCode || null,
      discountPercent: appliedPromo?.discountPercent || null
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
      <div className="checkout-page page-bg">
        <Navbar />
        <main className="checkout-main">
          <section className="checkout-card glass-card loading-card">
            <h1 className="gradient-text">Loading checkout...</h1>
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
    <div className="checkout-page page-bg">
      <Navbar />
      <main className="checkout-main">
        <div className="checkout-header">
          <div>
            <p className="checkout-kicker">Final review</p>
            <h1 className="gradient-text">Checkout Order Summary</h1>
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
          <section className="checkout-card movie-summary-card glass-card">
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
                className="form-input email-input"
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

          <section className="checkout-card summary-card glass-card">
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
              {appliedPromo && pricing.discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount ({appliedPromo.discountPercent}%)</span>
                  <span style={{ color: '#4ade80' }}>-${pricing.discountAmount.toFixed(2)}</span>
                </div>
              )}
              {appliedPromo && (
                <div className="summary-row subtotal-after-discount-row">
                  <span>Subtotal after discount</span>
                  <span>${pricing.subtotalAfterDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Tax (6%)</span>
                <span>${pricing.tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${pricing.total.toFixed(2)}</span>
              </div>

              <div className="promo-code-section">
                <p className="section-label" style={{ marginTop: '16px', marginBottom: '8px' }}>
                  Promotion code
                </p>
                {appliedPromo ? (
                  <div className="promo-applied-box">
                    <div className="promo-applied-content">
                      <span className="promo-code-badge">{appliedPromo.promoCode}</span>
                      <span className="promo-discount-text">{appliedPromo.discountPercent}% discount applied</span>
                    </div>
                    <button 
                      className="promo-remove-btn"
                      onClick={handleRemovePromo}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="promo-input-group">
                    <input
                      type="text"
                      className="form-input promo-input"
                      value={promoCode}
                      onChange={(event) => {
                        setPromoCode(event.target.value);
                        if (promoError) setPromoError('');
                        if (promoSuccess) setPromoSuccess('');
                      }}
                      placeholder="Enter promotion code"
                      disabled={isValidatingPromo}
                    />
                    <button 
                      className="btn-secondary apply-promo-btn"
                      onClick={handleApplyPromo}
                      disabled={isValidatingPromo || !promoCode.trim()}
                      type="button"
                    >
                      {isValidatingPromo ? 'Validating...' : 'Apply'}
                    </button>
                  </div>
                )}
                {promoError && <p className="promo-error">{promoError}</p>}
                {promoSuccess && <p className="promo-success">{promoSuccess}</p>}
              </div>
            </div>
            <button 
              className="btn-primary confirm-btn" 
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
