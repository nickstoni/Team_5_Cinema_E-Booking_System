// TO DO:
// - Implement Search Function
// - Route the pages properly (Maybe using the Link component)

import { useState } from 'react';
import { Link } from 'react-router-dom';

import '../styles/Navbar.css';


// Component for a clean navbar
function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // NEED TO IMPLEMENT SEARCH
    console.log('Searching for:', searchQuery);
  };

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
          <button type="submit" className="search-btn">
            <span>🔍</span>
          </button>
        </form>

        {/* Later need to implement proper routing to different pages 
            Added links, showtimes temporarily links to Home amd details moved to Movies for testing
        */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link>{""}</li>
          <li> <Link to="/details">Movies</Link>{""}</li>
          <li><Link to="/">Showtimes</Link></li>
        </ul>

        {/* Later need to implement proper routing to different pages */}
        <button className="signin-btn">Sign In</button>
      </div>
    </nav>
  );
}

export default Navbar;
