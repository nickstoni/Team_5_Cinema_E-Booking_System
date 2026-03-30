function RequiredInfoSection({ formData, onInputChange, isEditMode = false }) {
  const handlePromotionsChange = (e) => {
    const event = {
      target: {
        name: 'promotionsEnabled',
        value: e.target.checked
      }
    };
    onInputChange(event);
  };

  return (
    <section className="signup-section">
      <h2>Required Information</h2>
      <div className="signup-grid two-columns">
        <label className="form-row">
          <span className="form-label">First Name*</span>
          <input
            type="text"
            className="form-input"
            name="firstName"
            value={formData.firstName || ""}
            onChange={onInputChange}
            autoComplete="given-name"
            placeholder="First Name"
            required
          />
        </label>

        <label className="form-row">
          <span className="form-label">Last Name*</span>
          <input
            type="text"
            className="form-input"
            name="lastName"
            value={formData.lastName || ""}
            onChange={onInputChange}
            autoComplete="family-name"
            placeholder="Last Name"
            required
          />
        </label>

        <label className="form-row full-span">
          <span className="form-label">Email Address*</span>
          <input
            type="email"
            className="form-input"
            name="email"
            value={formData.email || ""}
            onChange={onInputChange}
            autoComplete="email"
            placeholder="you@example.com"
            required
            disabled={isEditMode}
            readOnly={isEditMode}
          />
        </label>

        <label className="form-row">
          <span className="form-label">Phone Number*</span>
          <input
            type="tel"
            className="form-input"
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={onInputChange}
            autoComplete="tel"
            placeholder="(123) 456-7890"
            required
          />
        </label>

        {!isEditMode && (
          <>
            <label className="form-row">
              <span className="form-label">Password* (min 8 chars)</span>
              <input
                type="password"
                className="form-input"
                name="password"
                value={formData.password || ""}
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
                value={formData.confirmPassword || ""}
                onChange={onInputChange}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                required
              />
            </label>
          </>
        )}

        <label className="form-row full-span checkbox-label">
          <input
            type="checkbox"
            className="form-checkbox"
            name="promotionsEnabled"
            checked={formData.promotionsEnabled || false}
            onChange={handlePromotionsChange}
          />
          <span className="checkbox-text">I would like to receive promotional emails</span>
        </label>
      </div>
    </section>
  );
}

export default RequiredInfoSection;
