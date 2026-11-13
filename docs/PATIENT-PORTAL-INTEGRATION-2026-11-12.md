# Patient dashboard integration checkpoint

Built as a gated preview, not a public patient launch. `/patient-portal` now contains the email/SMS sign-in controller and authenticated dashboard data path. `/patient-portal/preview` retains clearly labelled example data. Production continues returning 404 for both pages. The main website/header/footer/design, booking and deposits are unchanged.

The sign-in controller supports challenge/code, authenticated dashboard, expiry, sign-out and explicit unavailable/verification-required states. No fixture fallback on a real read. Patient data is cleared on tab hiding, page departure, logout and expiry; restored pages revalidate. No patient identity or tokens in browser storage. The existing analytics route allowlist excludes all patient routes. Response headers prohibit caching and indexing.

The backend-for-frontend forwards only the patient cookie to the dedicated backend, rejects foreign origins and caller-supplied account IDs, strips unrelated cookies, hashes trusted edge IP data and guards the return cookie. It requires a fixed approved backend origin and a separate server-only bridge secret.

## Dedicated frontend environment names
- `PATIENT_PORTAL_PILOT_ENABLED`: stays false for review preview.
- `PATIENT_PORTAL_PUBLIC_ORIGIN`: exact frontend origin; no wildcard/Host-derived trust.
- `PATIENT_PORTAL_API_ORIGIN`: exact approved booking backend origin (server only).
- `PATIENT_PORTAL_BRIDGE_SECRET`: dedicated shared backend bridge secret (server only).

No native Boulevard or Supabase credential belongs in the frontend. No production environment changes were made.

Backend source: sibling `rella-patient-api`, branch `codex/patient-dashboard-api-20261112`. See its `docs/PATIENT-DASHBOARD-INTEGRATION-2026-11-12.md` for the app manifest, migration, auth limitations, exact release gates and environment names.

## Checks
15 frontend tests passed, scoped lint passed, TypeScript and webpack production build passed. Backend has 24 additional tests. Browser review: desktop sign-in and 390px mobile sign-in/dashboard, appointment tabs and unavailable state, no horizontal overflow, no analytics iframe, noindex metadata. Existing booking and native portal links retained. Real patient sign-in, real SQL permissions/races, upstream token/DOB verification and owner account reconciliation remain blocked by developer access/setup. These tests do not prove a connected production dashboard.
