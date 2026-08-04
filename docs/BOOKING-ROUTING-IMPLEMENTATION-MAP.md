# Booking-CTA Routing — audit + implementation map (Large Sprint 06, Workstream D)

Single source of truth: `src/lib/booking-routes.ts` (`resolveBookingHref`), proven by
`src/lib/booking-routes.test.ts` (Vacaville + generic CTAs can never reach the Napa Tox app; only an
explicit Napa Tox/Botox intent does). Targets:

- Napa New Patient Tox / Botox → `https://book.experiencerella.com/book/napa/botox` (canonical hardened app)
- Napa other verified services (HydraFacial, filler, laser, hyperhidrosis consult) → verified Boulevard path
- Napa, unspecified service → Napa-scoped Boulevard widget (not Tox)
- Vacaville (any) → Vacaville-scoped Boulevard widget (never Napa Tox)
- Generic / no location → business-level Boulevard widget (never silently Napa Tox)

## CTA audit + status
| Surface | Was | Now | Notes |
|---|---|---|---|
| `locations/napa/page.tsx` "Book at Napa" | `/booking` | `resolveBookingHref({location:"napa"})` → Napa widget | ✅ rewired. Design pass: add a dedicated "Book New Patient Tox" CTA → canonical app. |
| `locations/vacaville/page.tsx` "Book at Vacaville" | `/booking` | `resolveBookingHref({location:"vacaville"})` → Vacaville widget | ✅ rewired. Never routes to Napa Tox. |
| `services/[slug]/page.tsx` | `/booking?service=slug` | on-page Vacaville/Napa chooser, then `resolveBookingHref({location,service})` | ✅ location-first. Four rendered booking actions resolve to exactly two clinic destinations; no generic widget. |
| `components/blocks/BookingCta.tsx` | `/booking?service=slug` | `resolveBookingHref({location?,service})` + optional `location` prop | ✅ rewired (shared component). |
| `components/layout/Header.tsx`, `MobileNav.tsx`, `Footer.tsx` "Book/Book Online" | `/booking` | `resolveBookingHref({})` | ✅ safe generic Boulevard destination when the visitor has supplied no clinic or service context. |
| `app/page.tsx`, `gallery`, `about`, `membership`, `blog/[slug]`, `BlogSidebar` | `/booking` | `resolveBookingHref({})` or a section-appropriate location/service | ✅ no public CTA routes into the retired internal wizard. |
| `app/booking/page.tsx` | embedded Boulevard SDK wizard | server redirect to `resolveBookingHref({})` | ✅ retired from the public journey; preserved URL cannot expose a second booking implementation. |

## External destination health

`npm run check:booking-links` discovers the links rendered by the generated sitemap pages and verifies every unique external booking destination without submitting a form. It requires all three approved source hosts, successful HTTPS responses, and redirects that remain inside the approved Rella/JoinBLVD host set. See `docs/BOOKING-DESTINATION-HEALTH-PASS-2026-08-03.md`.

## Preserved
The booking smoke check sends no form contents or patient information. No DNS, repo-visibility, deployment, or live booking change is part of the local verification workflow.
