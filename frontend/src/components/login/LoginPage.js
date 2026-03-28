import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import LoginSection from './LoginSection';
import '../../styles/login/LoginPage.css';
import { EMPTY_FORM_DATA } from '../signup/SignupConstants';
import {useState} from 'react';

function LoginPage() {
    const [formData, setFormData] = useState(EMPTY_FORM_DATA);
    //const [isLoading, setIsLoading] = useState(false);
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
            <button type="submit" className="primary-btn full-width">
                Login
            </button>
            <Footer />
        </div>
    )
}

export default LoginPage;