function RequiredInfoSection({ formData, onInputChange }) {
  return (
    <section className="signup-section">
      <h2>Required Information</h2>
      <div className="signup-grid two-columns">
        <label className="form-row">
          <span className="form-label">Full Name*</span>
          <input
            type="text"
            className="form-input"
            name="fullName"
            value={formData.fullName}
            onChange={onInputChange}
            autoComplete="name"
            placeholder="Your Name"
            required
          />
        </label>

        <label className="form-row full-span">
          <span className="form-label">Email Address*</span>
          <input
            type="email"
            className="form-input"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="form-row">
          <span className="form-label">Phone Number*</span>
          <input
            type="tel"
            className="form-input"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onInputChange}
            autoComplete="tel"
            placeholder="(123) 456-7890"
            required
          />
        </label>

        <label className="form-row">
          <span className="form-label">Password* (min 8 chars)</span>
          <input
            type="password"
            className="form-input"
            name="password"
            value={formData.password}
            onChange={onInputChange}
            autoComplete="new-password"
            placeholder="Enter at least 8 characters"
            required
          />
        </label>

        <label className="form-row">
          <span className="form-label">Confirm Password*</span>
          <input
            type="password"
            className="form-input"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onInputChange}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            required
          />
        </label>
      </div>
    </section>
  );
}

export default RequiredInfoSection;
