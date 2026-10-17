# Amie's website with the shared Rella booking backend

This branch is based on `amie-website-edits` at 04bf2d1. The copied service menu and external handoff have been replaced with the shared booking service. Page files, global styles, images, policy copy and deposit configuration are unchanged. The existing visual system is preserved; owner-requested selection feedback adds a highlighted card and a selected-treatment summary above the existing footer actions. The final step adds secure booking functionality within the existing visual system.

## Correct data source

The first local demonstration accidentally used a tiny two-service fixture. It has been disconnected and its process/file removed. The running localhost:3001 site now points to the real local booking backend, using server-only existing Boulevard credentials.

`GET /api/booking-v2/bridge/menu?location=...` retrieves the location menu from the backend's GET menu route. That uses Rella HQ's proven Client API `createCart -> availableCategories` source with an empty metadata cart and brief server cache. Browsing does not create an application booking-session row, select a service, hold time, or make a payment. Admin active/bookable context alone is not public online visibility, and Admin defaults are not patient-facing prices.

Real API verification on 2026-10-16 returned 120 Napa and 96 Vacaville service entries before Amie's requested exclusions. Established Patient Tox and Deluxe Hydrafacial are present in both. Neither current menu has a required option group. Weight Loss stays on its separate host; Hyperhidrosis remains excluded per prior owner direction. The 2026-10-17 menu review below applies Amie's public-menu exclusions without changing Boulevard's master service records.

The browser menu and search were verified at both locations. The same-clinic navigation bug is fixed: returning to Location and selecting the same clinic retains its loaded menu. A loading message replaces the misleading empty-search message while the live catalog arrives.

## Booking session

A POST starts the real booking session only when proceeding to provider selection. The bridge strips caller cart identity and forwards the HttpOnly session plus bounded attribution/consent/anonymous visitor cookies. Credentials stay on the booking host. Actual dates/times, reservation, opaque vault-token attachment, checkout and durable confirmation use the existing booking engine. Same treatment/provider navigation reuses its cart safely. Before changing a held visit or reopening booking, a known uncompleted hold must be explicitly released and verified before a fresh selection starts. Uncertain release, card-linked changes or checkout outcomes block a fresh cart instead of silently discarding evidence. Uncertain mutations are not replayed; pending verification survives modal reopen and does not display confirmed.

The backend origin defaults to `https://book.experiencerella.com`; `RELLA_BOOKING_BACKEND_ORIGIN` may pin the approved paired backend preview, or localhost outside production. Requires backend draft #67 and `BOOKING_V2_FULL_MENU_ENABLED=1`. For isolated card fields, set the backend's `BOOKING_V2_MARKETING_ORIGIN` to the exact website HTTPS preview origin. No production environment or launch change was made here.

The public HTTPS branch preview uses the paired backend branch alias. Its inherited Supabase URL and service key targeted an older project and failed the existing canonical-project guard at session creation. Branch-scoped Preview configuration now uses the existing verified canonical server credential and URL; the guard and production configuration remain unchanged. A real Napa Deluxe Hydrafacial check reached provider discovery, 31 available dates and six times on the first available date without a hold, client information, payment or checkout.

Treatment descriptions are display-only summaries of about two sentences. Reservation/deposit/cancellation copy is omitted from menu cards and remains on the existing review/payment screens. Service prerequisites from Boulevard are retained as review notes. Neither this copy treatment nor the preview repair changes deposit policy or source catalog configuration.

The interface accepts up to six different treatments in one booking. Add/Remove retains each selection, and the mobile footer shows the complete selected list. Each treatment has its own provider preference. Boulevard evaluates availability for the complete cart; the website does not combine separate searches or infer service sequence from click order. Changing services or provider choices invalidates the previous quote/time/hold, and an expired hold cannot proceed to payment. The final review shows the actual per-service schedule and provider returned after reservation.

## Amie's implementation review — 2026-10-17

Reviewed her website-related iMessages from October 15–16, including the detailed October 16 11:39–11:50 PM menu notes. No message was sent. Requested menu presentation is applied only to services returned for that clinic by Boulevard; IDs, eligibility, prices and deposit policy remain authoritative in the booking engine.

| Suggestion | Implementation |
|---|---|
| Group the menu instead of alphabetizing all treatments | Retain category grouping and native ordering, with the laser order below. |
| Remove inconsistent treatment photos | Remove photos from booking-menu rows; page images and global assets remain unchanged. |
| Swap PRP Injection and Hylenex | Place PRP Injection before Hylenex where both are offered. |
| Reorder lasers | Initial consult, CoolPeel, Deka, CO2 resurfacing, existing add-ons, spot treatment, follow-up, IPL, BodyTone, BodySculp, vaginal rejuvenation, laser hair removal, remaining services, shaving fee. |
| Rename generic CO2 resurfacing | Show the existing Napa service as Phoenix CO2 Skin Resurfacing using the same underlying service ID. The proposed master-record rename in Boulevard is not published by this branch. |
| Give packages their own section | Group existing bookable laser, hair-removal and microneedling packages in Packages; do not create prepaid purchases or invent new offerings. |
| Drop Erbium; hide Private Events, Archived and BottleRock | Enforce exclusions in both the menu response and server-side selection validation. The audited menus contain 77 Napa and 66 Vacaville entries, including 10 and 6 package entries respectively. |
| BYOP consultation with a nurse, $100, for a 9–12 month plan | Proposed service setup remains a decision item: no corresponding bookable service was returned by either clinic's current menu. No service, fee, deposit or provider entitlement was invented. |

## Remaining launch evidence

- Service/provider/date coverage at both locations and hold/payment/checkout/durable-confirmation behavior in an approved sandbox or supervised test. The Napa availability check above does not establish payment or appointment completion; earlier all-six-step browser completion used a fixture only.
- The deposit chat's live policy/amount/credit reconciliation, plus attribution and consent continuity.
- Boulevard's master records may still expose categories that this preview excludes at the public API boundary; source cleanup can be performed separately.
- Required options are rejected safely if later added; the original design does not collect optional extras.

Tests, TypeScript, targeted booking ESLint and both production builds pass. Full-repository ESLint has a pre-existing unrelated Header.tsx:39 effect error; that design file is untouched.

Paired drafts: website https://github.com/zwagner19/rella-aesthetics/pull/42 and backend https://github.com/zwagner19/rella-booking/pull/67. Both have public test previews; neither is merged or launched on the production website.
