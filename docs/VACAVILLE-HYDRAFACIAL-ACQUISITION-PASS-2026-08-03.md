# Vacaville HydraFacial acquisition pass — 2026-08-03

## Outcome

Rella now has a dedicated, indexable `/vacaville/hydrafacial` page for local HydraFacial searches. It does not duplicate the general HydraFacial guide or the existing Napa campaign page. It compares the three approved tiers and sends every booking action directly to the live Vacaville `Signature Hydrafacial` service.

No Google Ads campaign, budget, billing state, booking record, CRM record, deployment, DNS, or production route was changed in this pass.

## Why this page was next

Current searches for HydraFacial in Vacaville surfaced dedicated competitor pages from [Blissfusion Wellness Lounge](https://www.blissfusionvacaville.com/hydrafacial), [Glow Medspa](https://getglow.org/services/hydrafacials-in-vacaville-ca/), and other local providers. Rella's indexed result was the broad legacy two-city HydraFacial page rather than a Vacaville-specific pricing and booking journey.

The page closes that gap with substantive local information: three current prices, timing, tier-selection context, membership redemption boundaries, clinic details, six visible FAQs, and a rendered direct-booking path.

Search results change and do not guarantee ranking. This snapshot informed prioritization only.

## Live Vacaville inventory verification

The location-pinned Vacaville Boulevard menu rendered a live `Facials` category containing:

- Signature Hydrafacial;
- Deluxe Hydrafacial;
- Platinum Hydrafacial;
- Microdermabrasion, Express, Acne, and Dermaplaning facials;
- Initial Skin Health Consult;
- selected body-area Deluxe HydraFacial services.

The Signature service rendered its treatment description, current add-ons, and `Select a professional` next step. No professional was selected, no form was filled, and no appointment was created.

## Acquisition and booking path

- Canonical: `https://experiencerella.com/vacaville/hydrafacial`
- Clinic: Rella Aesthetics, 542 Main St, Vacaville, CA 95688
- Published hours: Wednesday–Saturday 9am–5pm
- Direct handoff: Vacaville location ID plus `/cart/menu/Facials/s_68b27f62-4a04-4f9f-953e-ec4b2918ad3d`
- Mobile action: `Book Signature`, using the same location-pinned service path

The Vacaville location page now links directly to this guide. The general HydraFacial page links to the Vacaville guide while preserving its separate location-pinned Napa Signature path. Unverified Vacaville services continue to use the safe clinic-menu fallback.

## Pricing, timing, and claim boundaries

Visible amounts and timings match the approved 2026 canon:

- Signature: $240 · 45 minutes
- Deluxe: $300 · 45 minutes
- Platinum: $390 · 75 minutes

The page explains the multi-step cleanse, exfoliation, extraction, and hydration sequence without promising a particular result. It asks visitors to share current skin condition, sensitivities, products, recent procedures, and event timing.

It does not revive the retired `$50 off` mention-at-checkout promotion. It does not claim no downtime, universal skin-type suitability, immediate results, guaranteed results, a rating, or current appointment availability.

The membership callout preserves the material timing boundary: the specified included HydraFacial is redeemable after six months of on-time payments, or immediately when the full membership year is prepaid. It links to the full one-year terms rather than turning an included service into a standalone promotion.

## Structured data

The page emits:

- one `Service` entity for HydraFacial in Vacaville;
- one `MedicalBusiness`/`DaySpa` entity using the existing Vacaville location ID;
- one `FAQPage` built from the same six questions rendered visibly.

It emits no rating, review, aggregate rating, offer, or availability promise.

## Verification

- 307 automated tests passed across 27 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 optimized build generated 43 routes, including `/vacaville/hydrafacial`.
- Legacy migration crawl passed for 31 moved WordPress URLs and 2 preserved public records.
- Sitemap regenerated with 32 indexable pages.
- Internal crawl passed across 32 pages and 42 unique destinations.
- Booking crawl passed across 13 unique external destinations, including 8 Boulevard paths.
- SEO crawl passed across 32 pages, 13 social images, and 42 structured-data blocks.
- Desktop QA passed at 1280 × 900 with one H1, no browser errors, and no horizontal overflow.
- Mobile QA passed at 390 × 844 with one H1, no browser errors, no horizontal overflow, and the `Book Signature` fixed action.
- A real preview click reached the live `Signature Hydrafacial` screen with `Select a professional`; it did not render the generic menu, `#/not-found`, or “things have moved.”

## Capacity and production gate

The prior August 3 ads audit recorded the HydraFacial campaign as paused pending a provider-book review. This page does not change that operating decision. Do not resume or expand HydraFacial paid traffic until the owner confirms current Vacaville provider capacity, acceptable appointment lead time, and intended budget.

Before cutover or any approved promotion, repeat the Signature click on the exact deployment in a clean browser and in a browser that previously began a Napa journey. Fail the launch if Boulevard shows the wrong clinic, a different service, `#/not-found`, an empty shell, or no `Select a professional` next step. Reconfirm the three prices and timings against the current approved menu.
