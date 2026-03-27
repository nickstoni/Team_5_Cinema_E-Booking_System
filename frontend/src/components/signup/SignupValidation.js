import { ADDRESS_FIELDS } from './SignupConstants';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-()\s]{7,20}$/;
const CARD_NUMBER_REGEX = /^[0-9]{12,19}$/;
const CVV_REGEX = /^[0-9]{3,4}$/;

export function hasAnyAddressValue(formData) {
  return ADDRESS_FIELDS.some((field) => String(formData[field] || '').trim());
}

export function validateSignupForm(formData, cards) {
  if (!formData.fullName.trim()) {
    return 'Full name is required.';
  }

  if (!formData.email.trim()) {
    return 'Email is required.';
  }

  if (!EMAIL_REGEX.test(formData.email.trim())) {
    return 'Please enter a valid email address.';
  }

  if (!formData.phoneNumber.trim()) {
    return 'Phone number is required.';
  }

  if (!PHONE_REGEX.test(formData.phoneNumber.trim())) {
    return 'Please enter a valid phone number.';
  }

  if (!formData.password) {
    return 'Password is required.';
  }

  if (formData.password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  if (formData.password !== formData.confirmPassword) {
    return 'Password and confirm password do not match.';
  }

  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];
    const hasAnyValue =
      card.cardType ||
      card.cardNumber ||
      card.cardHolderName ||
      card.expiryMonth ||
      card.expiryYear ||
      card.cvv;

    if (!hasAnyValue) {
      continue;
    }

    if (!card.cardType) {
      return `Card ${index + 1}: select a card type.`;
    }

    if (!CARD_NUMBER_REGEX.test(card.cardNumber.replace(/\s/g, ''))) {
      return `Card ${index + 1}: card number must be 12 to 19 digits.`;
    }

    if (!card.cardHolderName.trim()) {
      return `Card ${index + 1}: card holder name is required.`;
    }

    if (!card.expiryMonth || !card.expiryYear) {
      return `Card ${index + 1}: select expiry month and year.`;
    }

    if (!CVV_REGEX.test(card.cvv)) {
      return `Card ${index + 1}: CVV must be 3 or 4 digits.`;
    }
  }

  return '';
}
