import './App.css';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MoviesSection from './components/MoviesSection';
import Footer from './components/Footer';

function App() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

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
  const handleSearch = async (query) => {
    try {
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

  return (
    <div className="App">
      <Navbar onSearch={handleSearch} />
      <Navbar onSearch={handleSearch} onGenreChange={handleGenreChange} />
    
      <HeroSection movies={nowPlaying} />
      <MoviesSection title="Now Playing" movies={nowPlaying} type="nowPlaying" />
      <MoviesSection title="Coming Soon" movies={upcoming} type="upcoming" />
      <Footer />
    </div>
  );
}

export default App;