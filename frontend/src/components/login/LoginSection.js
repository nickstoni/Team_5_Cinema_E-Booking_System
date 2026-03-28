function LoginSection({formData, onInputChange}) {
  return (
    <div className="login-section">
      <h2>Enter Login Details</h2>
      <label className="form-row full-span">
          <span className="form-label">Email Address</span>
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
          <span className="form-label">Password</span>
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
    </div>
  );
}

export default LoginSection;