# Canonical booking routing map

The website does not implement booking. Every public booking CTA resolves through
`src/lib/booking-routes.ts`; the patient booking application remains
`https://book.experiencerella.com`.

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
