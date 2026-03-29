import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/home/HomePage';
import MovieDetails from './components/moviedetails/MovieDetails';
import BookingPage from './components/booking/BookingPage';
import NotFoundPage from './components/notfound/NotFoundPage';
import SignUpPage from './components/signup/SignUpPage';

import EditProfilePage from "./components/profile/EditProfilePage";

import LoginPage from './components/login/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/booking/:movieId/:showtimeId" element={<BookingPage />} />
          {/* Properly route the showtimes page later */}
          <Route path="/showtimes" element={<NotFoundPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/profile" element={<EditProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;