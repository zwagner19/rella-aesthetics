# Napa local acquisition build — 2026-08-03

## Outcome

The Next.js rebuild now preserves the complete set of Napa URLs already used by Google Ads and local search:

- `/napa/`
- `/napa/botox/`
- `/napa/filler/`
- `/napa/laser/`
- `/napa/hydrafacial/`
- `/napa/hyperhidrosis/`

Before this pass, only `/napa/botox/` existed in the new site. A full-site cutover would therefore have sent live Brand, Filler, Laser, HydraFacial, and Hyperhidrosis traffic to missing routes.

No deployment, ad edit, campaign-state change, billing action, environment change, push, merge, or public cutover was performed.

## What was built

### Napa hub

The new `/napa/` route is an indexable, campaign-focused location hub with:

- the Napa address and campaign-approved operating schedule above the fold;
- direct paths to all five service pages;
- a Napa-scoped Boulevard fallback rather than a generic or Vacaville booking path;
- Zachary Wagner, DO identified as Physician Owner;
- the American Board of Obesity Medicine diplomate credential, explicitly framed as relevant to medical weight management rather than as an aesthetic specialty;
- local MedicalBusiness/DaySpa structured data without ratings or review-count claims.

### Filler

`/napa/filler/` replaces the old promotional amounts with the binding 2026 canon:

- $840 base service amount;
- active product range $540–$960;
- exact Napa Dermal Fillers Boulevard service preselection;
- consult-and-plan-first messaging with no result guarantee.

### Laser

`/napa/laser/` now distinguishes IPL from CO2 CoolPeel and publishes only verified full-face prices:

- IPL Full Face $420;
- CO2 CoolPeel Full Face $1,440;
- Napa Laser category preselection;
- candidacy, sun-exposure, timing, and downtime language without promising a fixed series.

### HydraFacial

`/napa/hydrafacial/` removes the old mention-at-checkout coupon and presents the current menu:

- Signature $240 / 45 minutes;
- Deluxe $300 / 45 minutes;
- Platinum $390 / 75 minutes;
- verified Napa Signature HydraFacial preselection.

### Excessive sweating

`/napa/hyperhidrosis/` closes the prior mixed-message defect. The previous page discussed both MiraDry and Botox while routing every visitor into a MiraDry service. The rebuilt page:

- discloses the active MiraDry amount of $2,400 and 60-minute service length;
- books the verified Napa New Patient Consult first;
- does not link an archived or rotating special;
- does not silently route the visitor into the cosmetic-tox cart;
- uses private, non-shaming language.

## Booking and measurement map

| Page | Booking destination | Campaign signal |
|---|---|---|
| `/napa/` | Napa-scoped Boulevard menu | `booking_start` / `napa-med-spa` |
| `/napa/botox/` | hardened Napa Botox booking app | `booking_start` / `botox` |
| `/napa/filler/` | Napa Dermal Fillers service | `booking_start` / `filler` |
| `/napa/laser/` | Napa Laser category | `booking_start` / `laser` |
| `/napa/hydrafacial/` | Napa Signature HydraFacial | `booking_start` / `hydrafacial` |
| `/napa/hyperhidrosis/` | Napa New Patient Consult | `booking_start` / `hyperhidrosis` |

Every Book action on each page resolves to one destination. Every Book action emits the existing `data-gtm="booking_start"` and service label expected by the Napa GTM implementation. No patient fields or form contents are added to campaign analytics.

## Internal discovery and SEO

- The main Napa location page now links directly to the Napa Botox, Filler, Laser, and HydraFacial pages instead of only sending local visitors to dual-location service pages.
- Every new route has a unique title, description, canonical, Open Graph URL, index/follow directive, Service structured data, and visible FAQ content that matches its FAQ schema exactly.
- The sitemap gives the complete `/napa/*` set high priority.
- The legacy `/hydrafacial/` and `/terms-and-conditions/` public paths now redirect to their current Next.js routes after a full-site cutover.

## Verification

