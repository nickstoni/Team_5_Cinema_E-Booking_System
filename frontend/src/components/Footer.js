// TO DO:
// - Maybe add more content in the Footer (I am out of ideas lol)

import '../styles/Footer.css';

// Component for a clean and simple footer
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Absolute Cinema</h3>
          <p>The best place for movie ticket booking.</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#movies">Movies</a></li>
            <li><a href="#showtimes">Showtimes</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; Absolute Cinema. All rights reserved. | Team 5 Project</p>
      </div>
    </footer>
  );
}

export default Footer;
