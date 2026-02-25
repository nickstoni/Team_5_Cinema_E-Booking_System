/*import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MoviesSection from './components/MoviesSection';
import Footer from './components/Footer';

function App() {
  // Mock data for movies (will be replaced with database data later)
  const nowPlaying = [
    {id: 1, title: "Movie 1"},
    {id: 2, title: "Movie 2"},
    {id: 3, title: "Movie 3"},
    {id: 4, title: "Movie 4"}
  ]; 

  const upcoming = [
    {id: 5, title: "Upcoming Movie 1"}, 
    {id: 6, title: "Upcoming Movie 2"},
    {id: 7, title: "Upcoming Movie 3"},
    {id: 8, title: "Upcoming Movie 4"},
  ];

  return (
    <div className="App">
      <Navbar />
      <HeroSection movies={nowPlaying} />
      <MoviesSection title="Now Playing" movies={nowPlaying} type="nowPlaying" />
      <MoviesSection title="Coming Soon" movies={upcoming} type="upcoming" />
      <Footer />
    </div>
  );
}

export default App;
*/
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

  return (
    <div className="App">
      <Navbar />
      <HeroSection movies={nowPlaying} />
      <MoviesSection title="Now Playing" movies={nowPlaying} type="nowPlaying" />
      <MoviesSection title="Coming Soon" movies={upcoming} type="upcoming" />
      <Footer />
    </div>
  );
}

export default App;