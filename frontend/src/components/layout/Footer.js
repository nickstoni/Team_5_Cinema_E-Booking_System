import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

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
            <li><Link to="/">Home</Link></li>
            <li><Link to="/showtimes">Showtimes</Link></li>
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
