# Vacaville laser acquisition pass — 2026-08-03

## Outcome

Rella now has a dedicated, indexable `/vacaville/laser` page for high-intent local laser searches. It does not duplicate the general laser-treatment guide or the Napa laser campaign page. It explains the verified Vacaville menu, publishes only the two approved full-face prices, and sends every booking action directly to the live Vacaville `Initial Laser Consult` screen.

## Why this page was next

Current local searches for IPL, CoolPeel, laser resurfacing, and laser hair removal in Vacaville surfaced exact competitor positioning from [TruFusion Clinics](https://trufusionclinics.com/), [TruFusion's Fotona4D page](https://www.trufusionclinics.com/4dconsultation), [Glow Medspa](https://getglow.org/services/laser-hair-removal-in-vacaville-ca/), and other local providers. Rella appeared through its broad legacy homepage rather than a dedicated Vacaville laser result.

Laser also has a clearer revenue case than adding a generic page: the approved public canon includes $420 full-face IPL and $1,440 full-face CO2 CoolPeel, while the live Vacaville menu confirms multiple laser families and an assessment-first booking path.

Search results change and do not guarantee ranking. This snapshot informed prioritization only.

## Live Vacaville inventory verification

The location-pinned Vacaville Boulevard menu rendered a live `Laser` category containing:

- Initial Laser Consult;
- laser hair removal by small, medium, and large area;
- IPL Full Face;
- Erbium full-face skin resurfacing;
- tattoo removal;
- spider-vein removal;
- IPL and Erbium packages;
- CO2 CoolPeel Full Face;
- advanced CO2 skin resurfacing.

The IPL detail screen explicitly says the Initial Laser Consult must be booked before IPL. The consult itself rendered the `Initial Laser Consult` heading, assessment-first description, and `Select a professional` next step. No form was completed and no appointment was created.

## Acquisition and booking path

- Canonical: `https://experiencerella.com/vacaville/laser`
- Clinic: Rella Aesthetics, 542 Main St, Vacaville, CA 95688
- Published hours: Wednesday–Saturday 9am–5pm
- Direct handoff: Vacaville location ID plus `/cart/menu/Laser/s_1328674e-c793-4b3c-833e-9a3827c5769b`
- Mobile action: `Book Laser Consult`, using the same location-pinned service path

The Vacaville location page now links directly to this guide. The general laser page links to the Vacaville guide while preserving its separate verified Napa laser path. The typed booking resolver uses the service-specific path only for an explicit Vacaville laser intent; all other unverified Vacaville services keep the safe clinic-menu fallback.

## Pricing and claim boundaries

Visible public amounts remain limited to the approved 2026 canon:

- IPL Full Face: $420
- CO2 CoolPeel Full Face: $1,440

The page does not publish an unverified hair-removal, Erbium, tattoo-removal, vascular-treatment, package, or starting price. It explains that concern, skin and treatment history, medications and products, recent sun exposure, treatment area, settings, and recovery window affect the responsible recommendation.

It does not claim universal skin-type suitability, no downtime, painless treatment, permanent results, guaranteed results, a fixed series, a rating, or current appointment availability.

## Structured data

The page emits:

- one `Service` entity for laser and light-based aesthetic care in Vacaville;
- one `MedicalBusiness`/`DaySpa` entity using the existing Vacaville location ID;
- one `FAQPage` built from the same six questions rendered visibly.

It emits no rating, review, aggregate rating, offer, or availability promise.

## Verification

- 301 automated tests passed across 26 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 optimized build generated 42 routes, including `/vacaville/laser`.
- Legacy migration crawl passed for 31 moved WordPress URLs and 2 preserved public records.
- Sitemap regenerated with 31 indexable pages.
- Internal crawl passed across 31 pages and 41 unique destinations.
- Booking crawl passed across 12 unique external destinations, including 7 Boulevard paths.
- SEO crawl passed across 31 pages, 13 social images, and 39 structured-data blocks.
- Desktop QA passed at 1280 × 900 with one H1, no browser errors, and no horizontal overflow.
- Mobile QA passed at 390 × 844 with one H1, no browser errors, no horizontal overflow, and the `Book Laser Consult` fixed action.
- A real preview click reached the live `Initial Laser Consult` screen with `Select a professional`; it did not render the menu, `#/not-found`, or “things have moved.”

## Production gate

Before cutover or paid traffic, repeat the Vacaville laser click on the exact deployment in a clean browser and in a browser that previously began a Napa journey. Fail the launch if Boulevard shows the wrong clinic, a different service, `#/not-found`, an empty shell, or no `Select a professional` next step. Confirm the two public prices against the current approved menu immediately before promotion.
