# Two-clinic hours reconciliation — 2026-08-03

## Outcome

The rebuild now uses one binding schedule per clinic across visible pages and structured search data:

- **Napa:** Tuesday–Saturday, 9am–5pm; closed Sunday–Monday.
- **Vacaville:** Wednesday–Saturday, 9am–5pm; closed Sunday–Tuesday.

No deployment, Google Business Profile edit, ad edit, campaign-state change, billing action, environment change, push, merge, or public cutover was performed.

## Source decision

Binding source:

`PROJECTS/Website-Rebuild-Evidence/19-pricing-and-membership-canon.md`

That record states that both approved public documents—the Rella Signature Menu and Rella Memberships PDF—publish Napa Tuesday–Saturday 9am–5pm and Vacaville Wednesday–Saturday 9am–5pm. The owner-decision register marks D5 resolved by those approved public documents on July 15, 2026.

The binding record explicitly supersedes:

- the live site's shared Monday–Friday 9am–5pm plus Saturday 9am–1pm block;
- the Wednesday–Saturday Napa prototype copy, which belonged to the Vacaville schedule.

The live WordPress Contact/location hours are therefore evidence of the old mismatch, not the controlling source for the rebuild.

## Surfaces corrected

- Napa location page;
- Vacaville location page;
- homepage location cards;
- Contact page clinic-hours block;
- Napa campaign hub and all five Napa acquisition pages;
- Napa Botox pricing article;
- per-location MedicalBusiness/DaySpa structured data;
- homepage organization/location structured-data graph.

The Contact page no longer publishes one shared schedule for both clinics. It names each clinic and its own schedule, then explains that online booking remains available at any time.

## Structured-data correction

Before this pass, the homepage MedicalBusiness entity carried two addresses but one shared Monday–Friday/Saturday schedule. Each location page also emitted the same incorrect opening-hours specification.

The homepage now publishes:

1. one parent Rella Aesthetics Organization node;
2. one Vacaville MedicalBusiness/DaySpa node with Wednesday–Saturday hours;
3. one Napa MedicalBusiness/DaySpa node with Tuesday–Saturday hours.

Each location page emits its matching location node. No rating or review-count schema was added.

## Verification

- 257 automated checks passed across 18 test files.
- The hours contract pins both display schedules, closed-day ranges, campaign copy, article copy, per-location schema, and the two-node homepage graph.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 production build generated 33 routes.
- Sitemap regenerated.
- Internal release crawl passed across 27 sitemap pages and 36 unique internal destinations.
- External booking check passed across 12 unique booking destinations.
- Optimized-preview checks returned HTTP 200 and the approved schedule on `/locations/napa`, `/locations/vacaville`, `/contact`, `/napa/botox`, and `/blog/botox-cost-napa`.
- The optimized homepage contained exactly two location business nodes.
- The optimized local preview is running at `http://localhost:3010` from this exact build.

## Production acceptance

Before cutover:

1. obtain a one-line owner confirmation that the two approved public schedules remain current;
2. ensure Google Business Profile hours match each clinic's schedule;
3. ensure front-desk/phone routing hours match the intended staffed hours;
4. compare current Boulevard availability without hard-coding bookable weekdays—the scheduler remains authoritative for actual appointment inventory;
5. update any remaining public WordPress hours during the controlled cutover so search, GBP, and the new site do not conflict.

If operating hours have changed since the July 15 public documents, update the central location data, its contract tests, visible copy, and schema together from a newly approved source.
