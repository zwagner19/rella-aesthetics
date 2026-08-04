# Vacaville Botox acquisition pass — 2026-08-03

## Outcome

Rella now has a dedicated, indexable `/vacaville/botox` page for high-intent local search visitors. It does not copy the Napa campaign page or replace the broader `/services/botox` guide. It answers the Vacaville-specific questions a patient needs before choosing the clinic: current pricing, product-specific timing, address, hours, what the visit involves, and the exact live booking handoff.

## Why this page was first

A current search snapshot for `Botox Vacaville CA` and `med spa Vacaville CA` surfaced Rella's broad legacy homepage but no dedicated Rella Vacaville Botox result. That indexed homepage still exposes stale hours, a retired $20 membership, and superseded broad copy. Competitors already present exact Vacaville injectables positioning, including [XUNA Aesthetics](https://www.xunaclinic.com/), [Maven Haus](https://www.themavenhaus.com/), and a [My Retreat Botox page](https://www.myretreatdayspa.com/botox).

The page closes an intent gap without manufacturing a keyword page: its local facts, pricing explanation, booking behavior, membership boundary, visit sequence, FAQ, and structured data are materially specific to the Vacaville journey.

Search results change and do not guarantee ranking. This snapshot informed prioritization only.

## Acquisition path

- Canonical: `https://experiencerella.com/vacaville/botox`
- Clinic: Rella Aesthetics, 542 Main St, Vacaville, CA 95688
- Published hours: Wednesday–Saturday 9am–5pm
- Primary handoff: the official location-pinned Vacaville `Injectables/New Patient Tox` service URL
- Mobile action: `Book New Patient Tox`, using the same exact Vacaville service destination
- Supporting links: the general Botox/Dysport guide, injectable membership comparison, Vacaville clinic page, directions, phone, and cancellation policy

The Vacaville location page now links directly to this guide. The general Botox page links to this Vacaville guide and the existing Napa guide from its city-choice cards, creating a clean general-service → city-specific path.

## Pricing and claim boundaries

Visible public amounts remain limited to the approved 2026 canon:

- Botox: $18/unit standard; $13/unit with the Tox Membership
- Dysport: $6/unit standard; $4.40/unit with the Tox Membership
- Tox Membership: $30/month with a one-year commitment

The page states that Botox and Dysport units are product-specific and not interchangeable. It uses the already-reviewed temporary-improvement timing: Botox may begin in 4–7 days, Dysport in 2–5 days, full effect assessed around two weeks, and typical duration around 3–4 months with individual variation.

It does not claim prevention, guaranteed outcomes, a fixed dose, a free touch-up, a free consultation, or Napa's exact $50 new-patient tox deposit. Boulevard remains responsible for displaying the live booking terms before confirmation.

## Structured data

The page emits:

- one `Service` entity for Botox and Dysport in Vacaville;
- one `MedicalBusiness`/`DaySpa` entity using the existing Vacaville location ID;
- one `FAQPage` built from the same six questions rendered visibly.

It emits no rating, review, aggregate rating, offer, or availability promise.

## Verification

- 283 automated tests passed across 22 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 optimized build generated 38 routes, including `/vacaville/botox`.
- Sitemap regenerated with 29 indexable pages.
- Internal crawl passed across 29 pages and 39 unique destinations.
- Booking crawl passed across 11 unique external destinations.
- SEO crawl passed across 29 pages, 13 social images, and 33 structured-data blocks.
- Desktop QA passed at 1280 × 900 with no browser errors or horizontal overflow.
- Mobile QA passed at 390 × 844 with one H1, no browser errors or horizontal overflow, and the city-correct fixed booking action.
- A real preview click reached Boulevard's live `New Patient Tox` screen, displayed `Select a professional`, and did not render `#/not-found` or “things have moved.”

## Current booking-path update

The August 3 booking-friction pass replaced the clinic-menu handoff with Boulevard service `s_2fee10b1-1831-4c00-83e9-9c05a7071b15` at Vacaville location `0f146f87-364e-4dfd-b938-61ba49528820`. All three page CTAs and the mobile action bar use that verified destination. The page makes no add-on price promise. Boulevard currently describes ProNox as `$50` while displaying the selectable add-on as `+$60.00`; correct or deliberately approve that vendor-side conflict before paid traffic.

## Production gate

Before cutover or paid traffic, repeat the Vacaville booking click on the exact deployment in a clean browser and in a browser that previously began a Napa journey. Fail the launch if Boulevard shows Napa inventory, `#/not-found`, an empty shell, anything other than `New Patient Tox`, or no `Select a professional` next step. The ProNox price conflict must also be resolved or explicitly approved.
