// TO DO:
// - Implement the fetching of Genre
// - Implement the fetching of Showtimes

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import '../../styles/MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the movie's details
  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const res = await fetch(`http://localhost:8080/api/movies`);
        const data = await res.json();
        const foundMovie = data.find(m => m.movieId === parseInt(id));
        setMovie(foundMovie);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load movie details:", err);
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [id]);

  // Helper function to extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Regular expression to format different YouTube URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    // If already an embed URL, return as is
    if (url.includes('embed')) {
      return url;
    }
    
    return null;
  };

  if (!movie) {
    return (
      <div>
        <Navbar />
        <div>
          <h2>Movie not found</h2>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(movie.trailer);

  return (
    <div className="movie-details-page">
      <Navbar />
      
      <div className="movie-details-container">
        {/* Trailer Section */}
        {embedUrl && (
          <section className="trailer-section">
            <div className="trailer-container">
              <iframe
                src={embedUrl}
                title={`${movie.title} Trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="trailer-iframe"
              ></iframe>
            </div>
          </section>
        )}

        {/* Movie Info Section */}
        <div className="movie-info-container">
          {/* Poster */}
          <div className="movie-poster-section">
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="movie-poster-large"
            />
          </div>

          {/* Details */}
          <div className="movie-details-content">
            <h1 className="movie-title">{movie.title}</h1>

            {/* Rating */}
            <div className="movie-rating">
              ⭐ <span className="rating-number">{movie.rating}/100</span>
            </div>

            {/* Genres (NEED TO IMPLEMENT) */}
            <div className="movie-genres">
              <span className="genre-label">Genres: </span>
              <span className="genre-list">Action, Drama, Thriller</span>
            </div>

            {/* Information */}
            <div className="movie-meta">
              <div className="meta-item">
                <span className="meta-label">Status:</span>
                <span className="meta-value">
                  {movie.showAvailability === 'current' ? 'Now Playing' : 'Coming Soon'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="movie-description">
              <h2 className="description-title">Description</h2>
              <p className="description-text">
                {movie.description || 'No description available.'}
              </p>
            </div>

            {/* Showtimes Section (NEED TO IMPLEMENT) */}
            {movie.showAvailability === 'current' && (
              <div className="showtimes-section">
                <h2 className="section-title">Available Showtimes</h2>
                <p className="showtimes-placeholder">Showtimes will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MovieDetails;
