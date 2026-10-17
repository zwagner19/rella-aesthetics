# Amie's website with the shared Rella booking backend

This branch is based on `amie-website-edits` at 04bf2d1. It replaces the copied marketing service menu and external booking handoff with the shared backend. Page files, global styles, brand assets, policy copy, and deposit configuration are unchanged. Existing modal, menu, review and visit-summary layout class strings match the baseline. The final step gains secure booking functionality in the existing visual system.

The browser calls the same-origin `/api/booking-v2/bridge/*`; the server calls the booking host. The default backend origin is `https://book.experiencerella.com`. `RELLA_BOOKING_BACKEND_ORIGIN` may pin an approved Rella booking preview; localhost is accepted only outside production. Credentials stay on the booking host. HttpOnly session identity and limited attribution/consent cookies are forwarded; arbitrary cookies and caller cart identity are excluded. The API menu determines clinic service availability; images and CTA aliases remain presentation metadata only.

The bridge requires the paired `rella-booking` branch `codex/shared-booking-catalog` and its explicit `BOOKING_V2_FULL_MENU_ENABLED=1` gate. Deploy/review that backend before switching this website. Set the backend's `BOOKING_V2_MARKETING_ORIGIN` to the exact HTTPS website preview origin for the isolated card frame. No production enablement is performed by this branch.

The existing finalizer owns confirmation: only CONFIRMED produces confirmed UI, PENDING_VERIFICATION produces a pending message. Reserve failures stop progression. Re-entering availability clears old date/slot/quote so a newly created cart cannot use a stale reservation. Session-changing requests serialize; card fields live on the booking origin and return only an opaque vault token.

## Remaining release evidence

- Real Boulevard sandbox or supervised verification at both locations (including card/deposit and no-card cases, named staff, time zones, timeout, duplicate submission and attribution).
- Services with required Boulevard option groups currently stop with `options_required`; resolve before declaring full menu parity. Multi-service combinations and optional extras are not collected by the original design.
- The deposit chat must reconcile its policy with live Boulevard amounts, including package redemption. This branch does not set deposit policy or change policy copy.
- Desktop/mobile design signoff including the functional card fields.

Validation: 327 website tests passed; production build and TypeScript passed. Changed booking files pass targeted ESLint. Full-repository ESLint has an existing unrelated `set-state-in-effect` error in `src/components/layout/Header.tsx:39`; that design file is untouched. Browser exercised six steps through an in-page confirmation using a local-only fixture (no actual appointment, card, payment or database write). This evidence proves local integration, not production readiness.
