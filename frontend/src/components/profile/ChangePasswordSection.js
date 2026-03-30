import React, { useState } from 'react';
import '../../styles/profile/ChangePasswordSection.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function ChangePasswordSection({ userId, onSuccess }) {
  const [formOpen, setFormOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validatePasswords = () => {
    if (!passwords.currentPassword.trim()) {
      setError('Current password is required');
      return false;
    }
    if (!passwords.newPassword.trim()) {
      setError('New password is required');
      return false;
    }
    if (!passwords.confirmPassword.trim()) {
      setError('Password confirmation is required');
      return false;
    }
    if (passwords.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return false;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/change-password/${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
            confirmPassword: passwords.confirmPassword
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setFormOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="change-password-section">
      <div className="section-header">
        <h3>Security</h3>
        {!formOpen && (
          <button
            className="btn-toggle"
            onClick={() => setFormOpen(true)}
            type="button"
          >
            Change Password
          </button>
        )}
      </div>

      {formOpen && (
        <form className="change-password-form" onSubmit={handleSubmit}>
          <p className="form-description">
            For security purposes, enter your current password to change your password.
          </p>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              Current Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              className="form-input"
              placeholder="Enter your current password"
              value={passwords.currentPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="form-input"
              placeholder="Enter a new password (min. 6 characters)"
              value={passwords.newPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              placeholder="Confirm your new password"
              value={passwords.confirmPassword}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setFormOpen(false);
                setPasswords({
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
                setError('');
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default ChangePasswordSection;
