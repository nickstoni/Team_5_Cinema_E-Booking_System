import { useEffect, useState } from 'react';

function ShowtimeSection({
  formData = {},
  onInputChange,
  onSubmit,
  onCancel
}) {
	const [movies, setMovies] = useState([]);
	const [showrooms, setShowrooms] = useState([]);

	useEffect(() => {
		fetch("http://localhost:8080/api/movies")
			.then(res => res.json())
			.then(data => setMovies(data))
			.catch(err => console.error("Error fetching movies:", err));

		fetch("http://localhost:8080/api/showrooms")
			.then(res => res.json())
			.then(data => setShowrooms(data))
			.catch(err => console.error("Error fetching showrooms:", err));
	}, []);
  
	return (
    <section className="signup-section">
      <div className="section-header-row">
        <h2>Add Showtime</h2>
      </div>

      <div className="card-box">
        <div className="signup-grid two-columns">

          {/* Movie Dropdown */}
          <label className="form-row full-span">
            <span className="form-label">Movie</span>
            <select
              className="form-input"
              name="movieId"
              value={formData.movieId || ""}
              onChange={onInputChange}
            >
              <option value="">Select Movie</option>
              {movies.map(movie => (
								<option key={movie.movieId} value={movie.movieId}>
									{movie.title}
								</option>
							))}
            </select>
          </label>

          {/* Showroom Dropdown */}
          <label className="form-row full-span">
            <span className="form-label">Showroom</span>
            <select
              className="form-input"
              name="showroomId"
              value={formData.showroomId || ""}
              onChange={onInputChange}
            >
              <option value="">Select Showroom</option>
							{showrooms.map(showroom => (
								<option key={showroom.roomId} value={showroom.roomId}>
									{showroom.roomName}
								</option>
							))}
            </select>
          </label>

          {/* Date */}
          <label className="form-row">
            <span className="form-label">Date</span>
            <input
              type="date"
              className="form-input"
              name="showDate"
              value={formData.showDate || ""}
              onChange={onInputChange}
            />
          </label>

          {/* Start Time */}
          <label className="form-row">
            <span className="form-label">Start Time</span>
						<select
              className="form-input"
              name="startTime"
              value={formData.startTime || ""}
              onChange={onInputChange}
            >
              <option value="">Select Start Time</option>
              <option value="09:00">09:00</option>
							<option value="12:00">12:00</option>
							<option value="15:00">15:00</option>
							<option value="18:00">18:00</option>
							<option value="21:00">21:00</option>
            </select>
          </label>
					<br/>

        </div>

        {/* Buttons */}
        <div className="section-header-row compact">
          <button className="secondary-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="primary-btn" onClick={onSubmit}>
            Save Showtime
          </button>
        </div>
      </div>
    </section>
  );
}

export default ShowtimeSection;