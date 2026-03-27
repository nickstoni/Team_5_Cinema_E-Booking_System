import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import ShowtimeCard from './ShowtimeCard';
import '../../styles/moviedetails/MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the movie's details and showtimes
  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        // Fetch movie details
        const movieRes = await fetch(`http://localhost:8080/api/movies`);
        const movieData = await movieRes.json();
        const foundMovie = movieData.find(m => m.movieId === parseInt(id));
        setMovie(foundMovie);

        // Fetch showtimes for this movie
        if (foundMovie) {
          const showtimesRes = await fetch(`http://localhost:8080/api/showtimes`);
          const showtimesData = await showtimesRes.json();
          
          // Filter showtimes for this specific movie
          const movieShowtimes = showtimesData.filter(
            showtime => showtime.movie.movieId === foundMovie.movieId
          );
          setShowtimes(movieShowtimes);
        }

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

  // Show loading state
  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading movie details...</h2>
        </div>
      </div>
    );
  }

  // Show not found if movie doesn't exist after loading
  if (!movie) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', padding: '50px' }}>
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

            {/* Genres */}
            <div className="movie-genres">
              <span className="genre-label">Genres: </span>
              <span className="genre-list">
                {movie.genres && movie.genres.length > 0 
                  ? movie.genres.map(g => g.genreName).join(', ')
                  : 'Not specified'}
              </span>
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

            {/* Showtimes Section */}
            {movie.showAvailability === 'current' && (
              <div className="showtimes-section">
                <h2 className="section-title">Available Showtimes</h2>
                {showtimes.length > 0 ? (
                  <div className="showtimes-grid">
                    {showtimes.map((showtime) => (
                      <ShowtimeCard key={showtime.showtimeId} showtime={showtime} movieId={movie.movieId} />
                    ))}
                  </div>
                ) : (
                  <p className="showtimes-placeholder">No showtimes available for this movie.</p>
                )}
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
