# Vacaville microneedling acquisition pass — 2026-08-03

## Outcome

Rella now has a dedicated, indexable `/vacaville/microneedling` page for local microneedling searches. It compares the two technologies verified in the live Vacaville menu, makes candidacy and recovery part of the decision, gives RF microneedling its own FDA-backed risk context, and sends every booking action directly to the modality-neutral Initial Microneedling Consult.

No unverified price, fixed treatment series, universal candidacy claim, no-downtime claim, guaranteed result, rating, or appointment-availability promise was added. No deployment, ad campaign, budget, booking, CRM record, DNS, or production setting was changed.

## Why this page was next

Current Vacaville search results included dedicated microneedling pages or offers from [Exceptional Aesthetics](https://www.exceptionalaestheticsmedspa.com/microneedling-offer), [Maven Haus](https://www.themavenhaus.com/), and [Blissfusion](https://www.blissfusionvacaville.com/facials). Rella had a shared treatment guide but no Vacaville-specific acquisition page, while its live menu exposed both standard and RF options plus a responsible consult-first handoff.

Search results change and do not guarantee ranking. This snapshot established a local-intent and message-match gap; it did not justify copying competitor claims, packages, or prices.

## Live Vacaville menu evidence

The location-pinned Vacaville menu rendered:

- Skin Stylus Microneedling;
- RF Microneedling;
- Initial Microneedling Consult;
- selected three-treatment packages;
- a Skin Stylus neck add-on.

The public page names the two treatment modalities and starts at the consult instead of choosing a device or package for the visitor. A real click from the exact optimized preview rendered `Initial Microneedling Consult`, its skin-evaluation and goal-discussion description, and `Select a professional`. No professional was selected, no form was filled, and no appointment was created.

The live Boulevard description currently ends with the stray words `right but`. That vendor-side copy defect does not break the handoff, but the owner should remove it in Boulevard before paid traffic.

## Acquisition and discovery path

- Canonical: `https://experiencerella.com/vacaville/microneedling`
- Clinic: Rella Aesthetics, 542 Main St, Vacaville, CA 95688
- Published hours: Wednesday–Saturday, 9am–5pm
- Booking handoff: Vacaville location ID plus `/cart/menu/Microneedling/<Initial Microneedling Consult ID>`
- Mobile action: `Book Initial Consult`, using the same verified destination

The Vacaville clinic page now links to the local guide. The shared microneedling guide sends its Vacaville details action to this page while preserving its explicit clinic-choice booking flow.

## Content and claim boundaries

The page distinguishes Skin Stylus microneedling from RF microneedling without treating them as interchangeable. Device, settings, indication, treatment area, health history, medications, active skin conditions, recent procedures, sun exposure, products, healing history, recovery, and number of procedures remain individualized.

The RF section links to the FDA's [Potential Risks with Certain Uses of Radiofrequency Microneedling](https://www.fda.gov/medical-devices/safety-communications/potential-risks-certain-uses-radiofrequency-rf-microneedling-fda-safety-communication) and plainly identifies the reported serious complications: burns, scarring, fat loss, disfigurement, and nerve damage. The page does not imply that every person or procedure will experience them.

Pricing stays consultation-led because the approved public canon does not establish one current price for the exact Vacaville modalities, areas, and packages.

## Structured data and measurement

The route emits one Vacaville `Service`, the existing Vacaville `MedicalBusiness`/`DaySpa`, and one `FAQPage` whose six answers match visible copy. It emits no offer, price, rating, review count, or availability promise.

All three page booking actions and the mobile action use the existing privacy-minimized booking-intent classification. The payload carries no patient, skin, treatment-history, or form data.

## Verification

- 321 automated tests passed across 29 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 production build generated 45 routes, including `/vacaville/microneedling`.
- Legacy migration check passed for 31 moved WordPress URLs and 2 preserved public records.
- Sitemap regenerated with 34 indexable pages.
- Internal crawl passed across 34 pages and 44 unique destinations.
- Booking crawl passed across 34 pages and 14 unique external destinations.
- SEO crawl passed across 34 pages, 13 social images, and 48 structured-data blocks.
- Desktop review passed at 1440 × 1000 with one H1, a clean two-column hero, and readable technology/risk sections.
- Mobile review passed at 390 × 844 with one H1, stacked CTAs, clean hero wrapping, and the fixed `Book Initial Consult` action.
- A real preview click reached Boulevard's live Vacaville Initial Microneedling Consult and displayed `Select a professional`.

## Production gate

Before cutover, repeat the click from the exact deployment in both a clean browser and a browser that previously began a Napa journey. Fail the launch if Boulevard opens Napa, renders `#/not-found`, omits the Initial Microneedling Consult, or lacks a selectable next step. Remove the stray `right but` text from the Boulevard service description. Reconfirm the exact device names, provider qualifications, current inventory, pricing, packages, material risks, and capacity with Dr. Wagner and the operating team before search or paid traffic is sent here.
