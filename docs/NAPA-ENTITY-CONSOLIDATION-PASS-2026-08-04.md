# Napa search-entity consolidation pass — 2026-08-04

## Outcome

The Napa clinic page, Napa service hub, and every focused Napa acquisition page now describe one canonical downtown clinic entity instead of minting two competing location identities.

The clinic-details page and service-discovery hub also have distinct search intent:

| Route | Search job | Title |
| --- | --- | --- |
| `/locations/napa` | Address, hours, directions, phone, and booking | `Rella Aesthetics Napa | Hours, Address & Booking` |
| `/napa` | Napa treatment and service discovery | `Napa Med Spa Services | Rella Aesthetics` |

## Defect found

The authoritative Napa clinic schema used:

`https://experiencerella.com/locations/napa#location`

The Napa campaign hub and focused service schemas separately used:

`https://experiencerella.com/napa#location`

Both identifiers represented the same physical business at 1541 3rd St. Leaving both in place could split the site's internal entity signals and make the relationship between the clinic page and campaign pages less explicit to search engines.

The two top-level Napa pages also competed for nearly the same `Napa Med Spa` title instead of clearly dividing clinic-logistics intent from service-shopping intent.

## Repair

- Added a shared, typed registry for the canonical Napa and Vacaville location entity identifiers.
- Pointed the Napa campaign hub and all six focused Napa service providers to the canonical Napa clinic identifier.
- Pointed the campaign provider URL to `/locations/napa` while preserving each page's own canonical URL.
- Rewrote the Napa clinic metadata around hours, address, directions, and booking intent.
- Rewrote the Napa hub title around med-spa service discovery.
- Added regression coverage that rejects the former `/napa#location` identity.

The service-page canonical remains the service page, the hub canonical remains `/napa`, and the clinic entity's business URL remains `/locations/napa`. This keeps page identity and business identity separate and explicit.

## Verification

- 31 targeted Napa and local-search tests passed.
- 345 automated checks passed across 31 test files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 optimized build generated 47 routes.
- Legacy crawl passed with 31 moved routes and 2 preserved public records.
- Internal crawl passed across 36 sitemap pages and 47 unique internal destinations.
- Internal graph passed with zero orphaned indexed pages and maximum homepage crawl depth 2.
- Booking crawl passed across 36 pages and 20 unique external destinations.
- SEO crawl passed across 36 pages, 13 social images, and 54 valid JSON-LD blocks.

No deployment, push, merge, DNS change, indexation request, ad/account change, campaign mutation, or public cutover was performed.
