// TO DO:
// - Maybe implement some buttons to scroll for more movies like the hero section (use the state updating function 'setStartIndex')

import { useState } from 'react';
import MovieCard from './MovieCard';
import '../styles/MoviesSection.css';

// Component for each movie section (Now Playing and Coming Soon)
function MoviesSection({title, movies, type}) {
  const [startIndex, setStartIndex] = useState(0);
  // Number of movies to show at a time (Can be changed later).
  const moviesPerPage = 4;

  return (
    // If Section type == 'upcoming' then the CSS applied is 'movies-section upcoming-section', otherwise it is just 'movies-section'
    <section className={`movies-section ${type === 'upcoming' ? 'upcoming-section' : ''}`}>
      <div className="section-header">
        <h2>{title}</h2>
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
