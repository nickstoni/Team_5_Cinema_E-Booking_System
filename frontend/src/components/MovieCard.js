// TO DO:
// - Implement a Watch trailer feature/button

import '../styles/MovieCard.css';

// Component for creating each movie card
function MovieCard({movie, type}) {
    return (
        <div className="movie-card">
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
            <div className="movie-info">
              <h3>{movie.title}</h3>
            </div>
            {type === 'nowPlaying' ? (
              <button className="book-btn">Book Tickets</button>
            ) : (
              <button className="notify-btn">Notify Me</button>
            )}
          </div>
    )
}

export default MovieCard;