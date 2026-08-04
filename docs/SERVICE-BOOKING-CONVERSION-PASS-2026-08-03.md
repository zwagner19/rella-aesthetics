# Service booking conversion pass — 2026-08-03

## Outcome

The eight ordinary treatment pages no longer abandon their location context by sending every primary action to the generic Boulevard business menu.

Each page now uses a location-first journey:

1. The hero and pricing actions scroll to an explicit Vacaville/Napa clinic chooser.
2. The chooser opens a destination resolved from both the selected clinic and the current service.
3. The closing action repeats both clinic choices so a ready visitor can book without scrolling backward.
4. The mobile action bar opens the same clinic chooser instead of bypassing it.

This affects:

- `/services/botox`
- `/services/dermal-fillers`
- `/services/chemical-peels`
- `/services/facials`
- `/services/hydrafacial`
- `/services/microneedling`
- `/services/iv-hydration`
- `/services/laser-treatments`

Medical weight loss retains its separate city-specific consultation funnel.

No deployment, ad edit, campaign-state change, billing action, environment change, push, merge, or public cutover was performed.

## Why this mattered

Before this pass, the service headline said “Vacaville & Napa,” but all three Book actions opened a generic scheduler that required another location decision. The separate location cards led only to clinic-information pages, not the service booking journey.

That introduced unnecessary ambiguity at the point of highest intent and made it easier for a visitor to choose the wrong clinic or lose the service context.

## Routing contract

| Service | Napa booking destination | Vacaville booking destination |
| --- | --- | --- |
| Botox & Dysport | hardened Napa Botox app | Vacaville Boulevard menu |
| Dermal Fillers | verified Napa filler service | Vacaville Boulevard menu |
| HydraFacial | verified Napa Signature HydraFacial service | verified Vacaville Signature HydraFacial service |
| Laser Treatments | verified Napa Laser category | verified Vacaville Initial Laser Consult |
| Chemical Peels | Not advertised; no current Napa peel inventory | verified Vacaville clinic menu with visible Peels category |
| Facials | verified Napa Initial Skin Health Consult | verified Vacaville Initial Skin Health Consult |
| Microneedling | Not advertised pending Napa provider/device confirmation | Verified Vacaville Initial Microneedling Consult |
| IV Hydration | Napa Boulevard menu | Vacaville Boulevard menu |

Every URL is produced by the existing typed booking resolver. No service ID, location ID, or booking URL was invented in this pass.

Services with verified two-clinic availability render four external booking actions resolving to the approved Napa and Vacaville destinations. Chemical peels and microneedling now render only the verified Vacaville path. The generic business-level widget is absent from all eight rendered treatment pages.

## Measurement behavior

- Opening the clinic chooser is measured as a booking-flow start.
- Clicking a clinic-specific external booking action is measured as booking intent.
- The event payload remains generic and includes no form contents, identity, health information, or patient data.
- A booking-intent event is not treated as a completed appointment or collected revenue.

## Verification

- 251 automated checks passed across 17 test files.
- Contract tests render every treatment page and prove two on-page chooser actions, four external booking actions, exactly two approved clinic destinations, and no generic widget destination.
- Mobile conversion tests prove treatment pages open `#book-service` with booking-flow-start intent.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 production build generated 33 routes.
- Release crawl passed across 27 sitemap pages and 36 unique internal destinations.
- An optimized-preview audit fetched all eight treatment routes and confirmed `4 CTAs → 2 clinic routes` on every page.
- The optimized local preview is running at `http://localhost:3010` from this exact build.

## Production checks

On the exact preview deployment:

1. Open every treatment page on a mobile viewport and confirm the action bar reveals the clinic chooser without covering content.
2. Test one Napa and one Vacaville booking action for each service family.
3. Confirm the clinic is correct before any appointment or payment step.
4. Confirm one booking-flow-start event when the chooser opens and one booking-intent event when the external booking action is clicked.
5. Confirm no patient or health information appears in GA4 or Meta test tools.
6. Reconcile actual appointment completions and arrivals in Boulevard; do not optimize from button clicks alone.

## Remaining boundary

Vacaville laser, HydraFacial, facials, and microneedling plus Napa facials now use service-specific destinations verified in Boulevard's rendered booking application. Chemical peels deliberately retain the verified clinic-menu fallback because the attempted category shortcut rendered a not-found state. Botox, fillers, and IV hydration retain the clinic-scoped menu where a deeper service path has not been separately approved. Add or replace a route only after rendered inventory verification and a typed resolver contract test.
