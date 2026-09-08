# Napa Funnel Expansion Preview

- Prepared: September 7, 2026
- Branch: `codex/napa-funnel-expansion-preview`
- Approved visual baseline: `dfcc22036b3f8c4b50c20d71564104f74d153534`
- Scope: preview-only Napa laser hair removal and medical facial funnels

## Decision

The two pages are ready for owner visual review, but they are not approved for
publication or paid traffic. They remain `noindex, nofollow`, are excluded from
the sitemap, and are intentionally outside the exact Napa Botox attribution
pilot.

## Live Booking Truth

A read-only inspection of `book.experiencerella.com` on September 7, 2026 found:

- The Napa laser category currently exposes only `Initial Laser Consult`, a
  complimentary 15-minute appointment. The landing page therefore sends every
  CTA to the Napa laser chooser and does not preselect a treatment, provider,
  or date.
- The Napa facial category currently exposes `Initial Skin Health Consult`
  (complimentary, 15 minutes), `Signature HydraFacial` (45 minutes), and
  `Deluxe HydraFacial` (45 minutes). The landing page sends every CTA to that
  category chooser.
- The approved booking flow did not expose a confirmed treatment total before
  date selection. No date was selected and no cart, payment, or appointment was
  created.

## Commercial And Capacity Evidence

The privacy-safe Napa Boulevard audit for September 1, 2025 through August 31,
2026 recorded:

| Family | Kept appointments | Kept rate | Repeat share | Median cadence | Positive closed subtotal | Recent providers |
|---|---:|---:|---:|---:|---:|---:|
| Laser hair removal | 94 | 87.0% | 83.3% | 43 days | $21,855 | 3 |
| HydraFacial | 299 | 75.1% | 28.2% | 42 days | $34,745 | 1 |

These figures establish historical commercial activity, not current open
seats, collected revenue, profit, or Google-attributed bookings. The current
next-14-day provider availability was not available, and the HydraFacial lane
is historically concentrated in one recent provider. Paid activation must be
capped to a fresh capacity pull.

## Search Demand Evidence

A fresh read-only Google Keyword Planner pull through Supermetrics on September
7, 2026 returned the following exact explicit-Napa planning estimates:

| Query | Average monthly searches | Competition | Top-of-page bid range |
|---|---:|---|---:|
| `facial napa` | 260 | High | $1.17-$3.50 |
| `laser hair removal napa` | 90 | High | $2.38-$35.04 |
| `med spa napa` | 70 | High | $2.25-$9.21 |
| `hydrafacial napa` | 30 | High | $2.05-$3.89 |
| `lip filler napa` | 30 | High | $2.52-$7.06 |

The same resource returned national-looking values for generic `near me`
queries despite a Napa location input. Those values are not used as Napa demand
evidence. The two preview pages were selected because they combine explicit
local search demand with observed Rella service delivery. Search estimates do
not forecast clicks or appointments.

## Pricing And Claim Boundary

- The pages publish no treatment price, discount, package, or promotion.
- Older catalog evidence is not repeated because the current first-party
  booking surface does not confirm those totals before date selection.
- The pages make no claim about appointment availability, visit count,
  downtime, outcome, provider credentials, or patient reviews.
- The laser page describes the small, medium, and large catalog structure, but
  directs visitors to the live consultation-first path for current details.

## Visual Boundary

The pages reuse the approved site layout, header, footer, typography, colors,
buttons, trust strip, FAQ, and reveal behavior. They use existing Rella-owned
assets already present in the approved repository:

- `public/images/clinic/napa-reception.webp`
- `public/images/treatments/laser-treatment.webp`
- `public/images/treatments/hydrafacial.webp`
- `public/images/treatments/facial.webp`

The rejected Napa house exterior and generic service-card stock imagery are not
used. Shared visual components and global styles are unchanged.

## Attribution Boundary

The existing paid-attribution controller remains exact-path limited to
`/napa/botox`. This branch does not widen it. The new pages contain no raw
`gclid`, `gbraid`, or `wbraid` forwarding and no Boulevard, JoinBLVD, Rella HQ,
cart, checkout, payment, outcome, or conversion-uploader code.

Before either page can receive paid traffic, its exact route must be added to a
separately approved consent-compatible attribution scope and pass controlled
capture, denial, revocation, booking-outcome, queue, and uploader QA. Landing
page publication must not be treated as conversion proof.

## Release Gates

1. Zach and Amie approve desktop and mobile screenshots.
2. Operations confirms the next 14 days of sellable Napa seats by exact service
   and provider.
3. The current service total, deposit rule, cancellation rule, and public copy
   are reconciled with Boulevard.
4. The exact new landing-page route receives a reviewed attribution controller
   and controlled end-to-end QA.
5. Google Ads uses exact and phrase service intent, a Napa-specific destination,
   and service-specific negatives; no broad mixed "laser" campaign is reused.
6. Publication, Ads activation, and budget changes receive separate approval.

## Explicit No-Go Ideas

- Do not send paid traffic to these previews yet.
- Do not infer that the Botox attribution pilot covers these paths.
- Do not publish stale laser or HydraFacial prices or promotions.
- Do not promise current availability from historical provider counts.
- Do not use the house exterior, stock service cards, invented reviews, or
  outcome claims.
- Do not use a generic or mixed laser campaign that can attract tattoo-removal
  or consumer-device searches.

No WordPress, production-domain, Ads, booking, Boulevard, Supabase, uploader, or
deployment state was changed while preparing this preview.
