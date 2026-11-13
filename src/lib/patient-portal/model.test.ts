import { describe, expect, it } from 'vitest';
import { assertAccountBinding, appointmentTime, EMPTY_DASHBOARD, UNAVAILABLE_DASHBOARD } from './model';
import { isApprovedAestheticsPage } from '../aesthetics-attribution';

describe('patient account boundary', () => {
  const identity = { clientId: 'example-client', businessId: 'example-business', verified: true as const, expiresAt: 2000 };
  const source = { clientId: 'example-client', businessId: 'example-business' };
  it('accepts only a current verified session bound to the same business and client', () => {
    expect(() => assertAccountBinding(identity, source, 1000)).not.toThrow();
    expect(() => assertAccountBinding(null, source, 1000)).toThrow('patient_session_required');
    expect(() => assertAccountBinding(identity, source, 2000)).toThrow('patient_session_required');
    expect(() => assertAccountBinding(identity, { ...source, clientId: 'another-client' }, 1000)).toThrow('patient_session_required');
    expect(() => assertAccountBinding(identity, { ...source, businessId: 'another-business' }, 1000)).toThrow('patient_session_required');
    expect(() => assertAccountBinding({ ...identity, expiresAt: Number.NaN }, source, 1000)).toThrow('patient_session_required');
  });
  it('keeps failed fetches distinct from empty accounts', () => {
    expect(EMPTY_DASHBOARD.vouchers).toEqual({ status: 'ready', items: [] });
    expect(UNAVAILABLE_DASHBOARD.vouchers).toEqual({ status: 'unavailable' });
    expect('items' in UNAVAILABLE_DASHBOARD.vouchers).toBe(false);
  });
  it('uses clinic timezone independent of the browser timezone', () => {
    expect(appointmentTime('2026-11-18T18:30:00Z')).toContain('10:30 AM PST');
    expect(appointmentTime('2026-07-18T17:30:00Z')).toContain('10:30 AM PDT');
  });
  it('never opts the portal into public analytics, attribution or heatmapping', () => {
    for (const host of ['experiencerella.com', 'www.experiencerella.com']) {
      for (const route of ['/patient-portal', '/patient-portal/', '/patient-portal/appointments']) {
        expect(isApprovedAestheticsPage(host, route)).toBe(false);
      }
    }
  });
});
