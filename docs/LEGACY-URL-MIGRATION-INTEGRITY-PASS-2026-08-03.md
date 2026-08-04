# Legacy URL migration integrity pass — 2026-08-03

## Outcome

The revamp now has an intentional destination for Rella's live WordPress URL inventory instead of relying on search engines and patients to discover post-cutover 404s. A centralized migration map protects 31 moved paths, and a production-mode checker follows every trailing-slash source to its final page.

The two public records that should not be consolidated into marketing pages are preserved at their original paths:

- `/giveaway-terms-and-conditions` keeps the terms published for the October 2024 promotion, is marked `noindex, follow`, and is excluded from the acquisition sitemap;
- `/locations.kml` remains machine-readable KML and contains the approved address and hours for both clinics.

No production routing, DNS, deployment, search-console, advertising, booking, or CRM state was changed in this pass.

## Source inventory

The public Rank Math sitemap index was read on August 3, 2026:

- `page-sitemap.xml`: 36 page URLs;
- `post-sitemap.xml`: 8 article URLs;
- `local-sitemap.xml`: 1 KML URL.

Routes that already exist at the same public path—such as the homepage, Napa campaign pages, both clinic pages, Membership, Contact, Privacy, Cancellation Policy, and Blog—remain in place. Moved paths live in `legacy-redirects.json`, including two older navigation/archive routes discovered outside the current sitemap.

## Redirect decisions

### Service consolidation

Old WordPress treatment paths now resolve to the corresponding reviewed service guide:

- Botox and Dysport → `/services/botox`
- Dermal fillers → `/services/dermal-fillers`
- Medical weight loss → `/services/weight-loss`
- IV hydration → `/services/iv-hydration`
- Laser treatments → `/services/laser-treatments`
- HydraFacial → `/services/hydrafacial`
- Chemical peels → `/services/chemical-peels`
- Facials → `/services/facials`
- RF microneedling → `/services/microneedling`

### Company and conversion paths

- Company and Team → `/about`
- Become a VIP → `/membership`
- Testimonials and Before/After → `/gallery`
- FAQ and Treatments → `/services`
- Locations, Private Parties, Payment Plans, and the old Thank You state → `/contact`
- Old booking-received state → `/book`
- Terms and Conditions → `/terms`
- Upcoming Events → `/`

The old Payment Plans page contained only a heading and no public provider, eligibility, rate, or term details. It therefore routes to Contact instead of inventing a financing promise or mislabeling a membership as financing.

### Legacy articles

All eight WordPress article URLs now consolidate into the closest reviewed service guide. This preserves a relevant next step while preventing old pages from reintroducing claims the revamp deliberately removed, including immunity promises for IV infusions and overly broad treatment guarantees.

## Preserved public records

The giveaway page preserves the published eligibility, entry, prize, redemption, release, privacy, and promotion language. It is a historical public record, not an acquisition page, so it has a slashless canonical, one H1, `noindex, follow`, and no mobile booking bar. Substantive legal edits still require owner/counsel approval.

The KML endpoint returns `application/vnd.google-earth.kml+xml`, `noindex, follow`, both approved addresses, Vacaville Wednesday–Saturday 9am–5pm, Napa Tuesday–Saturday 9am–5pm, and the central phone number.

## Durable release check

Run against the exact optimized preview:

`SITE_URL=http://localhost:3010 npm run check:legacy-redirects`

The check fails when:

- a moved slashless URL does not return a permanent redirect;
- the first redirect does not name the audited destination;
- the trailing-slash source does not finish on the audited path with a successful response;
- the preserved giveaway record does not load or loses `noindex, follow`;
- the KML endpoint does not load as KML or loses either clinic address.

## Verification

- 294 automated tests passed across 25 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 optimized build generated 41 routes.
- Legacy migration crawl passed for 31 moved WordPress URLs and 2 preserved public records.
- Sitemap stayed focused on 30 indexable acquisition/information pages.
- Internal crawl passed across 30 pages and 40 unique destinations.
- Booking crawl passed across 11 unique external destinations.
- SEO crawl passed across 30 pages, 13 social images, and 36 structured-data blocks.
- The preserved giveaway page passed desktop semantic review and mobile QA at 390 × 844 with one H1, no horizontal overflow, no browser errors, no fixed booking bar, and `noindex, follow`.

## Production gate

Run the migration check on the exact deployed preview and again immediately after cutover. Spot-check Search Console's highest-click legacy URLs, confirm the giveaway record retention decision with owner/counsel, and submit only the new sitemap after the public host is verified. Do not publish the old Rank Math sitemap index after cutover.
