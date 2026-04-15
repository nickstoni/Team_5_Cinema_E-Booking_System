import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import '../../styles/booking/PaymentPage.css';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const checkoutData = location.state?.checkoutData || null;
  const pricing = location.state?.pricing || null;
  const seatReservation = location.state?.seatReservation || null;

  if (!checkoutData) {
    navigate('/checkout', { replace: true });
    return null;
  }

  return (
    <div className="payment-page">
      <Navbar />
      <main className="payment-main">
        <section className="payment-card">
          <p className="payment-kicker">Step 3 of 3</p>
          <h1>Payment</h1>
          <p>
            Seats <strong>{checkoutData.selectedSeats?.join(', ') || 'N/A'}</strong> are reserved and ready for payment.
          </p>
          {seatReservation?.expiresAt ? (
            <p className="payment-meta">Seat hold expires at: {new Date(seatReservation.expiresAt).toLocaleTimeString()}</p>
          ) : null}
          <p className="payment-total">Amount due: ${Number(pricing?.total ?? checkoutData?.subtotal ?? 0).toFixed(2)}</p>

          <div className="payment-actions">
            <Link to="/checkout" className="payment-link">← Back to checkout</Link>
            <button className="payment-btn" type="button">Complete Payment (Mock)</button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default PaymentPage;
