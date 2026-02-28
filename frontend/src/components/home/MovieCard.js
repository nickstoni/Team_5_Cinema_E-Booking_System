import '../../styles/home/MovieCard.css';
import { Link } from 'react-router-dom';

// Component for creating each movie card
function MovieCard({movie, type}) {
    return (
      <Link to={`/movie/${movie.movieId}`} className="movie-card-link">
        <div className="movie-card">
            <img src={movie.poster} alt={movie.title} className="movie-poster" />
            <div className="movie-info">
              <h3>{movie.title}</h3>
            </div>
          </div>
      </Link>
    )
}

export default MovieCard;