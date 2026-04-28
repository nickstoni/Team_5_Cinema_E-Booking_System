import { useCallback, useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';
import HeroSection from './HeroSection';
import MoviesSection from './MoviesSection';
import RecommendedMoviesSection from './RecommendedMoviesSection';
import Footer from '../layout/Footer';
import { API_BASE_URL } from '../../config/api';

function splitMoviesByAvailability(movies = []) {
  return movies.reduce(
    (acc, movie) => {
      const availability = (movie.showAvailability || '').toLowerCase();
      if (availability === 'current') {
        acc.nowPlaying.push(movie);
      } else if (availability === 'upcoming') {
        acc.upcoming.push(movie);
      }
      return acc;
    },
    { nowPlaying: [], upcoming: [] }
  );
}

function HomePage() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [recommendationsLoaded, setRecommendationsLoaded] = useState(false);

  const userId = localStorage.getItem("userId");
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const loadFavorites = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile/${userId}/favorites`);
      const data = await res.json();
      setFavoriteMovies(data);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  }, [userId]);

  const loadMovies = useCallback(async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    const { nowPlaying: current, upcoming: coming } = splitMoviesByAvailability(Array.isArray(data) ? data : []);
    setNowPlaying(current);
    setUpcoming(coming);
  }, []);

  const loadRecommendations = useCallback(async () => {
    if (!userId) {
      setRecommendedMovies([]);
      setRecommendationsLoaded(true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/recommendations/${userId}?limit=8`);
      const data = await res.json();
      setRecommendedMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setRecommendedMovies([]);
    } finally {
      setRecommendationsLoaded(true);
    }
  }, [userId]);

  useEffect(() => {
    // Clear favorites if user is logged out
    if (!userId) {
      setFavoriteMovies([]);
    }

    const initialize = async () => {
      try {
        setRecommendationsLoaded(false);
        await Promise.all([
          loadMovies(`${API_BASE_URL}/api/movies`),
          loadFavorites(),
          loadRecommendations()
        ]);
      } catch (err) {
        console.error("Failed to initialize home page:", err);
      }
    };

    initialize();
  }, [userId, loadFavorites, loadMovies, loadRecommendations]);

  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      setSelectedGenre('');

      const url = query && query.trim()
        ? `${API_BASE_URL}/api/movies?search=${encodeURIComponent(query.trim())}`
        : `${API_BASE_URL}/api/movies`;

      await loadMovies(url);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleGenreChange = async (genre) => {
    try {
      setSelectedGenre(genre);
      setSearchQuery('');

      const url = genre && genre.trim()
        ? `${API_BASE_URL}/api/movies/by-genre?genre=${encodeURIComponent(genre.trim())}`
        : `${API_BASE_URL}/api/movies`;

      await loadMovies(url);
    } catch (err) {
      console.error("Genre filter failed:", err);
    }
  };

  const hasNoResults = nowPlaying.length === 0 && upcoming.length === 0 && (searchQuery || selectedGenre);
  const filterText = searchQuery ? `"${searchQuery}"` : selectedGenre ? `genre "${selectedGenre}"` : '';
  const shouldShowRecommendations = Boolean(userId) && recommendationsLoaded;
  const showRecommendationPlaceholder = shouldShowRecommendations && recommendedMovies.length === 0;

  return (
    <div>
      <Navbar onSearch={handleSearch} onGenreChange={handleGenreChange} />
      <HeroSection movies={nowPlaying} />

      {shouldShowRecommendations && (
        <RecommendedMoviesSection
          movies={recommendedMovies}
          favoriteMovies={favoriteMovies}
          refreshFavorites={loadFavorites}
          showPlaceholder={showRecommendationPlaceholder}
        />
      )}

      {hasNoResults ? (
        <div className="no-results">
          <h2>No Movies Found</h2>
          <p>We couldn't find any movies matching {filterText}.</p>
          <p>Try a different search term or genre.</p>
        </div>
      ) : (
        <>
          <MoviesSection
            title="Now Playing"
            movies={nowPlaying}
            type="nowPlaying"
            searchQuery={searchQuery}
            selectedGenre={selectedGenre}
            favoriteMovies={favoriteMovies}
            refreshFavorites={loadFavorites}
          />
          <MoviesSection
            title="Coming Soon"
            movies={upcoming}
            type="upcoming"
            searchQuery={searchQuery}
            selectedGenre={selectedGenre}
            favoriteMovies={favoriteMovies}
            refreshFavorites={loadFavorites}
          />
        </>
      )}

      <Footer />
    </div>
  );
}

export default HomePage;