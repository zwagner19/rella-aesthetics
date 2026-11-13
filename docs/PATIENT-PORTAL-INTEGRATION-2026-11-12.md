# Patient dashboard integration checkpoint

Built as a gated preview, not a public patient launch. `/patient-portal` contains the email/SMS sign-in controller and authenticated dashboard data path. `/patient-portal/preview` retains clearly labelled example data. Production remains unpublished; its last unauthenticated server probe returned an edge 403, not a fresh application-level 404 verification. The main website/header/footer/design, booking and deposits are unchanged.

The sign-in controller supports challenge/code, verified profile selection, authenticated dashboard, expiry, sign-out and explicit unavailable/verification-required states. No fixture fallback on a real read. Patient data is cleared on tab hiding, page departure, logout and expiry; restored pages revalidate. No patient identity or tokens in browser storage. The existing analytics route allowlist excludes all patient routes. Response headers prohibit caching and indexing.

The backend-for-frontend forwards only the patient cookie to the dedicated backend, rejects foreign origins and caller-supplied account IDs, strips unrelated cookies, hashes trusted edge IP data and guards the return cookie. It requires a fixed approved backend origin and a separate server-only bridge secret.

## Dedicated frontend environment names
- `PATIENT_PORTAL_PILOT_ENABLED`: true only on the dedicated private owner-pilot branch preview; production stays disabled.
- `PATIENT_PORTAL_PUBLIC_ORIGIN`: exact frontend origin; no wildcard/Host-derived trust.
- `PATIENT_PORTAL_API_ORIGIN`: exact approved booking backend origin (server only).
- `PATIENT_PORTAL_BRIDGE_SECRET`: dedicated shared backend bridge secret (server only).

No native Boulevard or Supabase credential belongs in the frontend. No production environment changes were made.

Backend source: sibling `rella-patient-api`, branch `codex/patient-dashboard-api-20261112`. See its `docs/PATIENT-DASHBOARD-INTEGRATION-2026-11-12.md` for the app manifest, migration, auth limitations, exact release gates and environment names.

## Checks — updated November 13 UTC
30 frontend tests, scoped ESLint and TypeScript pass. Backend has 59 focused tests. The actual component in a local mocked browser accepts a spaced six-digit paste (including leading zero), resumes code and profile selection after refresh, requires a choice, opens the selected mock dashboard and signs out. These are synthetic fixtures. The response contract also accepts native Concluded memberships while rejecting unknown states and locations.

The owner subsequently entered a native code, saw profile choices, selected his own profile and opened the real dashboard. Native ownership checks and appointment reads passed after the Staff.displayName query correction. Membership and voucher reads returned successful empty collections for that profile. Native logout and refresh-denied access passed. No code was read or entered by the agent. Populated benefits and a DOB-required native case still need separate verification; no fabricated records or Admin identity delegation are permitted.

UI uses existing form/radio/button styles with no CSS, layout or brand changes. Code and profile state survive refresh and email tab switching; selections are never persisted in browser storage. No clinical collection is read before profile selection. Public launch still requires rebasing onto the chosen current production release before review.
