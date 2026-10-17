# Amie's website with the shared Rella booking backend

This branch is based on `amie-website-edits` at 04bf2d1. The copied service menu and external handoff have been replaced with the shared booking service. Page files, global styles, images, policy copy and deposit configuration are unchanged. Existing modal, treatment, review, visit-summary and date/time layout class strings match Amie's baseline. The final step adds secure booking functionality within the existing visual system.

## Correct data source

The first local demonstration accidentally used a tiny two-service fixture. It has been disconnected and its process/file removed. The running localhost:3001 site now points to the real local booking backend, using server-only existing Boulevard credentials.

`GET /api/booking-v2/bridge/menu?location=...` retrieves the location menu from the backend's GET menu route. That uses Rella HQ's proven Client API `createCart -> availableCategories` source with an empty metadata cart and brief server cache. Browsing does not create an application booking-session row, select a service, hold time, or make a payment. Admin active/bookable context alone is not public online visibility, and Admin defaults are not patient-facing prices.

Real API verification on 2026-10-16: Napa 120 service entries; Vacaville 96. Established Patient Tox and Deluxe Hydrafacial are present in both. Neither current menu has a required option group. Weight Loss stays on its separate host; Hyperhidrosis remains excluded per prior owner direction. Boulevard itself currently exposes Archived Services/historical-event/special categories; review those source configurations before public launch.

The browser menu and search were verified at both locations. The same-clinic navigation bug is fixed: returning to Location and selecting the same clinic retains its loaded menu. A loading message replaces the misleading empty-search message while the live catalog arrives.

## Booking session

A POST starts the real booking session only when proceeding to provider selection. The bridge strips caller cart identity and forwards the HttpOnly session plus bounded attribution/consent/anonymous visitor cookies. Credentials stay on the booking host. Actual dates/times, reservation, opaque vault-token attachment, checkout and durable confirmation use the existing booking engine. Same treatment/provider navigation reuses its cart safely; changing provider or returning after a known successful hold starts a fresh selection. Uncertain mutations are not replayed. Pending verification does not display confirmed.

The backend origin defaults to `https://book.experiencerella.com`; `RELLA_BOOKING_BACKEND_ORIGIN` may pin the approved paired backend preview, or localhost outside production. Requires backend draft #67 and `BOOKING_V2_FULL_MENU_ENABLED=1`. For isolated card fields, set the backend's `BOOKING_V2_MARKETING_ORIGIN` to the exact website HTTPS preview origin. No production environment or launch change was made here.

## Remaining launch evidence

- Actual service/provider/date/hold/payment/checkout/durable-confirmation behavior in an approved sandbox or supervised test at both locations. Earlier all-six-step browser completion used a fixture only; it is not evidence of a real appointment.
- The deposit chat's live policy/amount/credit reconciliation, plus attribution and consent continuity.
- Source review of categories Boulevard still exposes as online, including Archived Services and historical events.
- Required options are rejected safely if later added; the original design does not collect optional extras/multi-service combinations.

Tests, TypeScript, targeted booking ESLint and both production builds pass. Full-repository ESLint has a pre-existing unrelated Header.tsx:39 effect error; that design file is untouched.

Paired drafts: website https://github.com/zwagner19/rella-aesthetics/pull/42 and backend https://github.com/zwagner19/rella-booking/pull/67. Neither is merged or publicly enabled.
