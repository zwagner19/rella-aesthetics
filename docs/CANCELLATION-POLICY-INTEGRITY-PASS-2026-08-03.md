# Cancellation-policy integrity pass — 2026-08-03

## Outcome

The rebuild now preserves the current public cancellation-policy route and removes a material policy contradiction from the draft Terms page.

This is an operational-policy correction, not legal approval. Rella Aesthetics-specific Terms and a complete website/privacy policy still require counsel before production cutover.

## Source boundary

The published policy is limited to facts supported by both current public evidence and the binding July 26 fact closure:

- give at least 48 hours' notice;
- Rella may retain the applicable deposit for cancellation inside 48 hours;
- emergencies are reviewed individually;
- Boulevard charges a $50 booking deposit for the Napa new-patient tox visit;
- that deposit is separate from per-unit treatment pricing;
- no promise is made that the deposit is credited, applied, refundable, or transferable.

The general policy refers to the applicable booking deposit without inventing a universal amount. The exact $50 statement is visibly scoped to the Napa new-patient tox appointment, which is the only booking path for which that amount is binding in the source record.

The existing draft Terms page had instead claimed a sitewide 24-hour window and an unspecified late/no-show fee. Those statements were unsupported and have been removed. Terms now links to the source-backed cancellation policy and defers appointment-specific details to the booking journey or applicable agreement.

## Routes and search behavior

- New canonical route: `/cancellation-policy`
- Legacy public path `/cancellation-policy/` resolves through normal trailing-slash handling after full-site cutover.
- `/terms-and-conditions/` continues to redirect to `/terms`.
- The cancellation route is included in the generated sitemap.

## Regression contract

`src/app/(site)/legal-policy-integrity.test.tsx` verifies:

- the approved cancellation statement renders verbatim;
- 48 hours, emergency review, and the Napa $50 deposit boundary are visible;
- no 24-hour or generic `subject to a fee` language remains;
- no credited/applied/refundable/transferable deposit promise is added;
- Terms links to the policy;
- canonical, telephone, and contact paths are stable;
- the page has one H1.

Responsive browser QA at 390 × 844 also exposed that the fixed booking bar could cover the footer legal links at the end of the page. The ordinary-site footer now reserves mobile bottom clearance for the bar while retaining the original desktop spacing; the regression suite pins that clearance class.

## Still blocked for production

Counsel or an approved policy source must supply and approve:

1. Rella Aesthetics-specific Terms for the med-spa business and its actual entity structure.
2. A complete website/privacy policy covering the real analytics, advertising, CRM, booking, chat, cookie-consent, call-tracking, and health-adjacent inquiry flows.
3. The correct relationship to any Notice of Privacy Practices and the appropriate California privacy disclosures.
4. Final policy contacts and effective dates.

Until that happens, the repository can be previewed and tested, but the legal-page gate is not satisfied for production traffic or advertising expansion.
