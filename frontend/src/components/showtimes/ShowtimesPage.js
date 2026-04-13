import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import ShowtimeCard from '../moviedetails/ShowtimeCard';
import '../../styles/showtimes/ShowtimesPage.css';

function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadShowtimes() {
      try {
        const res = await fetch('http://localhost:8080/api/showtimes');

        if (!res.ok) {
          throw new Error('Failed to load showtimes.');
        }

        const data = await res.json();
        setShowtimes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Unable to load showtimes.');
      } finally {
        setLoading(false);
      }
    }

    loadShowtimes();
  }, []);

  const groupedShowtimes = useMemo(() => {
    const currentOnly = showtimes.filter(
      (item) => (item?.movie?.showAvailability || '').toLowerCase() === 'current'
    );

    const sorted = currentOnly.sort((a, b) => {
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

        {!loading && !error && Object.values(groupedShowtimes).map(({ movie, slots }) => (
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
