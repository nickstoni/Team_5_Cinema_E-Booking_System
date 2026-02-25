// Dependency Imports

import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/Home.css';
import './styles/Details.css';

// Component Imports

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MoviesSection from './components/MoviesSection';
import Footer from './components/Footer';
import DetailsPage from './components/DetailsPage';


// Page Setups

function Home() {
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
    <div className="home">
      <HeroSection movies={nowPlaying} />
      <MoviesSection title="Now Playing" movies={nowPlaying} type="nowPlaying" />
      <MoviesSection title="Coming Soon" movies={upcoming} type="upcoming" />
    </div>
  )
}

function Details() {
  return (
    <div className="details">
      <DetailsPage />
    </div>
  )
}


// Main App Function

function App() {
  return (
    // Browser Router added to implement page changing
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/details" element = {<Details />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;