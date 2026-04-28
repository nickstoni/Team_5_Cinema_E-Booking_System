const CARD_NUMBER_REGEX = /^\d{12,19}$/;
const CVV_REGEX = /^\d{3,4}$/;

export function hasAnyCardValue(card = {}) {
  return Boolean(
    card.cardType ||
      card.cardNumber ||
      card.cardHolderName ||
      card.expiryMonth ||
      card.expiryYear ||
      card.cvv
  );
}

export function normalizeCardDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

export function validatePaymentCard(card = {}, options = {}) {
  const { requireCardType = true } = options;

  const cardType = String(card.cardType || '').trim();
  const cardNumber = normalizeCardDigits(card.cardNumber);
  const cardHolderName = String(card.cardHolderName || '').trim();
  const expiryMonth = String(card.expiryMonth || '').trim();
  const expiryYear = String(card.expiryYear || '').trim();
  const cvv = normalizeCardDigits(card.cvv);

  if (requireCardType && !cardType) {
    return 'Select a card type.';
  }

  if (!cardHolderName) {
    return 'Card holder name is required.';
  }

  if (!CARD_NUMBER_REGEX.test(cardNumber)) {
    return 'Enter a valid card number (12-19 digits).';
  }

  if (!/^\d{2}$/.test(expiryMonth) || Number(expiryMonth) < 1 || Number(expiryMonth) > 12) {
    return 'Enter a valid expiry month (MM).';
  }

  if (!/^\d{4}$/.test(expiryYear)) {
    return 'Enter a valid expiry year (YYYY).';
  }

  if (!CVV_REGEX.test(cvv)) {
    return 'Enter a valid CVV (3 or 4 digits).';
  }

  return '';
}
