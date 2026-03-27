import { useState } from 'react';
import MovieCard from './MovieCard';
import '../../styles/home/MoviesSection.css';

// Component for each movie section (Now Playing and Coming Soon)
function MoviesSection({title, movies, type, searchQuery, selectedGenre}) {
  const [startIndex, setStartIndex] = useState(0);
  // Number of movies to show at a time (Can be changed later).
  const moviesPerPage = 8;

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

  // Don't render section if no movies and user has filtered/searched
  if (movies.length === 0 && (searchQuery || selectedGenre)) {
    return null;
  }

  return (
    // If Section type == 'upcoming' then the CSS applied is 'movies-section upcoming-section', otherwise it is just 'movies-section'
    <section className={`movies-section ${type === 'upcoming' ? 'upcoming-section' : ''}`}>
      <div className="section-header">
        <h2>{title}</h2>
        <div className="scroll-movies">
          <button 
            onClick={prevMovies} 
            className="scroll-buttons scroll-left"
            disabled={startIndex === 0}
          >
            ←
          </button>
          <button 
            onClick={nextMovies} 
            className="scroll-buttons scroll-right"
            disabled={startIndex + moviesPerPage >= movies.length}
          >
            →
          </button>
        </div>
      </div>

      <div className="movies-grid">
        {movies.slice(startIndex, startIndex + moviesPerPage).map((movie) => (
          <MovieCard key={movie.id} movie={movie} type={type}/>
        ))}
      </div>
    </section>
  );
}

export default MoviesSection;
