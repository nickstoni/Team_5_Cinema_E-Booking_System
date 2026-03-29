import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/layout/Navbar.css';

// Component for a clean navbar
function Navbar({ onSearch, onGenreChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState("");
  const [loggedIn, setLoggedIn] = useState(true); // Placeholder for auth state

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo-link">
          <div className="logo">
            <span className="logo-icon">🎬</span>
            <span className="logo-text">Absolute Cinema</span>
          </div>
        </Link>
        
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

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/showtimes">Showtimes</Link></li>
        </ul>
        {loggedIn ? (
          <div className="auth-buttons">
            <Link to="*" className="signin-link">
              <button className="login-btn">Profile</button>
            </Link>
            <button className="signin-btn">Log Out</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="signin-link">
              <button className="login-btn">Log In</button>
            </Link>
            <Link to="/signup" className="signin-link">
              <button className="signin-btn">Sign Up</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
