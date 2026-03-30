import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import '../../styles/login/ForgotPasswordPage.css';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordPage() {
    const navigate = useNavigate();
    return (
        <div className="forgot-password-page">
            <Navbar />
            <main className="forgot-password-main">
                <h1>Forgot Password</h1>
                <p>Enter your email address to recover your password.</p>
                
            </main>
            <Footer />
        </div>
    );
}

export default ForgotPasswordPage;