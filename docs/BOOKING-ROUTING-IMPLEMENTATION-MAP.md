# Booking-CTA Routing — audit + implementation map (Large Sprint 06, Workstream D)

Single source of truth: `src/lib/booking-routes.ts` (`resolveBookingHref`), proven by
`src/lib/booking-routes.test.ts` (Vacaville + generic CTAs can never reach the Napa Tox app; only an
explicit Napa Tox/Botox intent does). Targets:

- Napa New Patient Tox / Botox → `https://book.experiencerella.com/book/napa/botox` (canonical hardened app)
- Napa other verified service (Hydrafacial) → verified Boulevard deep link
- Napa, unspecified service → Napa-scoped Boulevard widget (not Tox)
- Vacaville (any) → Vacaville-scoped Boulevard widget (never Napa Tox)
- Generic / no location → business-level Boulevard widget (never silently Napa Tox)

## CTA audit + status
| Surface | Was | Now | Notes |
|---|---|---|---|
| `locations/napa/page.tsx` "Book at Napa" | `/booking` | `resolveBookingHref({location:"napa"})` → Napa widget | ✅ rewired. Design pass: add a dedicated "Book New Patient Tox" CTA → canonical app. |
| `locations/vacaville/page.tsx` "Book at Vacaville" | `/booking` | `resolveBookingHref({location:"vacaville"})` → Vacaville widget | ✅ rewired. Never routes to Napa Tox. |
| `services/[slug]/page.tsx` (×3) | `/booking?service=slug` | `resolveBookingHref({service:slug})` | ✅ rewired. Location-agnostic → generic/deeplink; Botox slug → generic (no location assumed). |
| `components/blocks/BookingCta.tsx` | `/booking?service=slug` | `resolveBookingHref({location?,service})` + optional `location` prop | ✅ rewired (shared component). |
| `components/layout/Header.tsx`, `MobileNav.tsx`, `Footer.tsx` "Book/Book Online" | `/booking` | **mapped** → `resolveBookingHref({})` (generic widget) | ⏭ design pass — generic nav CTAs; safe today (they point at the internal wizard, not Napa Tox). |
| `app/page.tsx` (home), `gallery`, `about`, `membership`, `blog/[slug]`, `blog/BlogSidebar` | `/booking` | **mapped** → `resolveBookingHref({})` or a section-appropriate location/service | ⏭ design pass — generic content CTAs. |
| `app/booking/page.tsx` + `components/integrations/BoulevardCustomBooking.tsx` + `BoulevardBookingWizard.tsx` | embedded Boulevard SDK wizard (second booking implementation) | **QUARANTINE** | ⏭ design pass — remove public routing to `/booking`; do not maintain a second booking implementation. Keep the code out of the public nav; final removal ships with the design package. |

## Quarantine plan for the embedded wizard (`/booking`)
The retired embedded custom wizard must not be a public destination. This PR rewires the location/service
CTAs off `/booking`; the remaining generic `/booking` links (nav/footer/home/content) are mapped above and
should be repointed to `resolveBookingHref(...)` in the design-package pass, after which `/booking` can be
redirected to a safe explicit location/service choice (or removed). No second booking UI is maintained.

## Preserved
SEO/metadata, analytics, and privacy are unchanged (only CTA `href`s changed on the rewired surfaces).
No DNS, no repo-visibility, no deploy. Do not convert `.dc.html` design runtime artifacts into production.
