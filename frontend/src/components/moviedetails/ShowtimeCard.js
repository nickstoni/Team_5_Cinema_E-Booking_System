import { Link } from 'react-router-dom';
import { formatTime12Hour } from '../../utils/time';
import { formatRoomNumber } from '../../utils/showtime';
import '../../styles/moviedetails/ShowtimeCard.css';

function ShowtimeCard({ showtime, movieId }) {
  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="showtime-card">
      <div className="showtime-card-date">
        <div className="date-text">{formatDate(showtime.showdate)}</div>
      </div>
      <div className="showtime-card-divider"></div>
      <div className="showtime-card-time">
        <div className="time-text">{formatTime12Hour(showtime.showtime)}</div>
      </div>
      <div className="showtime-meta">
        <div className="meta-text">Room #{formatRoomNumber(showtime.showroomName)}</div>
        <div className="meta-text">Available Seats: {showtime.availableSeats ?? 0}</div>
      </div>
      <Link to={`/booking/${movieId}/${showtime.showtimeId}`} className="book-button-link">
        <button className="book-button">
          Book Now
        </button>
      </Link>
    </div>
  );
}

export default ShowtimeCard;
