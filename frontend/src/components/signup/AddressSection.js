function AddressSection({
  formData = {},
  onInputChange,
  hasAddress,
  onAddAddress,
  onRemoveAddress
}) {
  return (
    <section className="signup-section">
      <div className="section-header-row">
        <h2>Optional Address Information</h2>
        <button
          type="button"
          className="secondary-btn"
          onClick={onAddAddress}
          disabled={hasAddress}
        >
          Add Address ({hasAddress ? '1/1' : '0/1'})
        </button>
      </div>

      {hasAddress && (
        <p className="muted-text">Only one address can be stored.</p>
      )}

      {!hasAddress ? (
        <p className="muted-text">No address added yet.</p>
      ) : (
        <div className="card-box">
          <div className="section-header-row compact">
            <h3>Address 1</h3>
            <button
              type="button"
              className="danger-link"
              onClick={onRemoveAddress}
            >
              Remove
            </button>
          </div>

          <div className="signup-grid two-columns">
            <label className="form-row full-span">
              <span className="form-label">Address Line 1</span>
              <input
                type="text"
                className="form-input"
                name="addressLine1"
                value={formData.addressLine1 || ""}
                onChange={onInputChange}
                autoComplete="address-line1"
                placeholder="Street address"
              />
            </label>

            <label className="form-row full-span">
              <span className="form-label">Address Line 2</span>
              <input
                type="text"
                className="form-input"
                name="addressLine2"
                value={formData.addressLine2 || ""}
                onChange={onInputChange}
                autoComplete="address-line2"
                placeholder="Apartment, suite, etc."
              />
            </label>

            <label className="form-row">
              <span className="form-label">City</span>
              <input
                type="text"
                className="form-input"
                name="city"
                value={formData.city || ""}
                onChange={onInputChange}
                autoComplete="address-level2"
                placeholder="Your City"
              />
            </label>

            <label className="form-row">
              <span className="form-label">State</span>
              <select
                className="form-input"
                name="state"
                value={formData.state || ""}
                onChange={onInputChange}
                autoComplete="address-level1"
              >
                <option value="">Select State</option>
                <option value="AL">AL</option>
                <option value="AK">AK</option>
                <option value="AZ">AZ</option>
                <option value="AR">AR</option>
                <option value="CA">CA</option>
                <option value="CO">CO</option>
                <option value="FL">FL</option>
                <option value="GA">GA</option>
                <option value="IL">IL</option>
                <option value="NY">NY</option>
                <option value="TX">TX</option>
                <option value="WA">WA</option>
              </select>
            </label>

            <label className="form-row">
              <span className="form-label">ZIP Code</span>
              <input
                type="text"
                className="form-input"
                name="postalCode"
                value={formData.postalCode || ""}
                onChange={onInputChange}
                autoComplete="postal-code"
                placeholder="32801"
              />
            </label>

            <label className="form-row">
              <span className="form-label">Country</span>
              <select
                className="form-input"
                name="country"
                value={formData.country || ""}
                onChange={onInputChange}
                autoComplete="country-name"
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="MX">Mexico</option>
                <option value="UK">United Kingdom</option>
              </select>
            </label>
          </div>
        </div>
      )}
    </section>
  );
}

export default AddressSection;