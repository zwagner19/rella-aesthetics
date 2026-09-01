# IV Hydration booking-friction pass — 2026-08-03

## Outcome

The shared `/services/iv-hydration` page now preserves both service intent and clinic intent. After a visitor chooses Napa or Vacaville, each booking action opens that clinic's live `IV Hydration` category instead of the broad clinic menu.

| Clinic choice | Previous handoff | Current verified handoff |
| --- | --- | --- |
| Napa | Napa `/cart/menu` | Napa `/cart/menu/IV Hydration` |
| Vacaville | Vacaville `/cart/menu` | Vacaville `/cart/menu/IV Hydration` |

This removes one menu-selection step without guessing a formulation or claiming that IV care is appropriate before screening.

## Rendered inventory evidence

The category path was rendered in Boulevard for both location IDs:

- Napa: `91eba843-57fb-49e9-8505-431d501ffec7`
- Vacaville: `0f146f87-364e-4dfd-b938-61ba49528820`

Each screen displayed the `IV Hydration` heading and the same six choices:

- Myers' Cocktail
- Hangover Cure
- Immunity Blend
- Beauty/Glow Blend
- Migraine/Pain Relief
- NAD + Therapy

No formula, professional, add-on, appointment, or form field was selected. No appointment or patient record was created.

## Clinical and claim boundary

The website continues to describe IV care around health screening, monitored administration, individualized formulation, variable experience, and current-total review. It does not repeat the Boulevard labels `Hangover Cure`, `Immunity Blend`, or `Migraine/Pain Relief` in acquisition copy, metadata, FAQ, or structured data.

A live vendor listing is evidence of a booking route, not clinical or advertising approval. Dr. Wagner should review the current Boulevard names and descriptions before IV promotion, especially any language that could imply disease treatment, symptom relief, immune benefit, guaranteed effect, or suitability without screening. The public route should remain available for organic visitors, but no paid IV campaign should be expanded from this work alone.

## Routing and measurement contract

- `iv-hydration` resolves to `/cart/menu/IV Hydration` only after a clinic is explicit.
- Locationless IV intent still opens the first-party clinic chooser.
- Napa and Vacaville route tests require their respective location IDs and forbid cross-city routing.
- The shared IV page test requires both category URLs and forbids the three highest-risk vendor labels from rendered website copy.
- An outbound click is measured only as booking intent, never as an appointment, arrival, or revenue event.
- No name, contact detail, health information, formula choice, or form content enters the website analytics payload.

## Verification

- 345 automated checks passed across 31 test files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 optimized build generated 47 routes.
- Legacy crawl passed with 31 moved routes and 2 preserved public records.
- Internal crawl passed across 36 pages and 46 unique destinations.
- Booking crawl passed across 36 pages and 20 unique external destinations.
- SEO crawl passed across 36 pages, 13 social images, and 54 JSON-LD blocks.
- Both live city-pinned category routes rendered the `IV Hydration` heading and six selectable formulas without a not-found state.

## Production gate

On the exact deployment commit, repeat both category clicks in a clean browser and in a returning browser that previously began a journey at the other clinic. Fail the launch if Boulevard shows the wrong clinic, `#/not-found`, “things have moved,” an empty shell, or no formula list. Complete Dr. Wagner's review of the Boulevard names and descriptions before any IV promotion.

No deployment, push, merge, service selection, form submission, appointment creation, ad/account change, billing action, campaign mutation, or public cutover was performed.
