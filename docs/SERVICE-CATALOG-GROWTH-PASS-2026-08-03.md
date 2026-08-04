# Rella Service Catalog Growth Pass — 2026-08-03

## Outcome

The eight ordinary treatment pages now use the same premium, booking-focused design system as the medical-weight-loss and location pages. The pass also removes material public pricing contradictions and unsupported acquisition claims found during the redesign.

## Pages rebuilt

- Botox & Dysport
- Dermal Fillers
- Chemical Peels
- Facials
- HydraFacial
- Microneedling
- IV Hydration
- Laser Treatments

Each page now includes:

- a local Vacaville/Napa hero with real service photography;
- a visible booking action and a clear secondary education path;
- physician-owned and local trust cues;
- treatment overview and common-goal sections;
- a structured visit sequence;
- transparent pricing or an explicit price-review process;
- Napa and Vacaville location links;
- visible FAQ content plus matching FAQ structured data;
- Service structured data, canonical metadata, and a social-share image;
- contextual mobile booking text for the service being viewed.

## Pricing reconciliation

Authoritative source: `RELLA-PUBLIC-PRICING-CANON-2026-07-24.md` in the transferred Website Revamp reference set.

Published exact prices now match that binding canon:

| Service | Published pricing |
| --- | --- |
| Botox & Dysport | Botox $18/unit; Dysport $6/unit |
| 2026 Tox Membership | $30/month; one-year commitment; Botox $13/unit; Dysport $4.40/unit |
| 2026 Filler Membership | $40/month; one-year commitment; Restylane $600; Juvederm $600–$700 |
| 2026 Tox + Filler Membership | $50/month; one-year commitment; combined Tox and filler rates |
| Dermal Fillers | $840 base; active products $540–$960 |
| HydraFacial | Signature $240; Deluxe $300; Platinum $390 |
| Laser | IPL Full Face $420; CO2 CoolPeel Full Face $1,440 |

The following exact prices were removed because they are not present in the binding public canon:

- chemical peel starting price;
- facial starting price;
- microneedling starting price;
- IV starting price;
- laser-hair-removal and Erbium starting prices.

Those pages now promise to review the current service and total before treatment instead of publishing an unverified number.

## Membership correction

The prior membership page mixed prohibited legacy and unsupported acquisition terms:

- $20/month legacy Tox plan;
- $10/unit Botox;
- $3.33/unit Dysport;
- filler plans and rates not established by the binding public canon;
- three-month/cancel-anytime language that contradicted the approved one-year commitment.

The page initially narrowed itself to Tox while the full public-membership source was being reconciled. The completed follow-on now compares the approved Tox, Filler, and Tox + Filler plans, including the material HydraFacial redemption condition and one-year terms. Legacy members are still directed to contact Rella for their account-specific plan. See `docs/INJECTABLE-MEMBERSHIP-COMPARISON-PASS-2026-08-03.md`.

## Claims cleanup

- Removed IV claims for immunity, hangover relief, guaranteed/immediate wellness effects, and 100% absorption.
- Reframed IV care around screening, monitored administration, individualized formulation, and variable experience.
- Removed unconfirmed filler marketing for under-eye and chin treatment areas.
- Removed an unverified microneedling growth-factor step.
- Replaced the broad laser skin-type statement with device-, setting-, goal-, and skin-type-specific suitability language.

## Verification

- Automated catalog tests cover all eight pages, all service images, booking actions, canon pricing, prohibited legacy figures, metadata, and structured data.
- Full test suite: 203 passing tests.
- Full lint: passed.
- Production build: passed and generated 27 pages.
- Sitemap generation: passed.
- Visual review completed for desktop Botox, mobile IV Hydration, and the corrected mobile membership page.
- The rendered mobile IV page visibly resolves its persistent action to “Book IV Hydration.”

## Remaining approvals

1. Confirm all non-price clinical descriptions, candidacy language, timing, downtime, and expected-duration statements with the clinical owner.
2. Confirm whether each service is offered at both locations or whether service/location overrides are needed.
3. Confirm current provider capacity before launching or expanding paid campaigns by service.
4. Confirm the public prices in Boulevard immediately before production release; the July 24 canon remains the controlling website source until deliberately superseded.
5. Approve a preview deployment before production cutover.