- 241 automated checks passed across 16 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 production build generated 32 routes, including all six Napa acquisition routes.
- Sitemap regenerated.
- Release crawl passed across 26 sitemap pages and 34 unique internal destinations.
- The optimized local preview is running at `http://localhost:3010` from this exact build.

## Operating state that controls activation

Source: `Marketing/Google Ads/Napa Campaign/06 Daily Optimization Log.md`, entry dated 2026-08-03.

### Immediate red item — billing

Google Ads reportedly sent a suspension-risk notice at 06:49 PT on August 3 for an **$893.82 past-due balance**. The July 30 payment decline had not been confirmed resolved. Website work cannot compensate for suspended delivery.

Owner action required before campaign optimization:

1. Pay or reconcile the $893.82 Google Ads balance.
2. Replace or fund the failing payment method.
3. Confirm the account no longer shows suspension risk.
4. Recheck related Google Workspace and Voice payment failures described in the same operating log.

### Napa campaign state as recorded August 3

- Enabled: Brand $5/day, Botox-Dysport $40/day, Laser $25/day, Filler $12/day.
- Paused: HydraFacial and Hyperhidrosis.
- Enabled Napa-build budget total: $82/day, within the approved $100/day ceiling.
- Last seven days: $499.23 spend, 108 clicks, 5 booking-CTA conversion credits, $99.85 per booking-CTA credit, and zero qualified calls visible.
- Life to date through August 2: $1,499.20 spend, 330 clicks, 18.84 booking-CTA conversion credits, $79.58 per booking-CTA credit.

These are **booking-button signals**, not completed appointments or collected revenue. Boulevard reconciliation remains mandatory before calling this profitable.

### Separate weight-loss spend requiring owner confirmation

The same August 3 log records legacy Vacaville and Napa weight-loss campaigns enabled for an eighth day without documented confirmation. Their budgets total $115/day, outside the six Napa-build campaigns, and recent terms include informational or poorly matched searches. Confirm whether this spend is intentional before making any optimization claim.

## Activation sequence

1. Resolve the Ads billing risk and confirm the intended weight-loss campaign states.
2. Deploy this exact commit to a preview with production-like GTM and booking configuration.
3. Verify all six `/napa/*` routes return 200 on that deployment.
4. Test one CTA per route and confirm the clinic and service are correct.
5. Verify one `booking_start` event per click with no personal or health data.
6. Reconcile completed appointments in Boulevard rather than optimizing to CTA clicks alone.
7. Cut over the public routes only after explicit owner approval and a rollback target are documented.
8. Keep HydraFacial paused until Natalie Molina's book is reviewed; resume only if capacity and search-term quality support it.
9. Keep Hyperhidrosis paused until the team approves the consult-first message and the desired MiraDry offer strategy.

## Next revenue layer

Once the billing and preview gates are closed, the highest-value next work is not another design pass. It is measurement and conversion operations:

- connect source → booking → arrival → collected revenue at an aggregate campaign/service level;
- audit answer rate, missed-call text-back, and response time;
- reconcile HighLevel website leads against accepted CRM records;
- rebuild paid-search decisions around arrived-patient CAC rather than booking-button clicks;
- then expand the proven service/location pages into supporting local education content.

## Source basis

- `Marketing/Google Ads/Napa Campaign/01 Napa Capacity Map.md`
- `Marketing/Google Ads/Napa Campaign/03 Performance Scoreboard.md`
- `Marketing/Google Ads/Napa Campaign/06 Daily Optimization Log.md`
- `Marketing/Google Ads/Napa Campaign/08 Landing Page and Funnel Audit.md`
- `Marketing/Google Ads/Napa Campaign/10 Landing Page Copy - Napa.md`
- `Marketing/Google Ads/Napa Campaign/11 SEO and Local SEO Plan.md`
- `Marketing/Landing System Design Handoff/BOULEVARD-URL-WIRING.md`
- `Website Revamp/reference/RELLA-PUBLIC-PRICING-CANON-2026-07-24.md`
- `Website Revamp/runs/2026-07-23/HYPERHIDROSIS-MAPPING-VERDICT.md`
