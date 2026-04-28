import { useState } from 'react';
import { API_BASE_URL } from '../../config/api';

const API = `${API_BASE_URL}/api/admin`;

const blankShowtime = {
  movieId: '',
  showDate: '',
  startTime: '',
  showroomId: '',
  durationMins: ''
};

function ShowtimesSection({
  movies = [],
  showrooms = [],
  showtimes = [],
  onRefresh,
  showMsg
}) {
	const [showAddShowtime, setShowAddShowtime] = useState(false);
	const [showtimeForm, setShowtimeForm] = useState(blankShowtime);
	const [formErrors, setFormErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	const validateShowtimeForm = () => {
		const errs = {};
		if (!showtimeForm.movieId) errs.movieId = 'Select a movie';
		if (!showtimeForm.showDate) errs.showDate = 'Select a date';
		if (!showtimeForm.startTime) errs.startTime = 'Select a start time';
		if (!showtimeForm.showroomId) errs.showroomId = 'Select a showroom';
		return errs;
	};

	const handleAddShowtime = async (e) => {
		e.preventDefault();
		const errs = validateShowtimeForm();
		if (Object.keys(errs).length) {
			setFormErrors(errs);
			return;
		}

		setFormErrors({});
		setSubmitting(true);
		try {
			const res = await fetch(`${API}/showtimes`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					movieId: parseInt(showtimeForm.movieId, 10),
					showDate: showtimeForm.showDate,
					startTime: showtimeForm.startTime,
					showroomId: parseInt(showtimeForm.showroomId, 10),
					durationMins: showtimeForm.durationMins ? parseInt(showtimeForm.durationMins, 10) : null,
				}),
			});

			if (res.ok) {
				showMsg?.('Showtime scheduled successfully!');
				setShowtimeForm(blankShowtime);
				setShowAddShowtime(false);
				onRefresh?.();
			} else if (res.status === 409) {
				const msg = await res.text();
				showMsg?.(msg, 'error');
			} else {
				const msg = await res.text();
				showMsg?.(msg || 'Error adding showtime', 'error');
			}
		} catch {
			showMsg?.('Network error', 'error');
		} finally {
			setSubmitting(false);
		}
	};
  
	return (
    <div className="showtimes-section">
      <div className="section-header">
        <h2>Showtimes Management</h2>
        <button className="btn-primary" onClick={() => { setShowAddShowtime(v => !v); setFormErrors({}); }}>
          {showAddShowtime ? 'Cancel' : '+ Schedule Showtime'}
        </button>
      </div>

      {showAddShowtime && (
        <form className="admin-form" onSubmit={handleAddShowtime} noValidate>
          <h3>Schedule a Showtime</h3>
          <div className="form-grid">
            <FormField label="Movie *" error={formErrors.movieId}>
              <select
                value={showtimeForm.movieId}
                onChange={e => setShowtimeForm(p => ({ ...p, movieId: e.target.value }))}
              >
                <option value="">-- Select Movie --</option>
                {movies.map(movie => (
                  <option key={movie.movieId} value={movie.movieId}>{movie.title}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Showroom *" error={formErrors.showroomId}>
              <select
                value={showtimeForm.showroomId}
                onChange={e => setShowtimeForm(p => ({ ...p, showroomId: e.target.value }))}
              >
                <option value="">-- Select Showroom --</option>
                {showrooms.map(showroom => (
                  <option key={showroom.roomId} value={showroom.roomId}>
                    {showroom.roomName} ({showroom.totalSeats} seats)
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Date *" error={formErrors.showDate}>
              <input
                type="date"
                value={showtimeForm.showDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setShowtimeForm(p => ({ ...p, showDate: e.target.value }))}
              />
            </FormField>

            <FormField label="Start Time *" error={formErrors.startTime}>
              <input
                type="time"
                value={showtimeForm.startTime}
                onChange={e => setShowtimeForm(p => ({ ...p, startTime: e.target.value }))}
              />
            </FormField>

            <FormField label="Duration (mins)" error={formErrors.durationMins}>
              <input
                type="number"
                min="1"
                max="600"
                value={showtimeForm.durationMins}
                onChange={e => setShowtimeForm(p => ({ ...p, durationMins: e.target.value }))}
                placeholder="e.g. 120"
              />
            </FormField>
          </div>

          <div className="scheduling-note">
            <span>ℹ</span> Conflicts (same showroom + time) will be rejected automatically.
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Schedule Showtime'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => { setShowAddShowtime(false); setFormErrors({}); }}
            >
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map(st => (
              <tr key={st.showtimeId}>
                <td>{st.showtimeId}</td>
                <td><strong>{st.movieTitle}</strong></td>
                <td>{st.showroomName}</td>
                <td>{st.showDate}</td>
                <td>{st.startTime}</td>
                <td>{st.durationMins ? `${st.durationMins} min` : '-'}</td>
                <td>{st.totalSeats}</td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="action-btn edit">Edit</button>
                    <button type="button" className="action-btn delete">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function FormField({ label, error, children }) {
	return (
		<div className="form-field">
			<label>{label}</label>
			{children}
			{error && <span className="field-error">{error}</span>}
		</div>
	);
}

export default ShowtimesSection;