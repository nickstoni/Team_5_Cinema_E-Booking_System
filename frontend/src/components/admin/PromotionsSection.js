function PromotionsSection({
  promotions = [],
  promoForm,
  formErrors,
  showAddPromo,
  submitting,
  onToggleAddPromo,
  onPromoFormChange,
  onSubmit,
  onSendPromoEmail
}) {
  return (
    <div className="promotions-section">
      <div className="section-header">
        <h2>Promotions Management</h2>
        <button className="btn-primary" onClick={onToggleAddPromo}>
          {showAddPromo ? 'Cancel' : '+ Create Promotion'}
        </button>
      </div>

      {showAddPromo && (
        <form className="admin-form" onSubmit={onSubmit} noValidate>
          <h3>Create Promotion</h3>
          <div className="form-grid">
            <FormField label="Promo Code *" error={formErrors.promoCode}>
              <input
                value={promoForm.promoCode}
                onChange={e => onPromoFormChange('promoCode', e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER20"
                maxLength={50}
              />
            </FormField>

            <FormField label="Discount % *" error={formErrors.discountPercent}>
              <input
                type="number"
                min="1"
                max="100"
                step="0.01"
                value={promoForm.discountPercent}
                onChange={e => onPromoFormChange('discountPercent', e.target.value)}
                placeholder="e.g. 20"
              />
            </FormField>

            <FormField label="Start Date *" error={formErrors.startDate}>
              <input
                type="date"
                value={promoForm.startDate}
                onChange={e => onPromoFormChange('startDate', e.target.value)}
              />
            </FormField>

            <FormField label="End Date *" error={formErrors.endDate}>
              <input
                type="date"
                value={promoForm.endDate}
                min={promoForm.startDate || undefined}
                onChange={e => onPromoFormChange('endDate', e.target.value)}
              />
            </FormField>

            <FormField label="Active">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={promoForm.isActive}
                  onChange={e => onPromoFormChange('isActive', e.target.checked)}
                />
                <span>{promoForm.isActive ? 'Active' : 'Inactive'}</span>
              </label>
            </FormField>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Promotion'}
            </button>
            <button type="button" className="cancel-btn" onClick={onToggleAddPromo}>
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
                  <button
                    className="action-btn send-email"
                    onClick={() => onSendPromoEmail(p.promoId, p.promoCode)}
                  >
                    Send Email
                  </button>
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

export default PromotionsSection;
