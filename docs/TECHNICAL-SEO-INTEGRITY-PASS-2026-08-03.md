# Technical SEO integrity pass — 2026-08-03

## Outcome

Every indexable sitemap page now has one H1, a unique title, an exact canonical URL, indexable robots metadata, Open Graph and X/Twitter metadata, a loadable social image, and parseable JSON-LD wherever structured data is present.

The exact optimized preview passed:

- 28 indexable sitemap pages;
- 38 unique internal destinations;
- 13 distinct social image URLs, all returning an image response;
- 30 structured-data blocks, all valid JSON;
- no duplicate page titles;
- no duplicate canonicals;
- no sitemap page marked `noindex`;
- no missing or extra H1;
- no canonical path mismatch.

## Defects repaired

### Services-page heading

`/services` had no H1 because its shared section header always rendered an H2. The shared component now accepts an explicit heading level, keeps H2 as the safe default, and the Services index selects H1. A component test pins the page to exactly one H1.

### Napa canonical consistency

The six Napa acquisition routes used trailing-slash canonicals while the generated sitemap and application routes use slashless URLs. Their canonical, Open Graph URL, and local schema identifiers now match the exact sitemap path:

- `/napa`
- `/napa/botox`
- `/napa/filler`
- `/napa/laser`
- `/napa/hydrafacial`
- `/napa/hyperhidrosis`

### Social-share coverage

Several high-value pages had no `og:image`, including the homepage, both clinic pages, and all Napa acquisition pages. Rella now has a branded 1200 × 630 Open Graph and X/Twitter card with physician-owned positioning, clinic coverage, and the public domain. Existing service- and article-specific images remain in place.

The generated image routes are excluded from the sitemap because they are media assets, not indexable pages.

### Weight-management snippet

The medical-weight-loss meta description was tightened while preserving the no-card phone consultation, physician-led program, both cities, costs, and next-step framing.

## Durable release check

Run against the exact optimized preview:

`SITE_URL=http://localhost:3010 npm run check:seo`

The check fails for:

- a non-200 sitemap page;
- missing or unusually short/long title or description;
- missing, duplicate, cross-origin, query-bearing, fragment-bearing, or path-mismatched canonical;
- zero or multiple H1s;
- a sitemap page marked `noindex`;
- missing Open Graph title, description, or image;
- missing `summary_large_image` X/Twitter card;
- a social image that does not load as an image response;
- malformed JSON-LD;
- duplicate page titles.

This is a technical integrity gate, not a guarantee of ranking position. Search demand, Google Business Profile accuracy, content quality, links, reviews, page experience, and competitive conditions still affect organic acquisition.

## Verification

- 277 automated tests passed across 21 files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 optimized build completed and generated 37 routes including the two metadata-image endpoints.
- Sitemap regenerated with 28 indexable pages; the booking chooser and both media endpoints remain excluded.
- Internal link crawl passed across 28 pages and 38 unique destinations.
- Booking crawl passed across 11 unique external destinations.
- SEO integrity crawl passed across all 28 indexable pages.
- The 1200 × 630 share card passed visual review.
