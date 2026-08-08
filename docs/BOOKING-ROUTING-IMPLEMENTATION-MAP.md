# Booking-CTA Routing — audit + implementation map (Large Sprint 06, Workstream D)

Single source of truth: `src/lib/booking-routes.ts` (`resolveBookingHref`), proven by
`src/lib/booking-routes.test.ts` (Vacaville + generic CTAs can never reach the Napa Tox app; only an
explicit Napa Tox/Botox intent does). Targets:

- Napa New Patient Tox / Botox → `https://book.experiencerella.com/book/napa/botox` (canonical hardened app)
- Napa other verified services (HydraFacial, filler, laser, hyperhidrosis consult) → verified Boulevard path
- Napa, unspecified service → Napa-scoped Boulevard widget (not Tox)
- Vacaville (any) → Vacaville-scoped Boulevard widget (never Napa Tox)
- Generic / no location → first-party `/book` clinic chooser (never silently chooses a city or Napa Tox)

## CTA audit + status
| Surface | Was | Now | Notes |
|---|---|---|---|
| `locations/napa/page.tsx` "Book at Napa" | `/booking` | `resolveBookingHref({location:"napa"})` → Napa widget | ✅ rewired. Design pass: add a dedicated "Book New Patient Tox" CTA → canonical app. |
| `locations/vacaville/page.tsx` "Book at Vacaville" | `/booking` | `resolveBookingHref({location:"vacaville"})` → Vacaville widget | ✅ rewired. Never routes to Napa Tox. |
| `services/[slug]/page.tsx` | `/booking?service=slug` | on-page Vacaville/Napa chooser, then `resolveBookingHref({location,service})` | ✅ location-first. Four rendered booking actions resolve to exactly two clinic destinations; no generic widget. |
| `components/blocks/BookingCta.tsx` | `/booking?service=slug` | `resolveBookingHref({location?,service})` + optional `location` prop | ✅ rewired (shared component). |
| `components/layout/Header.tsx`, `MobileNav.tsx`, `Footer.tsx` "Book/Book Online" | `/booking` | `resolveBookingHref({})` → `/book` | ✅ first-party clinic choice before any Boulevard handoff. |
| `app/page.tsx`, `gallery`, `about`, `membership`, `blog/[slug]`, `BlogSidebar` | `/booking` | `resolveBookingHref({})` or a section-appropriate location/service | ✅ no public CTA routes into the retired internal wizard. |
| `app/booking/page.tsx` | embedded Boulevard SDK wizard | server redirect to `/book` | ✅ retired from the public journey; preserved links recover into the focused chooser. |
| `app/book/page.tsx` | — | exactly Napa and Vacaville, then each clinic's official location-pinned `/cart/menu` URL | ✅ replaces Boulevard's HTTP-200-but-rendered-not-found generic URL. |

## External destination health

`npm run check:booking-links` discovers the links rendered by the generated sitemap pages and verifies every unique external booking destination without submitting a form. It requires all three approved source hosts, a rendered route path on Boulevard URLs, successful HTTPS responses, and redirects that remain inside the approved Rella/JoinBLVD host set. HTTP success is not rendered-screen proof; see `docs/BOOKING-DESTINATION-HEALTH-PASS-2026-08-03.md` and `docs/BOOKING-RENDERED-DESTINATION-AUDIT-2026-08-03.md`.

## Preserved
The booking smoke check sends no form contents or patient information. No DNS, repo-visibility, deployment, or live booking change is part of the local verification workflow.
