import React, { useState, useEffect } from 'react';
import '../styles/HeroSection.css';

function HeroSection({ movies }) {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // If movies list changes (ex: loads from API), reset index safely
  useEffect(() => {
    setCurrentHeroIndex(0);
  }, [movies]);

  // If movies not loaded yet, don't render hero (prevents blank crash)
  if (!movies || movies.length === 0) {
    return null; // or return a loading banner if you want
  }

  const nextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % movies.length);
  };

  const prevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const current = movies[currentHeroIndex];

  return (
    <section className="hero">
      <div className="hero-slider">
        <img
          src={current.poster}   // ✅ backend field
          alt={current.title}
          className="hero-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{current.title}</h1>
          <div className="hero-buttons">
            <button className="btn-primary">Book Now</button>
            <button className="btn-secondary">Watch Trailer</button>
          </div>
        </div>
        <button className="hero-btn hero-btn-left" onClick={prevHero}>←</button>
        <button className="hero-btn hero-btn-right" onClick={nextHero}>→</button>
      </div>
    </section>
  );
}

export default HeroSection;