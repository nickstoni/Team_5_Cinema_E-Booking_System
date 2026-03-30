export const API_BASE_URL = 'http://localhost:8080';
export const MAX_PAYMENT_CARDS = 3;

export const EMPTY_FORM_DATA = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  promotionsEnabled: false,
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: ''
};

export const ADDRESS_FIELDS = [
  'addressLine1',
  'addressLine2',
  'city',
  'state',
  'postalCode',
  'country'
];

export function createEmptyCard() {
  return {
    cardType: '',
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  };
}

export function getExpiryYears(startYear = new Date().getFullYear(), numberOfYears = 15) {
  return Array.from({ length: numberOfYears }, (_, index) => String(startYear + index));
}
