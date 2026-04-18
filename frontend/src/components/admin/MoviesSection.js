function fmt(val) {
  return val ?? '-';
}

function MoviesSection({
  movies = [],
  movieForm,
  formErrors,
  showAddMovie,
  submitting,
  onToggleAddMovie,
  onMovieFormChange,
  onToggleGenre,
  onSubmit,
  ratings = [],
  availabilityOptions = [],
  allGenres = []
}) {
  return (
    <div className="movies-section">
      <div className="section-header">
        <h2>Movie Management</h2>
        <button className="btn-primary" onClick={onToggleAddMovie}>
          {showAddMovie ? 'Cancel' : '+ Add Movie'}
        </button>
      </div>

      {showAddMovie && (
        <form className="admin-form" onSubmit={onSubmit} noValidate>
          <h3>Add New Movie</h3>
          <div className="form-grid">
            <FormField label="Title *" error={formErrors.title}>
              <input
                value={movieForm.title}
                onChange={e => onMovieFormChange('title', e.target.value)}
                placeholder="Movie title"
                maxLength={100}
              />
            </FormField>

            <FormField label="Director" error={formErrors.director}>
              <input
                value={movieForm.director}
                onChange={e => onMovieFormChange('director', e.target.value)}
                placeholder="Director name"
                maxLength={100}
              />
            </FormField>

            <FormField label="Producer" error={formErrors.producer}>
              <input
                value={movieForm.producer}
                onChange={e => onMovieFormChange('producer', e.target.value)}
                placeholder="Producer name"
                maxLength={100}
              />
            </FormField>

            <FormField label="MPAA Rating *" error={formErrors.rating}>
              <select value={movieForm.rating} onChange={e => onMovieFormChange('rating', e.target.value)}>
                {ratings.map(r => (
                  <option key={r} value={r}>
                    {r.replace('_', '-').toUpperCase()}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Duration (mins)" error={formErrors.durationMins}>
              <input
                type="number"
                min="1"
                max="600"
                value={movieForm.durationMins}
                onChange={e => onMovieFormChange('durationMins', e.target.value)}
                placeholder="e.g. 120"
              />
            </FormField>

            <FormField label="Release Date" error={formErrors.releaseDate}>
              <input
                type="date"
                value={movieForm.releaseDate}
                onChange={e => onMovieFormChange('releaseDate', e.target.value)}
              />
            </FormField>

            <FormField label="Show Availability *" error={formErrors.showAvailability}>
              <select value={movieForm.showAvailability} onChange={e => onMovieFormChange('showAvailability', e.target.value)}>
                {availabilityOptions.map(a => (
                  <option key={a} value={a}>
                    {a.charAt(0).toUpperCase() + a.slice(1)}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Poster URL" error={formErrors.poster}>
              <input
                value={movieForm.poster}
                onChange={e => onMovieFormChange('poster', e.target.value)}
                placeholder="https://..."
                maxLength={200}
              />
            </FormField>

            <FormField label="Trailer URL (YouTube)" error={formErrors.trailer}>
              <input
                value={movieForm.trailer}
                onChange={e => onMovieFormChange('trailer', e.target.value)}
                placeholder="https://youtube.com/..."
                maxLength={500}
              />
            </FormField>
          </div>

          <FormField label="Synopsis" error={formErrors.description} fullWidth>
            <textarea
              rows={3}
              value={movieForm.description}
              onChange={e => onMovieFormChange('description', e.target.value)}
              placeholder="Movie description..."
              maxLength={1000}
            />
          </FormField>

          <div className="form-field full-width">
            <label>Genres</label>
            <div className="genre-checkboxes">
              {allGenres.map(g => (
                <label key={g} className={`genre-chip ${movieForm.genres.includes(g) ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={movieForm.genres.includes(g)}
                    onChange={() => onToggleGenre(g)}
                    hidden
                  />
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Add Movie'}
            </button>
            <button type="button" className="cancel-btn" onClick={onToggleAddMovie}>
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
                      <img
                        src={m.poster}
                        alt={m.title}
                        className="movie-thumb"
                        onError={e => {
                          e.target.src = 'https://via.placeholder.com/50x75?text=N/A';
                        }}
                      />
                    ) : (
                      <span className="no-img">No img</span>
                    )}
                  </td>
                  <td><strong>{m.title}</strong></td>
                  <td>{m.mpaaRating ? m.mpaaRating.replace('_', '-').toUpperCase() : '-'}</td>
                  <td>{fmt(m.director)}</td>
                  <td>{m.durationMins ? `${m.durationMins} min` : '-'}</td>
                  <td>
                    <span className={`status-badge ${m.showAvailability === 'current' ? 'active' : 'upcoming'}`}>
                      {m.showAvailability ?? '-'}
                    </span>
                  </td>
                  <td className="genres-cell">
                    {m.genres && m.genres.length > 0 ? m.genres.map(g => g.genreName).join(', ') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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

export default MoviesSection;
