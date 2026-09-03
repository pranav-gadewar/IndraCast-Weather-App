/**
 * Passcode validation and security utilities
 */

const RESTRICTED_PASSCODES = new Set([
  "123456",
  "654321",
  "000000",
  "111111",
  "222222",
  "333333",
  "444444",
  "555555",
  "666666",
  "777777",
  "888888",
  "999999",
  "012345",
  "543210",
]);

export function isValidPasscode(passcode: string): boolean {
  return /^\d{6}$/.test(passcode);
}

export function isRestrictedPasscode(passcode: string): boolean {
  return RESTRICTED_PASSCODES.has(passcode);
}

export function sanitizePasscode(input: string): string {
  return input.replace(/\D/g, "").slice(0, 6);
}
