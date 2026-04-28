import {
  validateSignupAuthForm
} from './authValidation';
import { hasAnyCardValue, normalizeCardDigits, validatePaymentCard } from './paymentCardValidation';

export function validateSignupForm(formData, cards) {
  const signupAuthError = validateSignupAuthForm(formData);
  if (signupAuthError) {
    return signupAuthError;
  }

  for (let index = 0; index < cards.length; index += 1) {
    const card = cards[index];
    if (!hasAnyCardValue(card)) {
      continue;
    }

    const cardError = validatePaymentCard({
      ...card,
      cardNumber: normalizeCardDigits(card.cardNumber),
      cvv: normalizeCardDigits(card.cvv)
    }, { requireCardType: true });

    if (cardError) {
      return `Card ${index + 1}: ${cardError}`;
    }
  }

  return '';
}
