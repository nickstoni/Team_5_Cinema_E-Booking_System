import '../../styles/home/MovieCard.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function MovieCard({ movie, type, favoriteMovies = [], refreshFavorites }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState('');

  useEffect(() => {
    const alreadyFavorite = favoriteMovies.some(
      (fav) => fav.movieId === movie.movieId
    );
    setIsFavorite(alreadyFavorite);
  }, [favoriteMovies, movie.movieId]);

  const handleFavoriteToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      let response;

      if (isFavorite) {
        response = await fetch(
          `http://localhost:8080/api/profile/${userId}/favorites/${movie.movieId}`,
          {
            method: 'DELETE'
          }
        );
      } else {
        response = await fetch(
          `http://localhost:8080/api/profile/${userId}/favorites/${movie.movieId}`,
          {
            method: 'POST'
          }
        );
      }

      const text = await response.text();

      if (!response.ok) {
        setFavoriteMessage(text || 'Failed to update favorites');
        return;
      }

      setFavoriteMessage(
        isFavorite ? 'Removed from favorites' : 'Added to favorites'
      );

      if (refreshFavorites) {
        refreshFavorites();
      } else {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      setFavoriteMessage('Failed to update favorites');
    }
  };

  return (
    <Link to={`/movie/${movie.movieId}`} className="movie-card-link">
      <div className="movie-card">
        <div className="movie-poster-wrapper">
          <img src={movie.poster} alt={movie.title} className="movie-poster" />

          <button
            type="button"
            className={`favorite-icon-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteToggle}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '♥' : '♡'}
          </button>
        </div>

        <div className="movie-info">
          <h3>{movie.title}</h3>

          {favoriteMessage && (
            <p className="favorite-message">
              {favoriteMessage}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;