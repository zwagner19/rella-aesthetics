# Canonical booking routing map

Current as of October 18, 2026: ordinary `BookTrigger` CTAs render Amie's
in-site booking interface, backed by the shared `rella-booking` APIs. Native
booking, payment rules and durable outcomes remain owned by that backend.
`src/lib/booking-routes.ts` still supplies canonical hrefs and fallbacks;
campaign/direct-link and weight-loss CTA families must be audited separately.
See [GO-LIVE-AUDIT-HANDOFF.md](GO-LIVE-AUDIT-HANDOFF.md) for the current branches,
owner decisions and prelaunch verification requirements.

## Approved destinations

| Intent | Destination |
|---|---|
| Generic booking | `https://book.experiencerella.com/book` |
| Clinic only | `/book?location=napa` or `/book?location=vacaville` |
| Broad service | `/book?category=<approved-category>` with optional `location` |
| Napa Botox / New Patient Tox | `https://book.experiencerella.com/book/napa/botox` |
| Medical weight-loss consultation | `https://book.rellaweightloss.com/book/<napa|vacaville>/weight-loss-consult` |
| IV hydration | Call `707.358.2928` for current availability |

Approved broad categories are `injectables`, `laser`, `microneedling`,
`facials`, and `peels`. A broad category opens the chooser and never selects an
appointment. Medical weight-loss uses its existing dedicated consultation host
and exact clinic route. IV hydration remains call-assisted because no approved
online IV category exists.

## Prohibited destinations

Public CTAs must never point to Boulevard dashboards or widgets, JoinBLVD,
Rella HQ, the retired `/booking` wizard, or a booking hostname other than the
two approved first-party hosts above.
`/booking` is a non-indexed server redirect to the generic canonical chooser.

## Retired website booking engine

The unused Boulevard SDK wizard, wrapper, helpers, configuration, type shim,
and package dependency have been removed. Booking attribution, consent, cart,
checkout, outcome, and conversion-job behavior remains owned by the separate
`zwagner19/rella-booking` repository and is not recreated here.

## Release boundary

This map does not authorize a merge, deployment, DNS change, WordPress change,
appointment/cart creation, payment action, or conversion upload.


## In-site guided booking shell (2026-10)

The marketing site now opens a Rella-branded guided booking modal/fullscreen
shell from ordinary Book CTAs (`BookingExperienceProvider` + `BookTrigger`).

- Steps: location → treatments → review → provider → datetime → complete.
- Catalog is fail-closed against verified `rella-booking` aesthetics entries
  (location/service slugs only — no Boulevard URNs in the website client).
- Live Boulevard availability, deposit enforcement, payment and appointment
  creation remain owned by the paired `rella-booking` backend. The default
  website adapter is the shared live adapter, using the same-origin bridge for
  session creation, reservation/release, payment and checkout. It is not the
  earlier handoff-only demonstration. Package purchase/ownership use a separate
  same-origin package bridge and private backend session.
- Opens and confirmed bookings are tracked separately; conversion remains owned
  by the booking app after verified Boulevard success.
- Weight-loss CTAs still navigate to `book.rellaweightloss.com` (no modal).
- Campaign attribution consent interception for `book.experiencerella.com`
  links is preserved on handoff anchors.
