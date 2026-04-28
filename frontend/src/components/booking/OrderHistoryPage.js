import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { isAuthenticated } from '../../utils/auth';
import { API_BASE_URL } from '../../config/api';
import '../../styles/booking/OrderHistoryPage.css';

function formatShowtime(showDate, showTime) {
  if (!showDate || !showTime) return 'TBD';
  const dateTime = new Date(`${showDate}T${showTime}`);
  if (Number.isNaN(dateTime.getTime())) {
    return `${showDate} ${showTime}`;
  }
  return dateTime.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function formatBookedAt(bookingDate) {
  if (!bookingDate) return 'Unknown';
  const dateTime = new Date(bookingDate);
  if (Number.isNaN(dateTime.getTime())) return bookingDate;
  return dateTime.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true, state: { from: '/orders' } });
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login', { replace: true, state: { from: '/orders' } });
      return;
    }

    const loadOrderHistory = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/api/bookings/history/${userId}`);
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || 'Unable to load order history.');
        }

        const result = await response.json();
        setOrders(Array.isArray(result) ? result : []);
      } catch (loadError) {
        setError(loadError.message || 'Unable to load order history.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderHistory();
  }, [navigate]);

  return (
    <div className="order-history-page page-bg">
      <Navbar />
      <main className="order-history-main">
        <header className="order-history-header">
          <div>
            <p className="order-history-kicker">Booking History</p>
            <h1 className="gradient-text">Order History</h1>
            <p className="order-history-subtitle">
              View your completed bookings, selected seats, and totals.
            </p>
          </div>
          <Link to="/showtimes" className="order-history-link">Book Tickets</Link>
        </header>

        {isLoading ? (
          <section className="order-history-card glass-card">
            <p className="order-history-muted">Loading your order history...</p>
          </section>
        ) : null}

        {!isLoading && error ? (
          <section className="order-history-card order-history-error glass-card">
            <p>{error}</p>
          </section>
        ) : null}

        {!isLoading && !error && orders.length === 0 ? (
          <section className="order-history-card glass-card">
            <h2>No orders yet</h2>
            <p className="order-history-muted">Your completed bookings will appear here once you purchase tickets.</p>
          </section>
        ) : null}

        {!isLoading && !error && orders.length > 0 ? (
          <section className="order-history-list">
            {orders.map((order) => (
              <article className="order-history-card glass-card" key={order.bookingId || order.bookingNumber}>
                <div className="order-history-row">
                  <h2>{order.movieTitle || 'Movie'}</h2>
                  <span className="status-pill">{order.status || 'Unknown'}</span>
                </div>
                <div className="order-history-grid">
                  <p><strong>Booking #:</strong> {order.bookingNumber || 'N/A'}</p>
                  <p><strong>Booked at:</strong> {formatBookedAt(order.bookingDate)}</p>
                  <p><strong>Showtime:</strong> {formatShowtime(order.showDate, order.showTime)}</p>
                  <p><strong>Seats:</strong> {Array.isArray(order.seatLabels) && order.seatLabels.length > 0 ? order.seatLabels.join(', ') : 'N/A'}</p>
                </div>
                <p className="order-total">Total: ${Number(order.totalAmount ?? 0).toFixed(2)}</p>
              </article>
            ))}
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

export default OrderHistoryPage;