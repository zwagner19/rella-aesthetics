# Vacaville filler acquisition pass — 2026-08-03

## Outcome

Rella now has a dedicated, indexable `/vacaville/filler` page for people comparing lip and dermal filler in Vacaville. The page does not duplicate the general dermal-filler guide or the Napa campaign page. It gives the Vacaville visitor a city-specific planning path: current public pricing, the variables that affect the proposed total, location and hours, recovery-planning context, and the exact live booking handoff.

## Why this page was next

A current search snapshot for `lip filler Vacaville CA`, `dermal filler Vacaville CA`, and `Rella Aesthetics filler Vacaville` did not surface a dedicated Rella Vacaville filler result. Local competitors already position directly for Vacaville filler and injectables, while patient search behavior includes explicit questions about lip-filler cost.

The page closes that high-intent local gap with substantive clinic, pricing, planning, safety, FAQ, booking, and structured-data content. Search results change and do not guarantee ranking; the snapshot informed prioritization only.

## Acquisition path

- Canonical: `https://experiencerella.com/vacaville/filler`
- Clinic: Rella Aesthetics, 542 Main St, Vacaville, CA 95688
- Published hours: Wednesday–Saturday 9am–5pm
- Primary handoff: the official location-pinned Vacaville `Injectables/Dermal Fillers` service URL
- Mobile action: `Book Dermal Fillers`, using the same exact Vacaville service destination
- Supporting links: the general dermal-filler guide, injectable membership comparison, Vacaville clinic page, directions, phone, and cancellation policy

The Vacaville location page now links directly to this guide. The general dermal-filler page links to the Vacaville guide and the existing Napa filler page from its city-choice cards. The shared treatment guide also sends Botox visitors to the appropriate city-specific Botox page.

## Pricing and claim boundaries

Visible public amounts remain limited to the approved 2026 canon:

- Dermal-filler base service amount: $840
- Current active product range: $540–$960
- Filler Membership: $40/month with a one-year commitment

The page explains that area, product, amount, and timing shape the recommendation and total. It uses conservative recovery language for temporary swelling, tenderness, and bruising, and asks visitors to discuss travel, dental care, and important events before selecting a date.

It does not advertise a generic $700-per-syringe price, a half-syringe offer, a guaranteed amount, permanent results, a fixed duration, a rating, or availability. It does not promise a specific product or treatment before an individualized assessment. Boulevard remains responsible for displaying live booking terms before confirmation.

## Structured data

The page emits:

- one `Service` entity for dermal filler in Vacaville;
- one `MedicalBusiness`/`DaySpa` entity using the existing Vacaville location ID;
- one `FAQPage` built from the same six questions rendered visibly.

It emits no rating, review, aggregate rating, offer, or availability promise.

## Verification

- 289 automated tests passed across 23 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 optimized build generated 39 routes, including `/vacaville/filler`.
- Sitemap regenerated with 30 indexable pages.
- Internal crawl passed across 30 pages and 40 unique destinations.
- Booking crawl passed across 11 unique external destinations.
- SEO crawl passed across 30 pages, 13 social images, and 36 structured-data blocks.
- Desktop QA passed at 1280 × 900 with one H1, no browser errors, and no horizontal overflow.
- Mobile QA passed at 390 × 844 with one H1, no browser errors, no horizontal overflow, and the city-correct fixed booking action.
- A real preview click reached Boulevard's live `Dermal Fillers` screen, displayed `Select a professional`, and did not render `#/not-found` or “things have moved.”

## Current booking-path update

The August 3 booking-friction pass replaced the clinic-menu handoff with Boulevard service `s_e3564b2f-c00d-47c2-8ca0-665b6d6f25e4` at Vacaville location `0f146f87-364e-4dfd-b938-61ba49528820`. All three page CTAs and the mobile action bar use that verified destination. The website retains the approved `$840` base and `$540–$960` active-product range instead of importing broader vendor copy. Boulevard currently describes ProNox as `$50` while displaying the selectable add-on as `+$60.00`; correct or deliberately approve that vendor-side conflict before paid traffic.

## Production gate

Before cutover or paid traffic, repeat the Vacaville filler booking click on the exact deployment in a clean browser and in a browser that previously began a Napa journey. Fail the launch if Boulevard shows Napa inventory, `#/not-found`, an empty shell, anything other than `Dermal Fillers`, or no `Select a professional` next step. The ProNox price conflict must also be resolved or explicitly approved.
