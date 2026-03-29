import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import LoginSection from './LoginSection';
import '../../styles/login/LoginPage.css';
import { EMPTY_FORM_DATA } from '../signup/SignupConstants';
import {useState} from 'react';

function LoginPage() {
    const [formData, setFormData] = useState(EMPTY_FORM_DATA);
    const [isLoading, setIsLoading] = useState(false);
    //const [error, setError] = useState('');
    //const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="login-page">
            <Navbar />
            <main className="login-main">
                <h1>Login</h1>
                <LoginSection formData={formData} onInputChange={handleInputChange} />
            </main>
            <div className="submit-section">
                <button type="button" className="forgot-password-btn">
                    Forgot Password?
                </button>
                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? 'Logging In...' : 'Login'}
                </button>
            </div>
            <Footer />
        </div>
    )
}

export default LoginPage;