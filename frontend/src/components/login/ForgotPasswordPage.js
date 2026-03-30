import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import '../../styles/login/ForgotPasswordPage.css';
import { useState } from 'react';
import { API_BASE_URL } from '../signup/SignupConstants';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email.trim().toLowerCase() })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setMessage(data.message || 'If that email is registered, a password reset link has been sent.');
                setEmail('');
            } else {
                setError(data.message || 'Unable to send reset email. Please try again.');
            }
        } catch (submitError) {
            setError(submitError.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">
            <Navbar />
            <main className="forgot-password-main">
                <div className="forgot-password-card">
                    <h1>Forgot Password</h1>
                    <p>Enter your email address to receive a password reset link.</p>
                    {message && <div className="success-message">{message}</div>}
                    {error && <div className="error-message">{error}</div>}
                    <form className="forgot-password-form" onSubmit={handleSubmit}>
                        <label className="form-row full-span">
                            <span className="form-label">Email Address</span>
                            <input
                                type="email"
                                className="form-input"
                                name="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                placeholder="you@example.com"
                                required
                            />
                        </label>
                        <button type="submit" className="primary-btn" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ForgotPasswordPage;