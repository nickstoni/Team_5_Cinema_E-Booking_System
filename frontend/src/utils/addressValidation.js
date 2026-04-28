const ADDRESS_FIELDS = [
  'addressLine1',
  'addressLine2',
  'city',
  'state',
  'postalCode',
  'country'
];

export function hasAnyAddressValue(formData = {}) {
  return ADDRESS_FIELDS.some((field) => String(formData[field] || '').trim());
}
