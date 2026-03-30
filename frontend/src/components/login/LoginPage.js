import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import LoginSection from './LoginSection';
import '../../styles/login/LoginPage.css';
import { API_BASE_URL, EMPTY_FORM_DATA } from '../signup/SignupConstants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [formData, setFormData] = useState(EMPTY_FORM_DATA);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password
                })
            });

            const data = await response.json();
            if (response.ok && data.success) {
                navigate('/');
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (submitError) {
            setError(submitError.message || 'Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Navbar />
            <main className="login-main">
                <h1>Login</h1>
                    <form className="login-form" onSubmit={handleSubmit}>
                        {error ? <div className="login-error">{error}</div> : null}
                        <LoginSection formData={formData} onInputChange={handleInputChange} />
                        <div className="submit-section">
                            <button
                                type="button"
                                className="forgot-password-btn"
                                onClick={() => navigate('/login/forgot-password')}
                            >
                                Forgot Password?
                            </button>
                            <button type="submit" className="submit-button" disabled={isLoading}>
                                {isLoading ? 'Logging In...' : 'Login'}
                            </button>
                        </div>
                    </form>
            </main>
            <Footer />
        </div>
    );
}

export default LoginPage;