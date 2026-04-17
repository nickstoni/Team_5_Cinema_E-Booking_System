import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { formatShowtimeLabel } from '../../utils/showtime';
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
  const [seatReservation, setSeatReservation] = useState(location.state?.seatReservation || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);

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
    if (location.state?.seatReservation) {
      setSeatReservation(location.state.seatReservation);
    }
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
  const movieTitle = checkoutData?.movie?.title || 'Selected Movie';

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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

    setIsProcessing(true);
    setPaymentError('');

    try {
      const reserveResponse = await fetch(`http://localhost:8080/api/showtimes/${checkoutData.showtimeId}/seats/reserve`, {
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
      setSeatReservation(reserveResult);
      localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(updatedCheckout));
      localStorage.setItem(`seat-hold-token:${checkoutData.showtimeId}`, effectiveReservationToken);

      const emailResponse = await fetch(
        `http://localhost:8080/api/showtimes/${checkoutData.showtimeId}/seats/reservation-confirmation-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: confirmationEmail,
            movieTitle,
            showtimeLabel,
            seatLabels: checkoutData.selectedSeats || []
          })
        }
      );

      if (!emailResponse.ok) {
        const message = await emailResponse.text();

        try {
          await fetch(`http://localhost:8080/api/showtimes/${checkoutData.showtimeId}/seats/reserve?reservationToken=${encodeURIComponent(effectiveReservationToken)}`, {
            method: 'DELETE'
          });
        } catch {
          // Best-effort rollback. The user still gets a clear error if rollback fails.
        }

        throw new Error(message || 'Unable to send seat reservation confirmation email right now.');
      }

      localStorage.setItem('userEmail', confirmationEmail);
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
      <div className="payment-page">
        <Navbar />
        <main className="payment-main">
          <section className="payment-card">
            <p className="payment-kicker">Payment complete</p>
            <h1>Booking confirmed</h1>
            <p>
              Seats <strong>{checkoutData.selectedSeats?.join(', ') || 'N/A'}</strong> have been locked and your confirmation email has been sent to <strong>{confirmationEmail}</strong>.
            </p>
            {seatReservation?.expiresAt ? (
              <p className="payment-meta">Seat hold expires at: {new Date(seatReservation.expiresAt).toLocaleTimeString()}</p>
            ) : null}
            <p className="payment-total">Amount paid: ${Number(resolvedPricing?.total ?? checkoutData?.subtotal ?? 0).toFixed(2)}</p>

            <div className="payment-actions">
              <Link to="/" className="payment-link">Return home</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-page">
      <Navbar />
      <main className="payment-main">
        <section className="payment-card">
          <p className="payment-kicker">Step 3 of 3</p>
          <h1>Payment</h1>
          <p>
            Seats <strong>{checkoutData.selectedSeats?.join(', ') || 'N/A'}</strong> will be locked when you complete payment.
          </p>
          <p>
            Confirmation email: <strong>{confirmationEmail || 'N/A'}</strong>
          </p>
          <p>
            Showtime: <strong>{showtimeLabel}</strong>
          </p>
          {seatReservation?.expiresAt ? (
            <p className="payment-meta">Seat hold expires at: {new Date(seatReservation.expiresAt).toLocaleTimeString()}</p>
          ) : null}
          {paymentError ? <p className="payment-meta" style={{ color: '#b91c1c' }}>{paymentError}</p> : null}
          <p className="payment-total">Amount due: ${Number(resolvedPricing?.total ?? checkoutData?.subtotal ?? 0).toFixed(2)}</p>

          <div className="payment-actions">
            <Link to="/checkout" className="payment-link">← Back to checkout</Link>
            <button className="payment-btn" type="button" onClick={handleCompletePayment} disabled={isProcessing}>
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
