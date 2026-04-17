import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/home/HomePage';
import MovieDetails from './components/moviedetails/MovieDetails';
import BookingPage from './components/booking/BookingPage';
import NotFoundPage from './components/notfound/NotFoundPage';
import SignUpPage from './components/signup/SignUpPage';
import LoginPage from './components/login/LoginPage';
import EditProfilePage from './components/profile/EditProfilePage';
import EmailVerificationPage from './components/signup/EmailVerificationPage';
import ForgotPasswordPage from './components/login/ForgotPasswordPage';
import ResetPasswordPage from './components/login/ResetPasswordPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ShowtimesPage from './components/showtimes/ShowtimesPage';
import CheckoutPage from './components/booking/CheckoutPage';
import PaymentPage from './components/booking/PaymentPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/booking/:movieId/:showtimeId" element={<BookingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/showtimes" element={<ShowtimesPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/profile" element={<EditProfilePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;