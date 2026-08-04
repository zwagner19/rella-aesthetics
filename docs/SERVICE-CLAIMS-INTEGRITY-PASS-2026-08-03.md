# Rella service-claims integrity pass — 2026-08-03

## Outcome

The shared treatment catalog now preserves useful conversion details while removing universal candidacy, guaranteed outcome, fixed recovery, and fixed-series language that was broader than the available evidence. The pass covers Botox/Dysport handoff language, dermal fillers, professional facials, HydraFacial, microneedling, IV hydration, and laser/light-based treatments.

Current Rella pricing, service tiers, location choices, and booking destinations remain intact. No deployment, ad campaign, budget, booking, CRM record, or production setting was changed.

## Evidence boundary

- The [FDA dermal-filler guidance](https://www.fda.gov/medical-devices/aesthetic-cosmetic-devices/dermal-fillers-soft-tissue-fillers) states that products have different uses and expected durations, identifies common temporary effects such as swelling and bruising, and warns that removal may be difficult or impossible for some materials.
- The [FDA microneedling guidance](https://www.fda.gov/medical-devices/aesthetic-cosmetic-devices/microneedling-devices) says authorized uses are device- and indication-specific, not everyone is an appropriate candidate, more than one procedure may be needed, and desired aesthetic improvement is not guaranteed.
- The [FDA medical-laser guidance](https://www.fda.gov/radiation-emitting-products/surgical-and-therapeutic-products/medical-lasers) identifies incomplete treatment, pain, infection, bleeding, scarring, and skin-color changes among potential risks.
- HydraFacial's [official FAQ](https://www.hydrafacial.com/pages/frequently-asked-questions) supports the branded cleanse, exfoliate, extract, and hydrate process. Rella's approved pricing canon and verified booking menu supply the Signature, Deluxe, and Platinum pricing and appointment lengths.

These sources define a responsible public-information boundary; they do not replace product labeling, device instructions, informed consent, or Dr. Wagner's final clinical review.

## Material corrections

### Dermal fillers

- Replaced guaranteed restoration/enhancement framing with anatomy-aware consultation language.
- Removed fixed 6–18 month, lip, and cheek duration ranges from the shared page.
- Replaced fixed treatment and bruising windows with product-, area-, technique-, and individual-specific expectations.
- Clarified that some hyaluronic acid filler may be reduced or dissolved when clinically indicated, but removal is not risk-free or universally possible.

### Facials and HydraFacial

- Removed `medical-grade` product generalizations, universal skin-type suitability, `zero downtime`, `immediate results`, and fixed monthly-frequency recommendations.
- Kept HydraFacial's verified process, three approved tiers, prices, and current appointment lengths.
- Added screening context for sensitivities, active concerns, recent procedures, home-care products, and event timing.
- Added variable recovery language for temporary flushing, sensitivity, dryness, irritation, or breakouts where relevant.

### Microneedling

- Removed fixed recovery, collagen-development, session-count, spacing, and maintenance schedules.
- Narrowed goals to the appearance of facial acne scars, facial lines/wrinkles, and other device-appropriate texture concerns.
- Added candidacy, medication, sun-exposure, device, depth, risk, and individual-response boundaries.

### IV hydration and laser/light-based services

- Removed fixed IV appointment and minimal-discomfort promises while preserving screening and monitored administration.
- Removed fixed IPL, hair-removal, and resurfacing series and downtime ranges.
- Added device-, setting-, area-, skin-, sun-, medication-, and event-specific planning.
- Added material laser-risk language without promising an outcome or a universal skin-type fit.

### Botox/Dysport handoff

- Preserved the separately reviewed temporary-improvement, product-specific onset, typical duration, pricing, and non-interchangeable-unit boundaries.
- Replaced blanket `minimal downtime`, immediate routine-return, and no-anesthesia language with individualized comfort, temporary-effect, aftercare, and activity guidance.

## Regression coverage

The service-catalog suite now rejects the removed promise patterns, including:

- zero/no downtime and immediate-result language;
- universal skin-type suitability;
- fixed filler-duration, microneedling-series, and laser-series statements;
- fixed laser-downtime statements;
- routine `purging`, universal combination-treatment, and filler-reversal safety language;
- immediate return-to-routine and no-anesthesia Botox language.

It also requires visible variable-response, candidacy, and laser-risk boundaries.

## Verification

- 308 automated tests passed across 27 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 production build generated all 43 routes.
- Legacy migration check passed for 31 moved WordPress URLs and 2 preserved public records.
- Internal crawl passed across 32 sitemap pages and 42 unique internal destinations.
- Booking crawl passed across 32 pages and 13 unique external destinations.
- SEO crawl passed across 32 pages, 13 social images, and 42 structured-data blocks.
- Mobile review passed at 390 × 844 for HydraFacial, dermal fillers, and laser treatments.
- Desktop review passed at 1440 × 1000 for the laser hero and detailed expectation section.

## Remaining production gate

Dr. Wagner must still review the finished public clinical copy and approve it before production cutover. Reconfirm product/device labeling, current menu inventory, service availability by clinic, pricing, and provider capacity immediately before launch. This checkpoint reduces known claims risk; it is not medical, regulatory, or legal approval.
