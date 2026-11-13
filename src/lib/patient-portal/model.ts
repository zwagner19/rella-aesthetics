/** Display-only contract. Never infer an empty account from an unavailable source. */
export type LoadState<T> =
  | { status: 'ready'; items: T[] }
  | { status: 'unavailable' };
export type Clinic = 'Napa' | 'Vacaville';
export type Appointment = {
  key: string; service: string; clinic: Clinic; provider: string;
  startsAt: string; status: 'upcoming' | 'completed' | 'cancelled' | 'past';
};
export type Membership = {
  key: string; name: string; status: 'Active' | 'Paused' | 'Cancelled' | 'Past due';
  nextPayment: string | null; agreementAvailable: boolean;
};
export type Voucher = {
  key: string; title: string; remaining: number;
  eligibleClinics: Clinic[]; expiresOn: string | null;
};
export type Dashboard = {
  appointments: LoadState<Appointment>;
  memberships: LoadState<Membership>;
  vouchers: LoadState<Voucher>;
};
export type VerifiedIdentity = {
  clientId: string; businessId: string; verified: true; expiresAt: number;
};
/** Future server adapter boundary: IDs come from a verified server session, never request input.
 * This is not a production authentication implementation or a substitute for native scope checks. */
export function assertAccountBinding(
  identity: VerifiedIdentity | null,
  source: { clientId: string; businessId: string },
  now = Date.now(),
): void {
  if (!identity || identity.verified !== true || !identity.clientId || !identity.businessId
      || !Number.isFinite(identity.expiresAt) || identity.expiresAt <= now
      || source.clientId !== identity.clientId || source.businessId !== identity.businessId) {
    throw new Error('patient_session_required');
  }
}
export function appointmentTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  }).format(new Date(iso));
}
export const PORTAL_LOGIN = 'https://blvd.app/@experiencerella/login';
export const PORTAL_MEMBERSHIPS = 'https://blvd.app/@experiencerella/memberships';
export const BOOKING_URL = 'https://book.experiencerella.com/book';

/** Fictitious, clearly labelled review data only. No patient records or real bookings. */
export const EXAMPLE_DASHBOARD: Dashboard = {
  appointments: { status: 'ready', items: [
    { key: 'example-next', service: 'HydraFacial', clinic: 'Napa', provider: 'Natalie', startsAt: '2026-11-18T18:30:00Z', status: 'upcoming' },
    { key: 'example-history', service: 'Consultation', clinic: 'Vacaville', provider: 'Example provider', startsAt: '2026-10-16T21:00:00Z', status: 'completed' },
    { key: 'example-cancelled', service: 'Consultation', clinic: 'Napa', provider: 'Example provider', startsAt: '2026-10-09T20:00:00Z', status: 'cancelled' },
  ] },
  memberships: { status: 'ready', items: [
    { key: 'example-membership', name: 'Example membership', status: 'Active', nextPayment: null, agreementAvailable: false },
  ] },
  vouchers: { status: 'ready', items: [
    { key: 'example-benefit', title: 'Example facial benefit', remaining: 1, eligibleClinics: ['Napa'], expiresOn: null },
  ] },
};
export const EMPTY_DASHBOARD: Dashboard = {
  appointments: { status: 'ready', items: [] }, memberships: { status: 'ready', items: [] }, vouchers: { status: 'ready', items: [] },
};
export const UNAVAILABLE_DASHBOARD: Dashboard = {
  appointments: { status: 'unavailable' }, memberships: { status: 'unavailable' }, vouchers: { status: 'unavailable' },
};
