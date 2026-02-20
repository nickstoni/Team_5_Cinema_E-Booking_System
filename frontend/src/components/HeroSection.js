// TO DO:
// - Maybe implement a small quick numerical access for movies in the hero section

import React, { useState } from 'react';
import '../styles/HeroSection.css';

// Component for a clean hero section for the website
function HeroSection({ movies }) {
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Functions used to update the state (update the movies on the hero section)
  const nextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % movies.length);
  };
  const prevHero = () => {
    setCurrentHeroIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <section className="hero">
      <div className="hero-slider">
        <img 
          src={movies[currentHeroIndex].image} 
          alt={movies[currentHeroIndex].title}
          className="hero-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">{movies[currentHeroIndex].title}</h1>
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
