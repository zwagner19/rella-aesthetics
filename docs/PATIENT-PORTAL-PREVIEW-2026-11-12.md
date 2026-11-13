# My Rella patient dashboard — review preview

Date: November 12, 2026

## Verified state

Interactive preview: https://rella-aesthetics-n6a424u5a-zwagner19s-projects.vercel.app/patient-portal

This is a deployed **preview with fictitious example data**, not a production patient portal. Patient sign-in and live Boulevard records are not connected. Do not describe the display contract or its unit tests as an authentication implementation. No patient data was read or uploaded. No code was sent to a patient. No appointment, payment, deposit, membership, or production setting was changed.

Worktree: `work/rella-patient-portal`; branch: `codex/patient-portal-preview-20261112`; base: `cb444e2`. The existing Reserve preview worktree and the separate deposit worktree were preserved.

Vercel deployment: `dpl_FBTDmXdNA8ZftNRnozoTjVms5287`, project `rella-aesthetics`, environment `preview`, state `READY`. Public request without authentication returned 200 and the example dashboard. No production alias was assigned.

## Implemented

- Independent `/patient-portal` route with existing Poppins, logo, ivory, dark text and blush styling. Existing public layouts, navigation and components remain unchanged.
- Overview, upcoming appointments, completed/cancelled history, membership details, treatment vouchers, and a forms/care view linking the existing Boulevard portal.
- Explicit example/empty/unavailable/expired preview states. An unavailable source is never presented as zero benefits or no appointments. Preview sign-out hides the example data; it is not a real sign-out implementation.
- Server route guard returns 404 outside development/preview. No indexing, no sitemap inclusion, private/no-store response headers and no-referrer external links.
- Existing approved-public-route rules exclude the patient route from public analytics, attribution and heatmapping. No real data, browser tokens, auth inputs, storage or API calls were added.

## Validation

- `npm run lint -- --quiet`: passed.
- `npx vitest run src/lib/patient-portal/model.test.ts`: 4 tests passed (account-binding helper, unavailable versus empty, Pacific time, public analytics exclusion).
- `VERCEL_ENV=preview npm run build -- --webpack`: passed, including TypeScript and sitemap generation. Local dependencies were reused through a node_modules symlink after an isolated install ran out of disk space; no dependency or lockfile changes.
- Local built runtime: preview environment returned 200; production environment returned 404 with no dashboard or review banner rendered.
- Hosted runtime: 200; Cache-Control `private, no-cache, no-store, max-age=0, must-revalidate`; Referrer-Policy `no-referrer`; X-Robots-Tag `noindex`; HTML robots `noindex, nofollow, noarchive`.
- Browser: all five tabs, appointment filters, and four preview states verified. Desktop 1569px and 320/390/768px layouts had document width equal to viewport width. Viewport override reset afterward. Hosted page had zero iframes at inspection. Screenshots are under `outputs/rella-patient-portal-2026-11-12/`.
- `git diff --check`: passed.

## Current Boulevard evidence

Authenticated business settings show Rella's existing patient login at https://blvd.app/@experiencerella/login. Its public login offers phone or email verification. Boulevard documents appointments, forms, memberships and treatment vouchers in its existing portal. Shared profiles and secure messaging were on; Custom booking URL was blank. These settings were not changed. The native portal fallback has not been tested through a real patient sign-in in this task.

The booking repository has passwordless email/SMS verification, multiple-profile handling, DOB checks, bounded token sessions, and voucher ownership checks. That implementation uses the legacy 2020-01 Client API. It is a reference for review, not a drop-in authentication service for this dashboard. Its package/deposit sessions must remain separate.

## Required work before real patient access

1. Read current applicable integration repository instructions and handoffs, then verify the installed Boulevard application's exact scoped **2026-06 Client API** permissions and current passwordless/DOB flow. Keep Admin and patient-scoped credentials distinct and server-only. Do not request blanket chart or billing write scopes.
2. Implement a dedicated patient session boundary. Never choose an account by a supplied email or client ID alone. Verify native one-time-code identity and required DOB; resolve multiple/shared profiles safely. Keep tokens server-side in encrypted, revocable, expiring sessions with secure HTTP-only cookies, origin checks, rate limits and redacted logs.
3. Add read-only adapters for the authenticated patient's appointments, memberships and vouchers, with pagination, business/client ownership checks, cancelled-state handling, and the actual benefit expiration/location rules. Preserve unknown/missing data. The `assertAccountBinding` helper is only one defense and is not sufficient on its own.
4. Keep forms, medical records and billing changes in the existing secure Boulevard portal for the first release. Do not expose chart data or introduce new cancellation, deposit, payment or redemption behavior.
5. Test invalid/expired codes, shared contacts, DOB failures, expired sessions, cross-patient requests, unavailable source data, logout/revocation, private caching and analytics exclusion before any real records are displayed. Use test doubles/sandbox first; real owner-account verification requires Zach to enter codes directly, never in chat.
6. Verify the owner-approved patient account end to end and reconcile the displayed records with Boulevard. Only then remove example data and preview controls, decide the final patient route/host, and add the requested patient-entry link. Production publication remains unperformed.

Do not promote this preview deployment as-is. Its server guard deliberately prevents the demonstration becoming a functioning production account page.

## Official references checked November 12

- https://support.boulevard.io/en/articles/8648439-client-portal
- https://developers.joinblvd.com/2026-06/client-api/authentication
- https://developers.joinblvd.com/2026-06/client-api/api-reference/mutations/clientPasswordlessAuthSignIn
- https://developers.joinblvd.com/2026-06/client-api/api-reference/types/RootMutationType
- https://developers.joinblvd.com/2026-06/client-api/api-reference/queries/membership

The installed application's permissions and authenticated patient-data reads are still unverified. Documentation establishes supported platform capabilities, not that this new dashboard is connected.
