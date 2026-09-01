# Vacaville chemical-peels acquisition pass — 2026-08-03

## Outcome

Rella now has a dedicated, indexable `/vacaville/chemical-peels` page for local peel searches. It publishes the four options verified in the live Vacaville menu, explains selection and recovery planning, and routes every booking action to the working Vacaville menu.

No unverified starting price, universal candidacy statement, fixed downtime, fixed treatment series, rating, availability promise, or Napa peel claim was added. No deployment, ad campaign, budget, booking, CRM record, DNS, or production setting was changed.

## Why this page was next

A current search for chemical peels in Vacaville surfaced dedicated local competitor pages from [Glow Medspa](https://getglow.org/services/medical-grade-chemical-peels-in-vacaville-ca/), [Exceptional Aesthetics](https://www.exceptionalaestheticsmedspa.com/), and [Hourglass Beauty Bar](https://hgbeautyb.glossgenius.com/services). Rella's visible result was the [legacy broad chemical-peels page](https://experiencerella.com/chemical-peels/), which still describes both clinics, stale shared hours, deep-peel categories, and broader outcome language.

Search results change and do not guarantee ranking. This snapshot established a local-intent gap; it did not justify copying competitor claims or prices.

## Live Vacaville menu evidence

The page's booking action opened Boulevard's location-pinned Vacaville `Menu` screen. Selecting the visible `Peels` category then rendered exactly:

- MicroPeel Sensitive;
- MicroPeel Plus 20;
- TCA Peel;
- Universal Peel.

The page publishes those names and no others. The prior direct `/cart/menu/Peels` URL had rendered Boulevard's not-found state when loaded externally, so the public CTA deliberately keeps the proven two-step path: open the location-pinned menu, then choose Peels. No peel was selected, no form was filled, and no appointment was created during verification.

## Acquisition and discovery path

- Canonical: `https://experiencerella.com/vacaville/chemical-peels`
- Clinic: Rella Aesthetics, 542 Main St, Vacaville, CA 95688
- Published hours: Wednesday–Saturday, 9am–5pm
- Booking handoff: Vacaville location ID plus `/cart/menu`
- Visitor instruction: choose the visible Peels category in the live menu
- Mobile action: `Open Peel Menu`, using the same location-pinned destination

The Vacaville clinic page now links to the local guide. The shared chemical-peel guide sends its Vacaville details action to this page while retaining the same Vacaville-only availability boundary.

## Content and claim boundaries

The page helps a visitor compare the current menu without assigning unverified strength, formulation, candidacy, or outcome claims to any option. It asks visitors to review current products, medications, sensitivities, recent procedures, sun exposure, important dates, preparation, and expected recovery with the provider.

Pricing remains consultation-led because the approved public canon does not establish one exact current price across the four options. The page explicitly says the exact service and total must be reviewed before treatment rather than borrowing a competitor price or inventing a starting amount.

## Structured data and measurement

The route emits one Vacaville `Service`, the existing Vacaville `MedicalBusiness`/`DaySpa`, and one `FAQPage` whose six answers match visible copy. It emits no offer, price, rating, review count, or availability promise.

All three booking actions use the existing privacy-minimized booking-intent classification. The mobile action preserves the same destination and does not include patient, treatment-history, or form data in the event payload.

## Verification

- 314 automated tests passed across 28 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 production build generated 44 routes, including `/vacaville/chemical-peels`.
- Legacy migration check passed for 31 moved WordPress URLs and 2 preserved public records.
- Sitemap regenerated with 33 indexable pages.
- Internal crawl passed across 33 pages and 43 unique destinations.
- Booking crawl passed across 33 pages and 13 unique external destinations.
- SEO crawl passed across 33 pages, 13 social images, and 45 structured-data blocks.
- Desktop review passed at 1440 × 1000 with one H1 and a clean two-column hero.
- Mobile review passed at 390 × 844 with one H1, stacked CTAs, readable copy, and the fixed `Open Peel Menu` action.
- A real preview click reached Boulevard's live Vacaville menu; selecting Peels rendered all four published options.

## Production gate

Before cutover, repeat the menu click from the exact deployment in both a clean browser and a browser that previously began a Napa journey. Fail the launch if Boulevard opens Napa, renders `#/not-found`, omits Peels, or lists a menu that no longer matches the page. Reconfirm clinic hours, current peel inventory, exact pricing, clinical copy, and provider capacity with Dr. Wagner and the operating team.
