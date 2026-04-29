import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import '../../styles/home/RecommendedMoviesSection.css';

function RecommendedMoviesSection({ movies = [], favoriteMovies = [], refreshFavorites, showPlaceholder = false }) {
  const [startIndex, setStartIndex] = useState(0);
  const moviesPerPage = 7;

  useEffect(() => {
    setStartIndex(0);
  }, [movies]);

  if (showPlaceholder) {
    return (
      <section className="recommendations-section">
        <div className="section-header">
          <h2>Recommended For You</h2>
        </div>
        <div className="recommendations-empty glass-card">
          <h3>Your recommendations will appear here</h3>
          <p>Save a few favorite movies or complete an order to get personalized suggestions.</p>
        </div>
      </section>
    );
  }

  if (!movies.length) {
    return null;
  }

  const nextMovies = () => {
    if (startIndex + moviesPerPage < movies.length) {
      setStartIndex(startIndex + moviesPerPage);
    }
  };

  const prevMovies = () => {
    if (startIndex - moviesPerPage >= 0) {
      setStartIndex(startIndex - moviesPerPage);
    }
  };

  return (
    <section className="recommendations-section">
      <div className="section-header">
        <div>
          <h2>Recommended For You</h2>
          <p className="recommendations-subtitle">Based on your order history and favorite genres.</p>
        </div>
        <div className="scroll-movies">
          <button
            onClick={prevMovies}
            className="scroll-buttons scroll-left"
            disabled={startIndex === 0 || movies.length <= moviesPerPage}
          >
            ←
          </button>
          <button
            onClick={nextMovies}
            className="scroll-buttons scroll-right"
            disabled={movies.length <= moviesPerPage || startIndex + moviesPerPage >= movies.length}
          >
            →
          </button>
        </div>
      </div>

      <div className="movies-grid">
        {movies.slice(startIndex, startIndex + moviesPerPage).map((movie) => (
          <MovieCard
            key={movie.movieId}
            movie={movie}
            favoriteMovies={favoriteMovies}
            refreshFavorites={refreshFavorites}
          />
        ))}
      </div>
    </section>
  );
}

export default RecommendedMoviesSection;
