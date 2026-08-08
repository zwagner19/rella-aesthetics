# Chemical-peel scope integrity pass — 2026-08-03

## Outcome

The chemical-peel acquisition journey now matches the current public booking menus instead of claiming unsupported service depth and two-clinic availability.

## Current public booking evidence

Read-only review of the live Boulevard menus on August 3, 2026 found:

- **Vacaville → Peels:** MicroPeel Sensitive, MicroPeel Plus 20, TCA Peel, and Universal Peel.
- **Napa:** no Peels category in the current menu.
- **Napa → Facials:** HydraFacial, microdermabrasion, acne/anti-aging facials, dermaplaning, an initial skin-health consult, and related services; no peel service was listed there either.

The page previously advertised chemical peels in both Vacaville and Napa and rendered a Napa booking CTA. That created a false handoff into a menu where the visitor could not select the advertised service.

## Corrections

- Metadata now targets `Chemical Peels in Vacaville, CA` rather than both cities.
- The visible hero, trust strip, booking section, and closing CTA name Vacaville only.
- Only the Vacaville booking action renders.
- Hero, pricing, and fixed mobile actions say `Book in Vacaville` / `Book Vacaville` instead of offering a false clinic choice.
- Service structured data lists Vacaville only.
- The educational copy names the four currently visible Vacaville services.
- Unsupported claims that Rella offers deep peels, fixed recovery windows, and a standard 3–6 treatment result pattern were removed.
- Pricing remains consultation-led because the available sources do not establish a single current public price that is safe to publish across all four peel options.
- A follow-on local acquisition page now exists at `/vacaville/chemical-peels`, with all booking actions kept on the working location-pinned Vacaville menu. See `docs/VACAVILLE-CHEMICAL-PEELS-ACQUISITION-PASS-2026-08-03.md`.

## Reusable location contract

`ServicePageData.availableLocations` now provides a source-of-truth boundary for services that are not bookable at every clinic. The ordinary treatment-page component and Service schema both consume it, so visible CTAs and search claims cannot drift apart.

The default remains both clinics for services with verified two-location availability; chemical peels explicitly opt into Vacaville only.

The shared guide's clinic-detail action and the Vacaville location page now link to the dedicated local guide, so visitors can see the verified menu names and booking instructions without introducing a false Napa path.

## Regression coverage

The catalog suite now verifies:

- booking CTA count follows `availableLocations`;
- structured-data cities follow the same field;
- chemical-peel copy contains the four current Vacaville menu names;
- no Napa peel booking CTA renders;
- the unsupported deep-peel and fixed-result claims do not return.

## Recheck rule

Booking-menu availability can change. Recheck both live clinic menus before production cutover and during the weekly operating review. If Napa adds an approved peel service, update the location field, visible menu copy, and regression evidence together.
