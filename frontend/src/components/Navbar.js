// TO DO:
// - Implement Search Function
// - Route the pages properly (Maybe using the Link component)

import { useState } from 'react';
import '../styles/Navbar.css';

// Component for a clean navbar
function Navbar({ onSearch, onGenreChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery); 
  };
/*function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // NEED TO IMPLEMENT SEARCH
    console.log('Searching for:', searchQuery);
  };*/

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Absolute Cinema</span>
        </div>
        
        {/* Form for the Search bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={genre}
            onChange={(e) => {
              const val = e.target.value;
              setGenre(val);
              onGenreChange(val);
            }}
            className="genre-select"
          >
            <option value="">All Genres</option>
            <option value="Drama">Drama</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Thriller">Thriller</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Animation">Animation</option>
            <option value="Family">Family</option>
            <option value="Fantasy">Fantasy</option>
            <option value="History">History</option>
            <option value="Horror">Horror</option>
            <option value="Adventure">Adventure</option>
          </select>
          <button type="submit" className="search-btn">
            <span>🔍</span>
          </button>
        </form>

        {/* Later need to implement proper routing to different pages */}
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#movies">Movies</a></li>
          <li><a href="#showtimes">Showtimes</a></li>
        </ul>

        {/* Later need to implement proper routing to different pages */}
        <button className="signin-btn">Sign In</button>
      </div>
    </nav>
  );
}

export default Navbar;
