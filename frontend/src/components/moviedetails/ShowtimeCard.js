import React from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <div className="showtime-card">
      <div className="showtime-card-date">
        <div className="date-text">{formatDate(showtime.showdate)}</div>
      </div>
      <div className="showtime-card-divider"></div>
      <div className="showtime-card-time">
        <div className="time-text">{formatTime(showtime.showtime)}</div>
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
