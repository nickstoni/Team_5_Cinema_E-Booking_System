import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import '../../styles/admin/AdminDashboard.css';
import ShowtimesSection from './ShowtimesSection';
import MoviesSection from './MoviesSection';
import PromotionsSection from './PromotionsSection';
const API = 'http://localhost:8080/api/admin';

const MPAA_RATINGS = ['g', 'pg', 'pg_13', 'r', 'nc_17'];
const AVAILABILITY_OPTIONS = ['current', 'upcoming'];
const ALL_GENRES = [
  'action', 'adventure', 'animation', 'comedy', 'crime',
  'documentary', 'drama', 'family', 'fantasy', 'history',
  'horror', 'music', 'romance', 'suspense', 'thriller', 'war'
];

// Blank form states
const blankMovie = {
  title: '', description: '', poster: '', trailer: '',
  director: '', producer: '', rating: 'pg', durationMins: '',
  releaseDate: '', showAvailability: 'current', genres: []
};

const blankPromotion = {
  promoCode: '', discountPercent: '', startDate: '', endDate: '', isActive: true
};

// Component
function AdminDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('dashboard');
  const [message, setMessage]       = useState({ text: '', type: 'success' });

  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers]           = useState([]);
  const [movies, setMovies]         = useState([]);
  const [showrooms, setShowrooms]   = useState([]);
  const [showtimes, setShowtimes]   = useState([]);
  const [promotions, setPromotions] = useState([]);

  // forms
  const [showAddMovie, setShowAddMovie]         = useState(false);
  const [showAddPromo, setShowAddPromo]         = useState(false);
  const [movieForm, setMovieForm]               = useState(blankMovie);
  const [promoForm, setPromoForm]               = useState(blankPromotion);
  const [formErrors, setFormErrors]             = useState({});
  const [submitting, setSubmitting]             = useState(false);

  // Helpers
  const showMsg = useCallback((text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: 'success' }), 5000);
  }, []);

  // Data loading
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dash, u, m, sr, st, pr] = await Promise.all([
        fetch(`${API}/dashboard`),
        fetch(`${API}/users`),
        fetch(`${API}/movies`),
        fetch(`${API}/showrooms`),
        fetch(`${API}/showtimes`),
        fetch(`${API}/promotions`),
      ]);
      if (dash.ok) setDashboardData(await dash.json());
      if (u.ok)    setUsers(await u.json());
      if (m.ok)    setMovies(await m.json());
      if (sr.ok)   setShowrooms(await sr.json());
      if (st.ok)   setShowtimes(await st.json());
      if (pr.ok)   setPromotions(await pr.json());
    } catch (err) {
      showMsg('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showMsg]);

  // Auth check
  useEffect(() => {
    const role   = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    if (!userId || role !== 'ADMIN') { navigate('/'); return; }
    loadAll();
  }, [navigate, loadAll]);

  const handleLogout = () => {
    ['cinemaAuth', 'userId', 'userRole', 'userEmail', 'cinemaPendingCheckout'].forEach(
      k => localStorage.removeItem(k)
    );
    Object.keys(localStorage)
      .filter(k => k.startsWith('seat-hold-token:'))
      .forEach(k => localStorage.removeItem(k));
    navigate('/');
  };

  // User status
  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      const res = await fetch(`${API}/users/${userId}/status?status=${newStatus}`, { method: 'PUT' });
      if (res.ok) {
        showMsg('User status updated');
        loadAll();
      } else {
        showMsg('Error updating user status', 'error');
      }
    } catch { showMsg('Network error', 'error'); }
  };

  // Movie form
  const validateMovieForm = () => {
    const errs = {};
    if (!movieForm.title.trim())           errs.title           = 'Title is required';
    if (!movieForm.showAvailability)       errs.showAvailability = 'Availability is required';
    if (movieForm.durationMins && (isNaN(movieForm.durationMins) || movieForm.durationMins <= 0))
      errs.durationMins = 'Duration must be a positive number';
    return errs;
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    const errs = validateMovieForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...movieForm,
          durationMins: movieForm.durationMins ? parseInt(movieForm.durationMins) : null,
          releaseDate: movieForm.releaseDate || null,
        }),
      });
      if (res.ok) {
        showMsg('Movie added successfully!');
        setMovieForm(blankMovie);
        setShowAddMovie(false);
        loadAll();
      } else {
        const msg = await res.text();
        showMsg(msg || 'Error adding movie', 'error');
      }
    } catch { showMsg('Network error', 'error'); }
    finally { setSubmitting(false); }
  };

  const toggleGenre = (genre) => {
    setMovieForm(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  // Promotion form
  const validatePromoForm = () => {
    const errs = {};
    if (!promoForm.promoCode.trim())  errs.promoCode      = 'Promo code is required';
    if (!promoForm.discountPercent)   errs.discountPercent = 'Discount is required';
    else if (promoForm.discountPercent <= 0 || promoForm.discountPercent > 100)
      errs.discountPercent = 'Discount must be between 1 and 100';
    if (!promoForm.startDate)         errs.startDate  = 'Start date is required';
    if (!promoForm.endDate)           errs.endDate    = 'End date is required';
    if (promoForm.startDate && promoForm.endDate && promoForm.endDate < promoForm.startDate)
      errs.endDate = 'End date must be after start date';
    return errs;
  };

  const handleAddPromotion = async (e) => {
    e.preventDefault();
    const errs = validatePromoForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/promotions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...promoForm,
          discountPercent: parseFloat(promoForm.discountPercent),
        }),
      });
      if (res.ok) {
        showMsg('Promotion created successfully!');
        setPromoForm(blankPromotion);
        setShowAddPromo(false);
        loadAll();
      } else if (res.status === 409) {
        const msg = await res.text();
        showMsg(msg, 'error');
      } else {
        const msg = await res.text();
        showMsg(msg || 'Error creating promotion', 'error');
      }
    } catch { showMsg('Network error', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleSendPromoEmail = async (promoId, promoCode) => {
    if (!window.confirm(`Send promotion email for "${promoCode}" to all subscribed users?`)) return;
    try {
      const res = await fetch(`${API}/promotions/${promoId}/send`, { method: 'POST' });
      const msg = await res.text();
      showMsg(msg, res.ok ? 'success' : 'error');
    } catch { showMsg('Network error', 'error'); }
  };

  // Render
  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="admin-dashboard page-bg">
      <Navbar onSearch={() => {}} onGenreChange={() => {}} />

      <main className="admin-main">
        <div className="admin-container">

          {/* Header */}
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
              <span onClick={() => setMessage({ text: '', type: 'success' })} className="close">×</span>
            </div>
          )}

          {/* Tabs */}
          <div className="admin-tabs">
            {[
              { key: 'dashboard',  label: 'Dashboard' },
              { key: 'movies',     label: `Manage Movies (${movies.length})` },
              { key: 'showtimes',  label: `Manage Showtimes (${showtimes.length})` },
              { key: 'promotions', label: `Manage Promotions (${promotions.length})` },
              { key: 'users',      label: `Manage Users (${users.length})` },
            ].map(t => (
              <button
                key={t.key}
                className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => { setActiveTab(t.key); setShowAddMovie(false); setShowAddPromo(false); setFormErrors({}); }}
              >{t.label}</button>
            ))}
          </div>

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && dashboardData && (
            <div className="dashboard-section">
              <h2>System Overview</h2>
              <div className="stats-grid">
                <StatCard label="Total Users"     value={dashboardData.totalUsers} />
                <StatCard label="Active Users"    value={dashboardData.activeUsers}    cls="active" />
                <StatCard label="Inactive Users"  value={dashboardData.inactiveUsers}  cls="inactive" />
                <StatCard label="Total Movies"    value={dashboardData.totalMovies} />
                <StatCard label="Total Showtimes" value={dashboardData.totalShowtimes} />
                <StatCard label="Promotions"      value={dashboardData.totalPromotions} />
              </div>
            </div>
          )}

          {/* ── MOVIES ── */}
          {activeTab === 'movies' && (
            <MoviesSection
              movies={movies}
              movieForm={movieForm}
              formErrors={formErrors}
              showAddMovie={showAddMovie}
              submitting={submitting}
              onToggleAddMovie={() => { setShowAddMovie(v => !v); setFormErrors({}); }}
              onMovieFormChange={(field, value) => setMovieForm(p => ({ ...p, [field]: value }))}
              onToggleGenre={toggleGenre}
              onSubmit={handleAddMovie}
              ratings={MPAA_RATINGS}
              availabilityOptions={AVAILABILITY_OPTIONS}
              allGenres={ALL_GENRES}
            />
          )}

          {/* ── SHOWTIMES ── */}
          {activeTab === 'showtimes' && (
            <ShowtimesSection
              movies={movies}
              showrooms={showrooms}
              showtimes={showtimes}
              onRefresh={loadAll}
              showMsg={showMsg}
            />
          )}

          {/* ── PROMOTIONS ── */}
          {activeTab === 'promotions' && (
            <PromotionsSection
              promotions={promotions}
              promoForm={promoForm}
              formErrors={formErrors}
              showAddPromo={showAddPromo}
              submitting={submitting}
              onToggleAddPromo={() => { setShowAddPromo(v => !v); setFormErrors({}); }}
              onPromoFormChange={(field, value) => setPromoForm(p => ({ ...p, [field]: value }))}
              onSubmit={handleAddPromotion}
              onSendPromoEmail={handleSendPromoEmail}
            />
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="users-section">
              <h2>User Management</h2>
              {users.length === 0 ? (
                <p className="empty-msg">No users found.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Role</th>
                      <th>Verified</th>
                      <th>Promos</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.userId}>
                        <td>{u.userId}</td>
                        <td>{u.firstName} {u.lastName}</td>
                        <td>{u.email}</td>
                        <td>{u.phoneNumber}</td>
                        <td>
                          <span className={`status-badge ${(u.status || '').toLowerCase()}`}>{u.status}</span>
                        </td>
                        <td>{u.role}</td>
                        <td>{u.emailVerified ? <span className="verified">✓</span> : <span className="unverified">✗</span>}</td>
                        <td>{u.promotionsEnabled ? <span className="verified">✓</span> : <span className="unverified">✗</span>}</td>
                        <td>
                          {u.status === 'INACTIVE' ? (
                            <button className="action-btn activate"
                              onClick={() => handleUpdateUserStatus(u.userId, 'ACTIVE')}>Activate</button>
                          ) : (
                            <button className="action-btn deactivate"
                              onClick={() => handleUpdateUserStatus(u.userId, 'INACTIVE')}>Deactivate</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

// Sub-components
function StatCard({ label, value, cls = '' }) {
  return (
    <div className="stat-card">
      <h3>{label}</h3>
      <p className={`stat-number ${cls}`}>{value}</p>
    </div>
  );
}

export default AdminDashboard;