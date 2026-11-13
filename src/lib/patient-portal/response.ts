import type { Dashboard } from './model';
function object(value: unknown): Record<string, unknown> { if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('unavailable'); return value as Record<string, unknown>; }
function text(value: unknown, nullable = false) { if (nullable && value === null) return; if (typeof value !== 'string' || !value || value.length > 2000) throw new Error('unavailable'); }
function date(value: unknown, nullable = false) { if (nullable && value === null) return; text(value); if (!Number.isFinite(Date.parse(value as string))) throw new Error('unavailable'); }
export function parseDashboard(value: unknown): { dashboard: Dashboard; expiresAt: number } {
  const result = object(value), dashboard = object(result.dashboard);
  if (typeof result.expiresAt !== 'number' || result.expiresAt <= Date.now() || result.expiresAt > Date.now() + 31 * 60_000) throw new Error('unavailable');
  for (const name of ['appointments', 'memberships', 'vouchers']) {
    const state = object(dashboard[name]);
    if (state.status === 'unavailable') continue;
    if (state.status !== 'ready' || !Array.isArray(state.items) || state.items.length > 500) throw new Error('unavailable');
    const keys = new Set();
    for (const entry of state.items) {
      const item = object(entry); text(item.key); if (keys.has(item.key)) throw new Error('unavailable'); keys.add(item.key);
      if (name === 'appointments') {
        text(item.service); text(item.provider); date(item.startsAt);
        if (!['Napa', 'Vacaville'].includes(String(item.clinic)) || !['upcoming', 'completed', 'cancelled', 'past'].includes(String(item.status))) throw new Error('unavailable');
      } else if (name === 'memberships') {
        text(item.name); date(item.nextPayment, true);
        if (!['Active', 'Paused', 'Cancelled', 'Past due', 'Concluded'].includes(String(item.status)) || typeof item.agreementAvailable !== 'boolean') throw new Error('unavailable');
      } else {
        text(item.title); date(item.expiresOn, true);
        if (!Number.isInteger(item.remaining) || (item.remaining as number) < 0 || !Array.isArray(item.eligibleClinics) || item.eligibleClinics.some(c => !['Napa', 'Vacaville'].includes(c))) throw new Error('unavailable');
      }
    }
  }
  return { dashboard: dashboard as Dashboard, expiresAt: result.expiresAt };
}

export type ProfileChoice = { key: string; label: string };
export function parseSession(value: unknown): { state: 'code_required' | 'profile_required' | 'authenticated'; expiresAt: number; profiles: ProfileChoice[] } {
  const result = object(value);
  if (!['code_required', 'profile_required', 'authenticated'].includes(String(result.state)) || typeof result.expiresAt !== 'number'
    || result.expiresAt <= Date.now() || result.expiresAt > Date.now() + (result.state === 'authenticated' ? 31 : 11) * 60_000) throw new Error('unavailable');
  const profiles: ProfileChoice[] = [];
  if (result.state === 'profile_required') {
    if (!Array.isArray(result.profiles) || result.profiles.length < 2 || result.profiles.length > 8) throw new Error('unavailable');
    for (const entry of result.profiles) {
      const p = object(entry);
      if (Object.keys(p).some(k => !['key', 'label'].includes(k)) || typeof p.key !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(p.key)
        || profiles.some(x => x.key === p.key) || typeof p.label !== 'string' || !p.label.trim() || p.label.length > 180 || /[\u0000-\u001f]/.test(p.label)) throw new Error('unavailable');
      profiles.push({ key: p.key, label: p.label });
    }
  }
  return { state: result.state as 'code_required' | 'profile_required' | 'authenticated', expiresAt: result.expiresAt, profiles };
}
