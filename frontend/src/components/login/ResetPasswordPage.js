import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import '../../styles/login/ForgotPasswordPage.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import { validateResetPasswordForm } from '../../utils/authValidation';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token.');
        }
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');

        if (!token) {
            setError('Reset token is missing.');
            return;
        }

        const validationError = validateResetPasswordForm(password, confirmPassword);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    password,
                    confirmPassword
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setMessage(data.message || 'Your password has been reset successfully.');
                setPassword('');
                setConfirmPassword('');
            } else {
                setError(data.message || 'Unable to reset your password.');
            }
        } catch (submitError) {
            setError(submitError.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-page page-bg">
            <Navbar />
            <main className="forgot-password-main">
                <div className="forgot-password-card">
                    <h1>Reset Password</h1>
                    {!message ? (
                        <>
                            <p>Enter a new password to complete your reset.</p>
                            {error && <div className="error-message">{error}</div>}
                            <form className="forgot-password-form" onSubmit={handleSubmit}>
                                <label className="form-row full-span">
                                    <span className="form-label">New Password</span>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder="New password"
                                        required
                                    />
                                </label>
                                <label className="form-row full-span">
                                    <span className="form-label">Confirm Password</span>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        placeholder="Confirm password"
                                        required
                                    />
                                </label>
                                <button type="submit" className="btn-primary" disabled={isLoading || !token}>
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="success-message">{message}</div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ResetPasswordPage;
