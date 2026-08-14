# Booking-CTA routing — current implementation map

> Updated August 13, 2026. This document supersedes the earlier browser-side
> Boulevard-widget routing described in the August 3 audit notes. Boulevard is
> now server-side behind the separate Rella-owned booking application.

Single source of truth: `src/lib/booking-routes.ts` (`resolveBookingHref`), proven by
`src/lib/booking-routes.test.ts` (Vacaville + generic CTAs can never reach the Napa Tox app; only an
explicit Napa Tox/Botox intent does). Targets:

- Napa New Patient Tox / Botox → `https://book.experiencerella.com/book/napa/botox` (canonical hardened app)
- Napa other verified services → `https://book.experiencerella.com/book?location=napa&service=<intent>`
- Vacaville verified services → `https://book.experiencerella.com/book?location=vacaville&service=<intent>`
- Generic / no location → first-party website `/book`, then the Rella-owned booking chooser
- Medical weight loss → `https://book.rellaweightloss.com/book/<city>/weight-loss-consult`
- IV hydration → call-assisted/chooser workflow until the clinical formula-selection path is approved

## CTA audit + status
| Surface | Was | Now | Notes |
|---|---|---|---|
| `locations/napa/page.tsx` "Book at Napa" | `/booking` | `resolveBookingHref({location:"napa"})` → branded custom chooser | ✅ Never routes to a browser-side vendor widget. |
| `locations/vacaville/page.tsx` "Book at Vacaville" | `/booking` | `resolveBookingHref({location:"vacaville"})` → branded custom chooser | ✅ Never routes to Napa Tox. |
| Shared treatment pages | `/booking?service=slug` | on-page Vacaville/Napa choice, then `resolveBookingHref({location,service})` | ✅ Location and service intent remain explicit. |
| `components/blocks/BookingCta.tsx` | `/booking?service=slug` | `resolveBookingHref({location?,service})` + optional `location` prop | ✅ rewired (shared component). |
| `components/layout/Header.tsx`, `MobileNav.tsx`, `Footer.tsx` "Book/Book Online" | `/booking` | `resolveBookingHref({})` → `/book` | ✅ first-party clinic choice before any Boulevard handoff. |
| `app/page.tsx`, `gallery`, `about`, `membership`, `blog/[slug]`, `BlogSidebar` | `/booking` | `resolveBookingHref({})` or a section-appropriate location/service | ✅ no public CTA routes into the retired internal wizard. |
| `app/booking/page.tsx` | embedded Boulevard SDK wizard | server redirect to `/book` | ✅ Retired from the public journey. |
| `app/book/page.tsx` | — | exactly Napa and Vacaville, then the branded custom-booking origin | ✅ Keeps vendor implementation details server-side. |

## External destination health

`npm run check:booking-links` discovers booking links rendered for both public
website host contexts and verifies the approved Rella-owned destinations
without submitting a form. It must find `book.experiencerella.com` on the main
site and `book.rellaweightloss.com` on the weight-loss site. It must reject
direct Boulevard/JoinBLVD and Rella HQ destinations.

## Preserved
The booking smoke check sends no form contents or patient information and does
not create a cart, appointment, checkout, or payment. No DNS, deployment,
Boulevard setting, or Rella HQ change is part of the verification workflow.
