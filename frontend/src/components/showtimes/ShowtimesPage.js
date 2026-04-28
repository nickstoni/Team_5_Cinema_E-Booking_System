import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import ShowtimeCard from '../moviedetails/ShowtimeCard';
import '../../styles/showtimes/ShowtimesPage.css';
import { API_BASE_URL } from '../../config/api';

function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadShowtimes() {
      try {
        // Load movies first, then fetch showtimes visibility (from shows) by movie.
        const moviesRes = await fetch(`${API_BASE_URL}/api/movies`);

        if (!moviesRes.ok) {
          throw new Error('Failed to load movies.');
        }

        const moviesData = await moviesRes.json();
        const currentMovies = (Array.isArray(moviesData) ? moviesData : []).filter(
          (movie) => (movie?.showAvailability || '').toLowerCase() === 'current'
        );

        const showtimesByMovie = await Promise.all(
          currentMovies.map(async (movie) => {
            const res = await fetch(`${API_BASE_URL}/api/showtimes/movie/${movie.movieId}`);
            if (!res.ok) return [];

            const slots = await res.json();
            if (!Array.isArray(slots)) return [];

            return slots.map((slot) => ({
              ...slot,
              movie
            }));
          })
        );

        setShowtimes(showtimesByMovie.flat());
      } catch (err) {
        setError(err.message || 'Unable to load showtimes.');
      } finally {
        setLoading(false);
      }
    }

    loadShowtimes();
  }, []);

  const groupedShowtimes = useMemo(() => {
    const sorted = [...showtimes].sort((a, b) => {
      const first = `${a.showdate}T${a.showtime}`;
      const second = `${b.showdate}T${b.showtime}`;
      return first.localeCompare(second);
    });

    return sorted.reduce((acc, item) => {
      const movieId = item?.movie?.movieId;
      if (!movieId) {
        return acc;
      }

      if (!acc[movieId]) {
        acc[movieId] = {
          movie: item.movie,
          slots: []
        };
      }

      acc[movieId].slots.push(item);
      return acc;
    }, {});
  }, [showtimes]);

  const sortedMovieGroups = Object.values(groupedShowtimes);

  return (
    <div className="showtimes-page">
      <Navbar onGenreChange={() => {}} />

      <main className="showtimes-main">
        <header className="showtimes-header">
          <h1>All Showtimes</h1>
          <p>Browse today and upcoming sessions for movies now playing.</p>
        </header>

        {loading && <p className="showtimes-state">Loading showtimes...</p>}

        {!loading && error && <p className="showtimes-state error">{error}</p>}

        {!loading && !error && Object.keys(groupedShowtimes).length === 0 && (
          <p className="showtimes-state">No showtimes available right now.</p>
        )}

        {!loading && !error && sortedMovieGroups.map(({ movie, slots }) => (
          <section key={movie.movieId} className="movie-showtimes-block">
            <div className="movie-showtimes-info">
              <img src={movie.poster} alt={movie.title} className="movie-showtimes-poster" />
              <div>
                <h2>
                  <Link to={`/movie/${movie.movieId}`} className="showtimes-movie-title-link">
                    {movie.title}
                  </Link>
                </h2>
                <p className="showtimes-movie-rating">
                  ⭐ <span className="showtimes-rating-number">{movie.rating ?? movie.user_score ?? 'N/A'}/100</span>
                </p>
              </div>
            </div>

            <div className="movie-slots-grid">
              {slots.map((slot) => (
                <ShowtimeCard
                  key={slot.showtimeId}
                  showtime={slot}
                  movieId={movie.movieId}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
    </div>
  );
}

export default ShowtimesPage;
