/** Normalize copied email formatting before limiting digits. Never submit here. */
export function normalizeVerificationCode(value: string): string {
  return value.replace(/[^0-9]/g, '').slice(0, 6);
}
