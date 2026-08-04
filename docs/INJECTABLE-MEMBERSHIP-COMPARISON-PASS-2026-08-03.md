# Injectable membership comparison pass — 2026-08-03

## Outcome

The Membership page now compares the three source-backed 2026 injectable memberships:

| Plan | Monthly dues | Core member rates |
| --- | ---: | --- |
| Tox | $30 | Botox $13/unit; Dysport $4.40/unit |
| Filler | $40 | Restylane $600/syringe; Juvederm $600 or $700 by product |
| Tox + Filler | $50 | Tox rates plus Restylane $600 and Juvederm $600–$700 |

All three clearly state the one-year commitment and 10% retail benefit.

No deployment, membership enrollment, Boulevard change, CRM submission, ad edit, campaign-state change, billing action, environment change, push, merge, or public cutover was performed.

## Source decision

Binding source:

`PROJECTS/Website-Rebuild-Evidence/19-pricing-and-membership-canon.md`

The record is based on the approved public Rella Memberships PDF and the July 15 owner decision. It supersedes the old $20 Tox plan and unsupported legacy rates.

The previous rebuild page correctly removed the obsolete plan but then stated that Tox was the one current public membership. That was too narrow: the same binding source also establishes Filler and Tox + Filler.

## Material terms now visible

- Tox and Filler each include one complimentary Signature HydraFacial.
- Tox + Filler includes one complimentary Deluxe HydraFacial.
- The included HydraFacial is redeemable after six months of on-time payments, or immediately if the full membership year is paid in advance.
- All three plans include 10% off retail.
- All three are one-year commitments.
- Product choice and treatment plans remain subject to individual clinical assessment, with the proposed total reviewed before treatment.

No “most popular” claim was added because no source establishes plan popularity.

## Conversion path

Every plan routes to `/contact` with `Ask About Membership`; no enrollment URL was invented. The contact form now includes `Membership Questions` as a service-interest option, so the existing HighLevel workflow can preserve an `interest-membership-questions` tag when a real inquiry is accepted.

The homepage banner and navigation now describe the broader injectable comparison without crowding the homepage with the full rate table.

## Deliberate scope boundary

This page covers injectable aesthetic memberships only. Separately reviewed medical, weight-management, hydration, and wellness membership claims are not mixed into the page. They require their own clinical, operational, and conversion review before publication.

## Verification

- 262 automated checks passed across 19 test files.
- Membership contracts verify all three dues, exact member rates, HydraFacial tiers and timing, 10% retail, one-year terms, absence of popularity claims, and three `/contact` inquiry routes.
- The contact-form contract verifies the Membership Questions option exists.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 production build generated 33 routes.
- Sitemap regenerated.
- Internal release crawl passed across 27 sitemap pages and 36 unique internal destinations.
- External booking check passed across 12 unique booking destinations.
- Optimized `/membership` returned HTTP 200 with all three plans and all three inquiry paths.
- The optimized local preview is running at `http://localhost:3010` from this exact build.

## Production acceptance

1. Confirm the approved public Memberships PDF remains the current enrollment offer.
2. Confirm the exact product-specific Juvederm member mapping with the team before cutover.
3. Submit one synthetic `Membership Questions` inquiry on the production-like preview and confirm its HighLevel service field and interest tag.
4. Confirm staff know the included HydraFacial timing and do not promise immediate redemption unless the full year is prepaid.
5. Confirm the current agreement shown at enrollment matches the one-year and benefit terms on the page.
