# Internal-link discoverability pass — 2026-08-04

## Outcome

Every indexable sitemap page is now reachable through the website's internal links, every non-homepage indexable page has at least one inlink from another indexable page, and the farthest indexable page is two clicks from the homepage.

The release checker now enforces these conditions instead of merely proving that linked URLs return a non-error response.

## Defect found

The first production-mode graph audit failed with:

- orphaned indexed page: `/napa`;
- `/napa` unreachable from homepage links;
- `/napa/hyperhidrosis` unreachable because its only useful upstream path was the orphaned Napa hub.

The pages existed, rendered, appeared in the sitemap, and passed ordinary HTTP/SEO checks. That was insufficient: search engines and ordinary visitors had no crawlable internal route into the Napa campaign hub, weakening discovery and leaving a revenue page dependent on direct URLs or the sitemap.

## Repair

The ordinary Napa clinic page at `/locations/napa` now:

- links directly to `/napa` with `Explore the Napa Service Hub`;
- includes a visible `Excessive Sweating Care` card linking to `/napa/hyperhidrosis`;
- keeps consult-first language rather than preselecting MiraDry, tox, or another treatment;
- preserves the existing clinic menu, directions, hours, and service paths.

This gives visitors a coherent route from homepage → Napa clinic → Napa hub or specific Napa care. It also reduces the hyperhidrosis page to two clicks from the homepage.

## Durable release invariant

`npm run check:links` now builds a graph of sitemap pages and fails for:

- any sitemap page that does not return successfully;
- any broken same-origin link;
- any non-homepage sitemap page with zero inlinks from another sitemap page;
- any sitemap page unreachable by following links from `/`;
- any sitemap page more than three clicks from `/`.

Self-links do not count as inlinks. Query strings and fragments do not create duplicate indexed nodes. HTTP validation still covers every unique same-origin destination, including useful non-sitemap routes and redirects.

The ceiling of three is deliberately looser than the current depth of two, allowing a small editorial hierarchy without permitting deep or accidental orphaning.

## Verification

- Script syntax check passed.
- 345 automated checks passed across 31 test files.
- The Napa location rendering test pins both the hub link and the hyperhidrosis card.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 optimized build generated 47 routes.
- Legacy crawl passed with 31 moved routes and 2 preserved public records.
- Internal crawl passed across 36 sitemap pages and 47 unique internal destinations.
- Internal graph passed with zero orphaned indexed pages and maximum homepage crawl depth 2.
- Booking crawl passed across 36 pages and 20 unique external destinations.
- SEO crawl passed across 36 pages, 13 social images, and 54 JSON-LD blocks.
- Mobile review at 390 × 844 confirmed the new hub and all-services actions fit cleanly above the plan-your-visit section without interfering with the fixed booking bar.

No deployment, push, merge, DNS change, indexation request, ad/account change, campaign mutation, or public cutover was performed.
