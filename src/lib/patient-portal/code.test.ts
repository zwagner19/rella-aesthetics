import { describe, expect, it } from 'vitest';
import { normalizeVerificationCode } from './code';

describe('verification code input', () => {
  it.each(['123456', '123 456', '123-456', ' 123456\n', '\u200e123\u00a0456\u200f'])('keeps all six digits from copied formatting: %j', value => {
    expect(normalizeVerificationCode(value)).toBe('123456');
  });
  it('keeps leading zeroes and caps the normalized digits', () => {
    expect(normalizeVerificationCode('012 345')).toBe('012345');
    expect(normalizeVerificationCode('1234567')).toBe('123456');
  });
});
