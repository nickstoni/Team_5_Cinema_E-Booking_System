import { validateEmail } from './emailValidation';
import { validatePhoneNumber } from './phoneValidation';

const PASSWORD_COMPLEXITY_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;

function validateIdentityFields(userData = {}) {
  if (!userData.firstName || !userData.firstName.trim()) {
    return 'First name is required.';
  }

  if (!userData.lastName || !userData.lastName.trim()) {
    return 'Last name is required.';
  }

  const emailError = validateEmail(userData.email);
  if (emailError) {
    return emailError;
  }

  const phoneError = validatePhoneNumber(userData.phoneNumber);
  if (phoneError) {
    return phoneError;
  }

  return '';
}

export function validateStrongPassword(password, fieldLabel = 'Password') {
  const passwordValue = String(password || '');

  if (!passwordValue) {
    return `${fieldLabel} is required.`;
  }

  if (passwordValue.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  if (!PASSWORD_COMPLEXITY_REGEX.test(passwordValue)) {
    return 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
  }

  return '';
}

export function validatePasswordConfirmation(password, confirmPassword, options = {}) {
  const {
    mismatchMessage = 'Password and confirm password do not match.'
  } = options;

  if (String(password || '') !== String(confirmPassword || '')) {
    return mismatchMessage;
  }

  return '';
}

export function validateLoginForm(formData) {
  const emailError = validateEmail(formData.email);
  if (emailError) {
    return emailError;
  }

  if (!String(formData.password || '')) {
    return 'Password is required.';
  }

  return '';
}

export function validateProfileUserForm(userData) {
  return validateIdentityFields(userData);
}

export function validateSignupAuthForm(formData = {}) {
  const identityError = validateIdentityFields(formData);
  if (identityError) {
    return identityError;
  }

  const passwordError = validateStrongPassword(formData.password);
  if (passwordError) {
    return passwordError;
  }

  const confirmationError = validatePasswordConfirmation(formData.password, formData.confirmPassword);
  if (confirmationError) {
    return confirmationError;
  }

  return '';
}

export function validateResetPasswordForm(password, confirmPassword) {
  const passwordError = validateStrongPassword(password);
  if (passwordError) {
    return passwordError;
  }

  const confirmationError = validatePasswordConfirmation(password, confirmPassword);
  if (confirmationError) {
    return confirmationError;
  }

  return '';
}

export function validateChangePasswordForm(passwords = {}) {
  if (!String(passwords.currentPassword || '').trim()) {
    return 'Current password is required.';
  }

  const passwordError = validateStrongPassword(passwords.newPassword, 'New password');
  if (passwordError) {
    return passwordError;
  }

  if (!String(passwords.confirmPassword || '').trim()) {
    return 'Password confirmation is required.';
  }

  const confirmationError = validatePasswordConfirmation(passwords.newPassword, passwords.confirmPassword);
  if (confirmationError) {
    return confirmationError;
  }

  return '';
}
