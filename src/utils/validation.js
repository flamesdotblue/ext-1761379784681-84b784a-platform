export function validateEmail(value) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
}

export function validatePassword(value) {
  // Minimum 8 chars, one letter, one number
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'<>?,.\/]{8,}$/.test(value);
}

export function validateRequired(value) {
  return typeof value === 'string' ? value.trim().length > 0 : !!value;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
}
