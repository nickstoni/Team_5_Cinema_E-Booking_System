import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { formatShowtimeLabel } from '../../utils/showtime';
import { API_BASE_URL } from '../../config/api';
import '../../styles/booking/PaymentPage.css';

const TAX_RATE = 0.06;
const PENDING_CHECKOUT_KEY = 'cinemaPendingCheckout';

function readPendingCheckout() {
  try {
    const rawCheckout = localStorage.getItem(PENDING_CHECKOUT_KEY);
    return rawCheckout ? JSON.parse(rawCheckout) : null;
  } catch {
    return null;
  }
}

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [checkoutData, setCheckoutData] = useState(location.state?.checkoutData || null);
  const [pricing, setPricing] = useState(location.state?.pricing || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedSavedCardId, setSelectedSavedCardId] = useState(null);
  const [manualCard, setManualCard] = useState({
    cardType: 'Visa',
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  useEffect(() => {
    const pendingCheckout = location.state?.checkoutData || readPendingCheckout();
    if (!pendingCheckout) {
      navigate('/checkout', { replace: true });
      return;
    }

    setCheckoutData(pendingCheckout);
    if (location.state?.pricing) {
      setPricing(location.state.pricing);
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setSavedCards([]);
      return;
    }

    const loadSavedCards = async () => {
      try {
        const profileResponse = await fetch(`${API_BASE_URL}/api/profile/${userId}`);
        if (!profileResponse.ok) {
          setSavedCards([]);
          return;
        }

        const profile = await profileResponse.json();
        const cards = Array.isArray(profile?.cards) ? profile.cards : [];
        setSavedCards(cards);
        if (cards.length > 0) {
          setSelectedSavedCardId(cards[0].cardId);
        }
      } catch {
        setSavedCards([]);
      }
    };

    loadSavedCards();
  }, [location.state, navigate]);

  const resolvedPricing = useMemo(() => {
    if (pricing) return pricing;
    if (!checkoutData) {
      return { subtotal: 0, tax: 0, total: 0 };
    }

    const subtotal = Number(checkoutData.subtotal ?? 0);
    const tax = subtotal * TAX_RATE;
    return {
      subtotal,
      tax,
      total: subtotal + tax
    };
  }, [checkoutData, pricing]);

  const showtimeLabel = formatShowtimeLabel(checkoutData?.showtime);
  const confirmationEmail = (checkoutData?.confirmationEmail || localStorage.getItem('userEmail') || '').trim().toLowerCase();
  const useSavedCard = savedCards.length > 0;
  const selectedSavedCard = useSavedCard
    ? savedCards.find((card) => card.cardId === selectedSavedCardId) || savedCards[0]
    : null;

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateManualCard = () => {
    if (!manualCard.cardHolderName.trim()) return 'Card holder name is required.';
    if (!/^\d{12,19}$/.test(manualCard.cardNumber.trim())) return 'Enter a valid card number (12-19 digits).';
    if (!/^\d{2}$/.test(manualCard.expiryMonth) || Number(manualCard.expiryMonth) < 1 || Number(manualCard.expiryMonth) > 12) {
      return 'Enter a valid expiry month (MM).';
    }
    if (!/^\d{4}$/.test(manualCard.expiryYear)) return 'Enter a valid expiry year (YYYY).';
    if (!/^\d{3,4}$/.test(manualCard.cvv.trim())) return 'Enter a valid CVV (3 or 4 digits).';
    return '';
  };

  const handleCompletePayment = async () => {
    if (!checkoutData || isProcessing || paymentComplete) return;

    if (!checkoutData.selectedSeats || checkoutData.selectedSeats.length === 0) {
      setPaymentError('Please return to checkout and select seats before completing payment.');
      return;
    }

    if (!confirmationEmail || !isValidEmail(confirmationEmail)) {
      setPaymentError('A valid confirmation email is required before payment can be completed.');
      return;
    }

    if (useSavedCard && !selectedSavedCard) {
      setPaymentError('Please select a saved payment card.');
      return;
    }

    if (!useSavedCard) {
      const manualCardError = validateManualCard();
      if (manualCardError) {
        setPaymentError(manualCardError);
        return;
      }
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      const reserveResponse = await fetch(`${API_BASE_URL}/api/showtimes/${checkoutData.showtimeId}/seats/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationToken: checkoutData.reservationToken,
          seatLabels: checkoutData.selectedSeats
        })
      });

      if (!reserveResponse.ok) {
        const message = await reserveResponse.text();
        throw new Error(message || 'Unable to reserve seats right now.');
      }

      const reserveResult = await reserveResponse.json();
      const effectiveReservationToken = reserveResult.reservationToken || checkoutData.reservationToken || '';
      const updatedCheckout = {
        ...checkoutData,
        confirmationEmail,
        reservationToken: effectiveReservationToken
      };

      setCheckoutData(updatedCheckout);
      localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(updatedCheckout));
      localStorage.setItem(`seat-hold-token:${checkoutData.showtimeId}`, effectiveReservationToken);

      const userId = Number(localStorage.getItem('userId'));
      const paymentMethodSummary = useSavedCard
        ? `${selectedSavedCard.cardType} ending in ${selectedSavedCard.lastFour || '****'}`
        : `${manualCard.cardType} ending in ${manualCard.cardNumber.slice(-4)}`;

      const checkoutResponse = await fetch(`${API_BASE_URL}/api/bookings/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          showtimeId: Number(updatedCheckout.showtimeId),
          reservationToken: effectiveReservationToken,
          confirmationEmail,
          seatLabels: updatedCheckout.selectedSeats || [],
          tickets: updatedCheckout.tickets,
          subtotal: Number(resolvedPricing.subtotal ?? 0),
          tax: Number(resolvedPricing.tax ?? 0),
          total: Number(resolvedPricing.total ?? 0),
          paymentMethodSummary
        })
      });

      if (!checkoutResponse.ok) {
        const message = await checkoutResponse.text();
        throw new Error(message || 'Unable to complete checkout right now.');
      }

      const checkoutResult = await checkoutResponse.json();
      setBookingResult(checkoutResult);

      localStorage.setItem('userEmail', confirmationEmail);
      localStorage.removeItem(PENDING_CHECKOUT_KEY);
      localStorage.removeItem(`seat-hold-token:${checkoutData.showtimeId}`);
      setPaymentComplete(true);
    } catch (error) {
      setPaymentError(error.message || 'Unable to complete payment right now.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!checkoutData) {
    navigate('/checkout', { replace: true });
    return null;
  }

  if (paymentComplete) {
    return (
      <div className="payment-page page-bg">
        <Navbar />
        <main className="payment-main">
          <section className="payment-card glass-card">
            <p className="payment-kicker">Payment successful</p>
            <h1 className="gradient-text">Booking confirmed</h1>
            <p>
              Seats <strong>{checkoutData.selectedSeats?.join(', ') || 'N/A'}</strong> are confirmed. A confirmation email has been sent to <strong>{confirmationEmail}</strong>.
            </p>
            {bookingResult?.bookingNumber ? (
              <p className="payment-meta">Booking number: {bookingResult.bookingNumber}</p>
            ) : null}
            <p className="payment-total">Amount paid: ${Number(resolvedPricing?.total ?? checkoutData?.subtotal ?? 0).toFixed(2)}</p>

            <div className="payment-actions">
              <Link to="/orders" className="payment-link">View order history</Link>
              <Link to="/" className="payment-link">Return home</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-page page-bg">
      <Navbar />
      <main className="payment-main">
        <section className="payment-card glass-card">
          <p className="payment-kicker">Step 3 of 3</p>
          <h1 className="gradient-text">Payment</h1>
          <p>
            Complete payment to confirm seats <strong>{checkoutData.selectedSeats?.join(', ') || 'N/A'}</strong>.
          </p>
          <p>
            Confirmation email: <strong>{confirmationEmail || 'N/A'}</strong>
          </p>
          <p>
            Showtime: <strong>{showtimeLabel}</strong>
          </p>
          {useSavedCard ? (
            <div className="payment-meta" style={{ marginTop: '12px' }}>
              <p style={{ marginBottom: '8px' }}><strong>Saved payment cards</strong></p>
              {savedCards.map((card) => (
                <label key={card.cardId} style={{ display: 'block', marginBottom: '6px' }}>
                  <input
                    type="radio"
                    name="saved-card"
                    value={card.cardId}
                    checked={selectedSavedCardId === card.cardId}
                    onChange={() => setSelectedSavedCardId(card.cardId)}
                    disabled={isProcessing}
                  />{' '}
                  {card.cardType} ending in {card.lastFour || '****'} ({card.expiryMonth}/{card.expiryYear})
                </label>
              ))}
            </div>
          ) : (
            <div className="payment-meta" style={{ marginTop: '12px' }}>
              <p style={{ marginBottom: '8px' }}><strong>Enter payment card</strong></p>
              <div style={{ display: 'grid', gap: '8px' }}>
                <select
                  className="form-input"
                  value={manualCard.cardType}
                  onChange={(event) => setManualCard((prev) => ({ ...prev, cardType: event.target.value }))}
                  disabled={isProcessing}
                >
                  <option value="Visa">Visa</option>
                  <option value="MasterCard">MasterCard</option>
                  <option value="Amex">American Express</option>
                  <option value="Discover">Discover</option>
                </select>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Card holder name"
                  value={manualCard.cardHolderName}
                  onChange={(event) => setManualCard((prev) => ({ ...prev, cardHolderName: event.target.value }))}
                  disabled={isProcessing}
                />
                <input
                  className="form-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="Card number"
                  value={manualCard.cardNumber}
                  onChange={(event) => setManualCard((prev) => ({ ...prev, cardNumber: event.target.value.replace(/\D/g, '') }))}
                  disabled={isProcessing}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <input
                    className="form-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="MM"
                    value={manualCard.expiryMonth}
                    onChange={(event) => setManualCard((prev) => ({ ...prev, expiryMonth: event.target.value.replace(/\D/g, '').slice(0, 2) }))}
                    disabled={isProcessing}
                  />
                  <input
                    className="form-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="YYYY"
                    value={manualCard.expiryYear}
                    onChange={(event) => setManualCard((prev) => ({ ...prev, expiryYear: event.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    disabled={isProcessing}
                  />
                  <input
                    className="form-input"
                    type="password"
                    inputMode="numeric"
                    placeholder="CVV"
                    value={manualCard.cvv}
                    onChange={(event) => setManualCard((prev) => ({ ...prev, cvv: event.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          )}
          {paymentError ? <p className="payment-meta" style={{ color: '#b91c1c' }}>{paymentError}</p> : null}
          <p className="payment-total">Amount due: ${Number(resolvedPricing?.total ?? checkoutData?.subtotal ?? 0).toFixed(2)}</p>

          <div className="payment-actions">
            <Link to="/checkout" className="payment-link">← Back to checkout</Link>
            <button className="btn-primary payment-btn" type="button" onClick={handleCompletePayment} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default PaymentPage;
