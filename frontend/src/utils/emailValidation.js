const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email, fieldLabel = 'Email') {
  const normalizedEmail = String(email || '').trim();

  if (!normalizedEmail) {
    return `${fieldLabel} is required.`;
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return 'Please enter a valid email address.';
  }

  return '';
}
