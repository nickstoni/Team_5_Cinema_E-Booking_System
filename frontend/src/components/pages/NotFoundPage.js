import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import '../../styles/NotFoundPage.css';

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <Navbar />
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Page Not Found</h2>
          <p className="error-message">
            Sorry, the page you're looking for doesn't exist or is under construction.
          </p>
          <Link to="/" className="back-home-button">
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NotFoundPage;
