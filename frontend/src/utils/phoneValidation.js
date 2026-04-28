const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/;

export function validatePhoneNumber(phoneNumber, fieldLabel = 'Phone number') {
  const normalizedPhone = String(phoneNumber || '').trim();

  if (!normalizedPhone) {
    return `${fieldLabel} is required.`;
  }

  if (!PHONE_REGEX.test(normalizedPhone)) {
    return 'Please enter a valid phone number.';
  }

  return '';
}
