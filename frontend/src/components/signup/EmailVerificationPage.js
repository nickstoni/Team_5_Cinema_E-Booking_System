import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import '../../styles/signup/EmailVerification.css';

function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setMessage('Invalid verification link');
        setSuccess(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/auth/verify-email?token=${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSuccess(true);
          setMessage(data.message || 'Email verified successfully!');
          setTimeout(() => {
            navigate('/login', {
              state: { message: 'Your email has been verified. You can now log in.' }
            });
          }, 3000);
        } else {
          setSuccess(false);
          setMessage(data.message || 'Email verification failed');
        }
      } catch (error) {
        setSuccess(false);
        setMessage('An error occurred during verification. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="email-verification-page">
      <Navbar onSearch={() => {}} onGenreChange={() => {}} />

      <main className="verification-main">
        <div className="verification-container">
          <div className="verification-card">
            {loading ? (
              <>
                <div className="spinner"></div>
                <h1>Verifying Your Email...</h1>
                <p>Please wait while we verify your email address</p>
              </>
            ) : success ? (
              <>
                <div className="success-icon">✓</div>
                <h1>Email Verified!</h1>
                <p>{message}</p>
                <p className="redirect-message">Redirecting to login in 3 seconds...</p>
              </>
            ) : (
              <>
                <div className="error-icon">✗</div>
                <h1>Verification Failed</h1>
                <p>{message}</p>
                <div className="action-buttons">
                  <button
                    className="primary-btn"
                    onClick={() => navigate('/signup')}
                  >
                    Back to Sign Up
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => navigate('/')}
                  >
                    Back to Home
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default EmailVerificationPage;
