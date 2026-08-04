# Microneedling location-scope integrity pass — 2026-08-03

## Outcome

The shared `/services/microneedling` journey now advertises and books Vacaville only. Its title, visible location language, booking cards, mobile action, internal clinic guide, and `Service.areaServed` structured data all agree.

No Napa service page, Napa booking action, Napa service schema, ad change, budget change, deployment, booking, CRM record, or production setting was created.

## Evidence and decision

Two evidence streams do not support a public Napa microneedling promise:

1. The imported Napa Capacity Map records Microneedling/PRP at approximately zero bookings, campaign status `hold`, campaign `Not built`, and the instruction `Confirm provider/device first`.
2. The imported Google Ads decision packet records microneedling queries entering the Napa Laser-Pigmentation campaign and landing on `/napa/laser/`, explicitly calling this a message mismatch. Its lead ruling says not to add a microneedling negative until the Napa service/page mapping is confirmed.

Those records do not prove that Napa cannot offer microneedling; they prove that provider, device, live inventory, and capacity were not approved for acquisition. A returning Boulevard browser also preserved prior Vacaville cart state during a Napa URL check, so that contaminated screen was not accepted as Napa availability evidence.

Vacaville is different: its live menu rendered Skin Stylus Microneedling, RF Microneedling, an Initial Microneedling Consult, packages, and an add-on. The direct consult handoff was verified in the rendered booking application.

The safe website posture is therefore Vacaville-only until Napa is positively reconfirmed.

## Changes

- `availableLocations` for microneedling is now `["vacaville"]`.
- Search title changed from `Microneedling in Vacaville & Napa CA` to `Microneedling in Vacaville, CA`.
- The shared page renders one Vacaville booking card and no Napa card.
- The existing Vacaville details action opens `/vacaville/microneedling`.
- The mobile action says `Book Vacaville` and opens the on-page Vacaville booking section.
- `Service.areaServed` contains Vacaville only.
- Regression tests prevent Napa UI or schema from returning without an explicit source-backed change.

## Ads implication

The website correction does not repair the live Napa Laser-Pigmentation search-term mismatch because that campaign still needs an owner-approved ads decision. Until Napa microneedling is operationally confirmed, the evidence favors excluding microneedling terms from the Napa laser campaign rather than sending them to an IPL/CO2 page. If Napa inventory is confirmed, build and verify a dedicated Napa journey before retaining that traffic.

The earlier Ads conversion is a booking-click signal, not a confirmed appointment, so it is not evidence that the mismatch produced revenue.

## Verification

- 323 automated tests passed across 29 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 production build generated 45 routes.
- Legacy migration check passed for 31 moved WordPress URLs and 2 preserved public records.
- Internal crawl passed across 34 sitemap pages and 44 unique destinations.
- Booking crawl passed across 34 pages and 14 unique external destinations.
- SEO crawl passed across 34 pages, 13 social images, and 48 structured-data blocks.
- Mobile review at 390 × 844 showed `Skin Care · Vacaville`, four `Book in Vacaville` actions, the fixed `Book Vacaville` bar, one verified local-guide link, and zero `Book in Napa` links.
- The visible single-location sentence now reads `This service is currently listed in the Vacaville booking menu.`

## Source record

- `01 Rella/Marketing/Google Ads/Napa Campaign/01 Napa Capacity Map.md`
- `01 Rella/Website Revamp/runs/2026-07-27-large-sprint-09/ADS-PASS-2-DECISION-PACKET.md`
- `01 Rella/Website Revamp/runs/2026-07-27-large-sprint-09/ADS-PASS-2-LEAD-RULING.md`
- `docs/VACAVILLE-MICRONEEDLING-ACQUISITION-PASS-2026-08-03.md`

## Production gate

Do not add Napa back from a marketing hunch or a cross-location Boulevard screen. Require a clean-session Napa menu check, exact device and service names, qualified provider confirmation, current capacity, correct location-pinned booking route, clinical/pricing approval, and owner approval. Then update visible copy, booking routing, mobile behavior, schema, regression evidence, landing-page strategy, and the Ads decision together.
