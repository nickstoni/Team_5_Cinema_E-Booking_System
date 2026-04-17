import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import '../../styles/admin/AdminDashboard.css';

const API = 'http://localhost:8080/api/admin';

const MPAA_RATINGS = ['g', 'pg', 'pg_13', 'r', 'nc_17'];
const AVAILABILITY_OPTIONS = ['current', 'upcoming'];
const ALL_GENRES = [
  'action', 'adventure', 'animation', 'comedy', 'crime',
  'documentary', 'drama', 'family', 'fantasy', 'history',
  'horror', 'music', 'romance', 'suspense', 'thriller', 'war'
];

// Helpers
function fmt(val) { return val ?? '-'; }
function fmtTime(t) {
  if (!t) return '-';
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

// Blank form states
const blankMovie = {
  title: '', description: '', poster: '', trailer: '',
  director: '', producer: '', rating: 'pg', durationMins: '',
  releaseDate: '', showAvailability: 'current', genres: []
};

const blankShowtime = {
  movieId: '', showDate: '', startTime: '', showroomId: '', durationMins: ''
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
  const [showAddShowtime, setShowAddShowtime]   = useState(false);
  const [showAddPromo, setShowAddPromo]         = useState(false);
  const [movieForm, setMovieForm]               = useState(blankMovie);
  const [showtimeForm, setShowtimeForm]         = useState(blankShowtime);
  const [promoForm, setPromoForm]               = useState(blankPromotion);
  const [formErrors, setFormErrors]             = useState({});
  const [submitting, setSubmitting]             = useState(false);

  // Auth check
  useEffect(() => {
    const role   = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    if (!userId || role !== 'ADMIN') { navigate('/'); return; }
    loadAll();
  }, [navigate]);

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
  }, []);

  // Helpers
  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: 'success' }), 5000);
  };

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

  // Showtime form
  const validateShowtimeForm = () => {
    const errs = {};
    if (!showtimeForm.movieId)    errs.movieId    = 'Select a movie';
    if (!showtimeForm.showDate)   errs.showDate   = 'Select a date';
    if (!showtimeForm.startTime)  errs.startTime  = 'Select a start time';
    if (!showtimeForm.showroomId) errs.showroomId = 'Select a showroom';
    return errs;
  };

  const handleAddShowtime = async (e) => {
    e.preventDefault();
    const errs = validateShowtimeForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/showtimes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId:    parseInt(showtimeForm.movieId),
          showDate:   showtimeForm.showDate,
          startTime:  showtimeForm.startTime,
          showroomId: parseInt(showtimeForm.showroomId),
          durationMins: showtimeForm.durationMins ? parseInt(showtimeForm.durationMins) : null,
        }),
      });
      if (res.ok) {
        showMsg('Showtime scheduled successfully!');
        setShowtimeForm(blankShowtime);
        setShowAddShowtime(false);
        loadAll();
      } else if (res.status === 409) {
        const msg = await res.text();
        showMsg(msg, 'error');
      } else {
        const msg = await res.text();
        showMsg(msg || 'Error adding showtime', 'error');
      }
    } catch { showMsg('Network error', 'error'); }
    finally { setSubmitting(false); }
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
    <div className="admin-dashboard">
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
                onClick={() => { setActiveTab(t.key); setShowAddMovie(false); setShowAddShowtime(false); setShowAddPromo(false); setFormErrors({}); }}
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
            <div className="movies-section">
              <div className="section-header">
                <h2>Movie Management</h2>
                <button className="primary-btn" onClick={() => { setShowAddMovie(v => !v); setFormErrors({}); }}>
                  {showAddMovie ? 'Cancel' : '+ Add Movie'}
                </button>
              </div>

              {showAddMovie && (
                <form className="admin-form" onSubmit={handleAddMovie} noValidate>
                  <h3>Add New Movie</h3>
                  <div className="form-grid">
                    <FormField label="Title *" error={formErrors.title}>
                      <input value={movieForm.title} onChange={e => setMovieForm(p => ({...p, title: e.target.value}))}
                        placeholder="Movie title" maxLength={100} />
                    </FormField>

                    <FormField label="Director" error={formErrors.director}>
                      <input value={movieForm.director} onChange={e => setMovieForm(p => ({...p, director: e.target.value}))}
                        placeholder="Director name" maxLength={100} />
                    </FormField>

                    <FormField label="Producer" error={formErrors.producer}>
                      <input value={movieForm.producer} onChange={e => setMovieForm(p => ({...p, producer: e.target.value}))}
                        placeholder="Producer name" maxLength={100} />
                    </FormField>

                    <FormField label="MPAA Rating *" error={formErrors.rating}>
                      <select value={movieForm.rating} onChange={e => setMovieForm(p => ({...p, rating: e.target.value}))}>
                        {MPAA_RATINGS.map(r => <option key={r} value={r}>{r.replace('_', '-').toUpperCase()}</option>)}
                      </select>
                    </FormField>

                    <FormField label="Duration (mins)" error={formErrors.durationMins}>
                      <input type="number" min="1" max="600" value={movieForm.durationMins}
                        onChange={e => setMovieForm(p => ({...p, durationMins: e.target.value}))}
                        placeholder="e.g. 120" />
                    </FormField>

                    <FormField label="Release Date" error={formErrors.releaseDate}>
                      <input type="date" value={movieForm.releaseDate}
                        onChange={e => setMovieForm(p => ({...p, releaseDate: e.target.value}))} />
                    </FormField>

                    <FormField label="Show Availability *" error={formErrors.showAvailability}>
                      <select value={movieForm.showAvailability} onChange={e => setMovieForm(p => ({...p, showAvailability: e.target.value}))}>
                        {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                      </select>
                    </FormField>

                    <FormField label="Poster URL" error={formErrors.poster}>
                      <input value={movieForm.poster} onChange={e => setMovieForm(p => ({...p, poster: e.target.value}))}
                        placeholder="https://..." maxLength={200} />
                    </FormField>

                    <FormField label="Trailer URL (YouTube)" error={formErrors.trailer}>
                      <input value={movieForm.trailer} onChange={e => setMovieForm(p => ({...p, trailer: e.target.value}))}
                        placeholder="https://youtube.com/..." maxLength={500} />
                    </FormField>
                  </div>

                  <FormField label="Synopsis" error={formErrors.description} fullWidth>
                    <textarea rows={3} value={movieForm.description}
                      onChange={e => setMovieForm(p => ({...p, description: e.target.value}))}
                      placeholder="Movie description..." maxLength={1000} />
                  </FormField>

                  <div className="form-field full-width">
                    <label>Genres</label>
                    <div className="genre-checkboxes">
                      {ALL_GENRES.map(g => (
                        <label key={g} className={`genre-chip ${movieForm.genres.includes(g) ? 'selected' : ''}`}>
                          <input type="checkbox" checked={movieForm.genres.includes(g)} onChange={() => toggleGenre(g)} hidden />
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="primary-btn" disabled={submitting}>
                      {submitting ? 'Saving...' : 'Add Movie'}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => { setShowAddMovie(false); setFormErrors({}); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {movies.length === 0 ? (
                <p className="empty-msg">No movies found. Add your first movie above.</p>
              ) : (
                <div className="movies-admin-list">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Poster</th>
                        <th>Title</th>
                        <th>Rating</th>
                        <th>Director</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Genres</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movies.map(m => (
                        <tr key={m.movieId}>
                          <td>
                            {m.poster ? (
                              <img src={m.poster} alt={m.title} className="movie-thumb"
                                onError={e => { e.target.src = 'https://via.placeholder.com/50x75?text=N/A'; }} />
                            ) : <span className="no-img">No img</span>}
                          </td>
                          <td><strong>{m.title}</strong></td>
                          <td>{m.mpaaRating ? m.mpaaRating.replace('_','-').toUpperCase() : '-'}</td>
                          <td>{fmt(m.director)}</td>
                          <td>{m.durationMins ? `${m.durationMins} min` : '-'}</td>
                          <td>
                            <span className={`status-badge ${m.showAvailability === 'current' ? 'active' : 'upcoming'}`}>
                              {m.showAvailability ?? '-'}
                            </span>
                          </td>
                          <td className="genres-cell">
                            {m.genres && m.genres.length > 0
                              ? m.genres.map(g => g.genreName).join(', ')
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── SHOWTIMES ── */}
          {activeTab === 'showtimes' && (
            <div className="showtimes-section">
              <div className="section-header">
                <h2>Showtimes Management</h2>
                <button className="primary-btn" onClick={() => { setShowAddShowtime(v => !v); setFormErrors({}); }}>
                  {showAddShowtime ? 'Cancel' : '+ Schedule Showtime'}
                </button>
              </div>

              {showAddShowtime && (
                <form className="admin-form" onSubmit={handleAddShowtime} noValidate>
                  <h3>Schedule a Showtime</h3>
                  <div className="form-grid">
                    <FormField label="Movie *" error={formErrors.movieId}>
                      <select value={showtimeForm.movieId}
                        onChange={e => setShowtimeForm(p => ({...p, movieId: e.target.value}))}>
                        <option value="">-- Select Movie --</option>
                        {movies.map(m => <option key={m.movieId} value={m.movieId}>{m.title}</option>)}
                      </select>
                    </FormField>

                    <FormField label="Showroom *" error={formErrors.showroomId}>
                      <select value={showtimeForm.showroomId}
                        onChange={e => setShowtimeForm(p => ({...p, showroomId: e.target.value}))}>
                        <option value="">-- Select Showroom --</option>
                        {showrooms.map(r => (
                          <option key={r.roomId} value={r.roomId}>
                            {r.roomName} ({r.totalSeats} seats)
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Date *" error={formErrors.showDate}>
                      <input type="date" value={showtimeForm.showDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setShowtimeForm(p => ({...p, showDate: e.target.value}))} />
                    </FormField>

                    <FormField label="Start Time *" error={formErrors.startTime}>
                      <input type="time" value={showtimeForm.startTime}
                        onChange={e => setShowtimeForm(p => ({...p, startTime: e.target.value}))} />
                    </FormField>

                    <FormField label="Duration (mins)" error={formErrors.durationMins}>
                      <input type="number" min="1" max="600" value={showtimeForm.durationMins}
                        onChange={e => setShowtimeForm(p => ({...p, durationMins: e.target.value}))}
                        placeholder="e.g. 120" />
                    </FormField>
                  </div>

                  <div className="scheduling-note">
                    <span>ℹ</span> Conflicts (same showroom + time) will be rejected automatically.
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="primary-btn" disabled={submitting}>
                      {submitting ? 'Scheduling...' : 'Schedule Showtime'}
                    </button>
                    <button type="button" className="cancel-btn"
                      onClick={() => { setShowAddShowtime(false); setFormErrors({}); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {showtimes.length === 0 ? (
                <p className="empty-msg">No showtimes scheduled yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Movie</th>
                      <th>Showroom</th>
                      <th>Date</th>
                      <th>Start Time</th>
                      <th>Duration</th>
                      <th>Total Seats</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showtimes.map(st => (
                      <tr key={st.showtimeId}>
                        <td>{st.showtimeId}</td>
                        <td><strong>{st.movieTitle}</strong></td>
                        <td>{st.showroomName}</td>
                        <td>{st.showDate}</td>
                        <td>{fmtTime(st.startTime)}</td>
                        <td>{st.durationMins ? `${st.durationMins} min` : '-'}</td>
                        <td>{st.totalSeats}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── PROMOTIONS ── */}
          {activeTab === 'promotions' && (
            <div className="promotions-section">
              <div className="section-header">
                <h2>Promotions Management</h2>
                <button className="primary-btn" onClick={() => { setShowAddPromo(v => !v); setFormErrors({}); }}>
                  {showAddPromo ? 'Cancel' : '+ Create Promotion'}
                </button>
              </div>

              {showAddPromo && (
                <form className="admin-form" onSubmit={handleAddPromotion} noValidate>
                  <h3>Create Promotion</h3>
                  <div className="form-grid">
                    <FormField label="Promo Code *" error={formErrors.promoCode}>
                      <input value={promoForm.promoCode}
                        onChange={e => setPromoForm(p => ({...p, promoCode: e.target.value.toUpperCase()}))}
                        placeholder="e.g. SUMMER20" maxLength={50} />
                    </FormField>

                    <FormField label="Discount % *" error={formErrors.discountPercent}>
                      <input type="number" min="1" max="100" step="0.01"
                        value={promoForm.discountPercent}
                        onChange={e => setPromoForm(p => ({...p, discountPercent: e.target.value}))}
                        placeholder="e.g. 20" />
                    </FormField>

                    <FormField label="Start Date *" error={formErrors.startDate}>
                      <input type="date" value={promoForm.startDate}
                        onChange={e => setPromoForm(p => ({...p, startDate: e.target.value}))} />
                    </FormField>

                    <FormField label="End Date *" error={formErrors.endDate}>
                      <input type="date" value={promoForm.endDate}
                        min={promoForm.startDate || undefined}
                        onChange={e => setPromoForm(p => ({...p, endDate: e.target.value}))} />
                    </FormField>

                    <FormField label="Active">
                      <label className="toggle-label">
                        <input type="checkbox" checked={promoForm.isActive}
                          onChange={e => setPromoForm(p => ({...p, isActive: e.target.checked}))} />
                        <span>{promoForm.isActive ? 'Active' : 'Inactive'}</span>
                      </label>
                    </FormField>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="primary-btn" disabled={submitting}>
                      {submitting ? 'Creating...' : 'Create Promotion'}
                    </button>
                    <button type="button" className="cancel-btn"
                      onClick={() => { setShowAddPromo(false); setFormErrors({}); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {promotions.length === 0 ? (
                <p className="empty-msg">No promotions found.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Discount</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {promotions.map(p => (
                      <tr key={p.promoId}>
                        <td><strong>{p.promoCode}</strong></td>
                        <td>{p.discountPercent}%</td>
                        <td>{p.startDate}</td>
                        <td>{p.endDate}</td>
                        <td>
                          <span className={`status-badge ${p.isActive ? 'active' : 'inactive'}`}>
                            {p.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn send-email"
                            onClick={() => handleSendPromoEmail(p.promoId, p.promoCode)}>
                            Send Email
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="users-section">
              <h2>User Management</h2>
              {users.length === 0 ? <p className="empty-msg">No users found.</p> : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
                      <th>Status</th><th>Role</th><th>Verified</th><th>Promotions</th><th>Actions</th>
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

function FormField({ label, error, children, fullWidth = false }) {
  return (
    <div className={`form-field ${fullWidth ? 'full-width' : ''}`}>
      <label>{label}</label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default AdminDashboard;