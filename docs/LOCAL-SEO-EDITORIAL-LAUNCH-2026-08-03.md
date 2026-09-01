# Napa local SEO editorial launch — 2026-08-03

## Outcome

The rebuild now includes its first complete local-search article:

- `/blog/botox-cost-napa`
- public title: **Botox in Napa: 2026 Pricing, Membership, and What to Expect**
- search title: **Botox Cost in Napa: 2026 Pricing Guide**

The article answers the high-intent pricing question directly, routes ready visitors into the hardened Napa Botox booking path, and connects readers to the Napa treatment, membership, service, and location pages.

No deployment, domain change, ad edit, campaign-state change, billing action, environment change, push, merge, or public cutover was performed.

## Content and claim controls

The published copy is pinned to the approved July 24, 2026 public pricing canon and the approved July 26 Napa tox operating decisions. It states:

- Botox®: $18 per unit;
- Dysport: $6 per unit;
- 2026 Tox Membership: $30 per month with a one-year commitment;
- member Botox: $13 per unit;
- member Dysport: $4.40 per unit;
- new-patient booking deposit: $50, separate from treatment pricing;
- new-patient visit: 30 minutes;
- Napa location: 1541 3rd St, Napa, CA 94559;
- phone: (707) 358-2928.

The membership section makes the arithmetic transparent without turning it into a treatment recommendation. It identifies the annual dues as $360 and explains that the current price difference reaches $360 at 72 Botox units or 225 Dysport units across a year. It explicitly says that actual product, units, timing, and eligibility vary.

The article does not publish a universal treatment total, compare Botox and Dysport units one-for-one, promise same-day or near-term availability, invent a deposit-credit policy, or add ratings, review counts, awards, or guaranteed outcomes.

## Durable publishing system

The long-term CMS remains Sanity. The site now also has a controlled file-backed editorial layer so approved acquisition content remains available in production builds when Sanity is absent or temporarily unreachable.

Rules enforced in code:

1. Approved local articles are always included in the blog index and static route list.
2. A local slug takes precedence over a CMS record with the same slug until an intentional migration removes the local source.
3. Sanity articles continue to merge into the index when the CMS is configured.
4. A Sanity outage does not remove the approved local article or fail the site build.

This is a resilience layer, not permission to mass-publish thin pages. Each local article still requires a binding fact source, a defined search intent, visible value, claim review, and a verified conversion path.

## Search presentation and structured data

The article includes:

- a unique canonical at `https://experiencerella.com/blog/botox-cost-napa`;
- Article, FAQPage, and BreadcrumbList structured data;
- an Organization author rather than an invented individual byline;
- six visible FAQs that exactly match the FAQ structured data;
- no Review, AggregateRating, Offer, or price schema;
- a bespoke 1731 × 909 Open Graph/X share image at `/images/og-botox-cost-napa.png`;
- a sitemap entry with the public article URL.

The production-mode response was checked directly: the article returned HTTP 200, the image returned HTTP 200 as `image/png`, and the canonical, Open Graph image, and X image tags resolved to the public domain.

## Booking and measurement

Every article Book action resolves to:

`https://book.experiencerella.com/book/napa/botox`

The ordinary-site conversion classifier now recognizes `book.experiencerella.com` as a booking host. This closes a measurement gap: a click from the article or another ordinary marketing page can now emit booking intent without collecting or transmitting patient information.

The mobile action bar is context-aware on the article and uses the same Napa Botox destination and label. Booking clicks remain intent signals, not completed appointments or revenue.

## Verification

- 251 automated checks passed across 17 test files.
- The editorial contract verifies the current price set, membership math, local facts, one H1, internal links, booking path, visible/schema FAQ parity, Organization author, and absence of stale offers and rating schema.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 production build generated 33 routes and statically rendered `/blog/botox-cost-napa`.
- Sitemap regenerated and includes the article.
- Release crawl passed across 27 sitemap pages and 36 unique internal destinations.
- The optimized local preview is running at `http://localhost:3010` from this exact build.

## Controlled editorial backlog

Publish only after the relevant treatment facts and claims are reviewed:

1. September: IPL vs. CO2 CoolPeel in Napa — candidacy, downtime, and verified full-face prices.
2. October: HydraFacial tiers in Napa — Signature, Deluxe, and Platinum comparison.
3. November: Excessive-sweating options in Napa — consult-first decision guide without mixing MiraDry and cosmetic-tox booking paths.

The next immediate revenue step is not publishing all three at once. It is deploying and measuring this article, reconciling booking intent to Boulevard appointments and arrivals, then using real search and conversion data to choose the next article.

## Activation sequence

1. Resolve the Google Ads past-due balance and suspension risk recorded on August 3.
2. Confirm the intended state and budget of the separate Napa and Vacaville weight-loss campaigns.
3. Deploy this exact commit to a preview with production-like analytics and booking configuration.
4. Verify the article, share image, mobile action bar, and Napa booking app on the preview.
5. Confirm one booking-intent event per click with no personal or health information.
6. Obtain explicit owner approval before public cutover.
7. Request indexation only after the production URL returns 200 and the sitemap is public.
8. Reconcile search impressions, qualified calls, completed appointments, arrivals, and collected revenue; do not optimize from clicks alone.

## Source basis

- `Marketing/Google Ads/Napa Campaign/06 Daily Optimization Log.md`
- `Marketing/Google Ads/Napa Campaign/08 Landing Page and Funnel Audit.md`
- `Marketing/Google Ads/Napa Campaign/11 SEO and Local SEO Plan.md`
- `Marketing/Landing System Design Handoff/BOULEVARD-URL-WIRING.md`
- `Website Revamp/reference/RELLA-PUBLIC-PRICING-CANON-2026-07-24.md`
- approved Napa tox operating decisions dated 2026-07-26
