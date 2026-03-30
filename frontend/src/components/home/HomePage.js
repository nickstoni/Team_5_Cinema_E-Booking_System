import { useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';
import HeroSection from './HeroSection';
import MoviesSection from './MoviesSection';
import Footer from '../layout/Footer';

function HomePage() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const userId = localStorage.getItem("userId");
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const loadFavorites = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/profile/${userId}/favorites`);
      const data = await res.json();
      setFavoriteMovies(data);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  };

  useEffect(() => {
    async function loadMovies() {
      try {
        const res = await fetch("http://localhost:8080/api/movies");
        const data = await res.json();

        const current = data.filter(m => (m.showAvailability || "").toLowerCase() === "current");
        const coming = data.filter(m => (m.showAvailability || "").toLowerCase() === "upcoming");

        setNowPlaying(current);
        setUpcoming(coming);
      } catch (err) {
        console.error("Failed to load movies:", err);
      }
    }

    // Clear favorites if user is logged out
    if (!userId) {
      setFavoriteMovies([]);
    }

    loadMovies();
    loadFavorites();
  }, [userId]);

  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      setSelectedGenre('');

      const url = query && query.trim()
        ? `http://localhost:8080/api/movies?search=${encodeURIComponent(query.trim())}`
        : "http://localhost:8080/api/movies";

      const res = await fetch(url);
      const data = await res.json();

      const current = data.filter(m => (m.showAvailability || "").toLowerCase() === "current");
      const coming = data.filter(m => (m.showAvailability || "").toLowerCase() === "upcoming");

      setNowPlaying(current);
      setUpcoming(coming);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleGenreChange = async (genre) => {
    try {
      setSelectedGenre(genre);
      setSearchQuery('');

      const url = genre && genre.trim()
        ? `http://localhost:8080/api/movies/by-genre?genre=${encodeURIComponent(genre.trim())}`
        : "http://localhost:8080/api/movies";

      const res = await fetch(url);
      const data = await res.json();

      const current = data.filter(m => (m.showAvailability || "").toLowerCase() === "current");
      const coming = data.filter(m => (m.showAvailability || "").toLowerCase() === "upcoming");

      setNowPlaying(current);
      setUpcoming(coming);
    } catch (err) {
      console.error("Genre filter failed:", err);
    }
  };

  const hasNoResults = nowPlaying.length === 0 && upcoming.length === 0 && (searchQuery || selectedGenre);
  const filterText = searchQuery ? `"${searchQuery}"` : selectedGenre ? `genre "${selectedGenre}"` : '';

  return (
    <div>
      <Navbar onSearch={handleSearch} onGenreChange={handleGenreChange} />
      <HeroSection movies={nowPlaying} />

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