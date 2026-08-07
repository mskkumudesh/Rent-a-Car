// Simple, permissive email check — good enough to catch obvious typos
// ("bob@gmail" or "bob gmail.com") without being overly strict about edge
// cases real email addresses can technically have.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

export const MIN_PASSWORD_LENGTH = 6;

export function isValidPassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}
