import { useEffect, useState } from 'react';
import Navbar from '../layout/Navbar';
import HeroSection from '../movies/HeroSection';
import MoviesSection from '../movies/MoviesSection';
import Footer from '../layout/Footer';

function HomePage() {
  // States for separating the playing and upcoming sections
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  // States for the filter and search features
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  // Fetch the movies
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

    loadMovies();
  }, []);

  // Search the movies
  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      // Clear genre filter when searching
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

  // Filter by Genre
  const handleGenreChange = async (genre) => {
    try {
      setSelectedGenre(genre);
      // Clear search query when filtering
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

  // Check if no results found. 
  // If the size of the nowPlaying movies and upcoming movies are 0 and we have performed a search or 
  // filter, then set the constant to true.
  const hasNoResults = nowPlaying.length === 0 && upcoming.length === 0 && (searchQuery || selectedGenre);

  // Constant to display the searched text/filter
  const filterText = searchQuery ? `"${searchQuery}"` : selectedGenre ? `genre "${selectedGenre}"` : '';

  return (
    <div>
      <Navbar onSearch={handleSearch} onGenreChange={handleGenreChange} />
      <HeroSection movies={nowPlaying} />
      
      {/* If the search/filter has no results (hasNoResults = true) then display a No Results Found message. */}
      {/* Otherwise display the proper movies. */}
      {hasNoResults ? (
        <div className="no-results">
          <h2>No Movies Found</h2>
          <p>We couldn't find any movies matching {filterText}.</p>
          <p>Try a different search term or genre.</p>
        </div>
      ) : (
        <>
          <MoviesSection title="Now Playing" movies={nowPlaying} type="nowPlaying" searchQuery={searchQuery} selectedGenre={selectedGenre} />
          <MoviesSection title="Coming Soon" movies={upcoming} type="upcoming" searchQuery={searchQuery} selectedGenre={selectedGenre} />
        </>
      )}
      
      <Footer />
    </div>
  );
}

export default HomePage;
