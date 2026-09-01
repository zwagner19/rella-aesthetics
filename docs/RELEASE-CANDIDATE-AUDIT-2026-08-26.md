# Rella release-candidate audit — August 26, 2026

## Decision

**Not ready for public switchover yet.** The reviewed website and booking candidates are
technically healthy in local and protected-preview checks, but the public domains still serve
the prior WordPress/booking deployments. The remaining work is release coordination, production
environment validation, owner/legal approval, and a controlled DNS cutover. No merge, DNS change,
production promotion, appointment, payment, or form submission was performed in this audit.

## Exact candidates inspected

- Website worktree: `rella-amie-handoff`, commit `59edcbf` (`codex/amie-content-handoff`).
- Booking worktree: `rella-booking-location-filter`, commit `d3f1c80` (`codex/filter-booking-location-intent`).
- Website protected preview: `https://rella-aesthetics-git-codex-amie-cont-d87d57-zwagner19s-projects.vercel.app/`.
- Booking candidate preview: `https://rella-booking-git-codex-filter-booki-585f93-zwagner19s-projects.vercel.app/book`.
- The protected website preview remains authenticated/noindex; neither preview is a public release target.

## What passed

### Website

- 58 test files / 571 tests passed.
- ESLint, TypeScript, and the Next 16 webpack production build passed (50 routes).
- Internal-link crawl passed: 38 sitemap pages, 58 destinations, zero orphaned indexed pages,
  maximum homepage depth two.
- SEO crawl passed: 38 pages, 19 social images, and 52 structured-data blocks.
- Legacy migration passed: 31 moved WordPress URLs, two intentional `410 Gone` paths, and two
  preserved public records. Both `/sitemap_index.xml` and `/wp-sitemap.xml` redirect permanently
  to `/sitemap.xml`.
- Booking destination containment passed for the aesthetics pages and weight-loss host root:
  19 unique Rella-owned booking destinations.
- A route-by-route 390px/desktop pass found no broken first-party images or first-party horizontal
  overflow. The microneedling hero now uses `min-w-0`; the Cherry widget wrapper now clips its
  external carousel so it cannot widen the document.

### Booking

- 36 test files / 469 tests passed; TypeScript and webpack production build passed.
- Clean-install audit reports zero high-severity production dependencies.
- 6/6 Playwright checks passed across mobile WebKit and desktop Chromium with mocked booking APIs.
- Napa/Vacaville filtering, category navigation, reciprocal clinic switching, service detail
  routing, and click/UTM propagation passed without creating a cart or reservation.
- The real-user boundary was respected: no date, professional, time, card, checkout, payment,
  or appointment action was taken.

## Customer-facing findings

### Current public state

- `https://experiencerella.com/` is still the WordPress/WP Engine site, not the revamp.
- `https://book.experiencerella.com/book` is still the older booking deployment and does not match
  the reviewed candidate styling or category flow.
- The current public WordPress `/sitemap_index.xml` still returns the legacy sitemap, and
  `/wp-sitemap.xml` redirects to that legacy index. The candidate's `/sitemap_index.xml` and
  `/wp-sitemap.xml` redirects must be verified only after the public host is attached.

1. **Public booking is behind the candidate.** `book.experiencerella.com` still serves the older
   flat chooser and its location-only URL can show both clinics. The reviewed category/filter/
   switch experience is on the candidate branch and is not production yet.
2. **The two projects release independently.** Website PR #14 does not contain booking PR #27;
   booking must be released and smoke-tested before the website sends public traffic to it.
3. **The weight-loss host is coupled to the website project.** A website merge/promotion can
   change `weightloss.experiencerella.com`; test its root, canonical redirects, both clinic
   consultation routes, robots, and sitemap on the exact production candidate first.
4. **Cherry financing is not fully release-verified.** The layout is now protected from third-
   party width expansion, but the external widget still needs its production merchant/token
   configuration and a graceful fallback check.

## Hard release gates still open

- `rella-aesthetics` has no `GHL_*` variables in Production, Preview, or Development. The contact
  form therefore fails closed rather than delivering leads. Add the verified server-side token,
  location ID, and message/service/clinic field IDs to a production candidate; run one labeled
  synthetic lead and delete it before release.
- Both PRs remain preview work and require explicit Zach/Amie approval against immutable SHAs.
- The public apex and `www` are still Cloudflare/WP Engine and are not attached to the canonical
  Vercel website project. DNS/SSL attachment and a rollback snapshot are still required.
- Final prices, clinical/weight-loss wording, provider scope, review/photography consent, legal/
  privacy/SMS language, and cancellation/deposit terms need owner or counsel sign-off.
- Clarity is prepared but intentionally off: the Rella project exists, strict masking and
  cookie-off defaults are set, but `CLARITY_ENABLED` is absent. Keep it off until privacy/IP
  exclusions, public-host consent smoke, and the cutover are complete.
- Search Console sitemap submission, public redirect verification, and real mobile Core Web
  Vitals remain post-attachment tasks.
- The Vercel project-wide runtime log still contains old-deployment blog `DYNAMIC_SERVER_USAGE`
  and `/500.html` groups. Verify the exact production candidate and the public blog route before
  treating those historical errors as cleared.

## Controlled switchover sequence

1. Freeze the exact approved website and booking SHAs and record their immutable deployment URLs.
2. Release booking first; verify both production booking domains, both clinic filters/switches,
   weight-loss assessment/consult routes, and rollback to the current production deployment.
3. Create a website production candidate with the verified GHL values and run the labeled lead
   acceptance/cleanup plus the complete website, SEO, redirect, mobile, weight-loss, and booking
   handoff checks.
4. Attach apex/`www` to the canonical Vercel project while Cloudflare still points at WP Engine;
   verify TLS, canonical, robots, sitemap, redirects, and cache behavior without moving traffic.
5. In a staffed low-traffic window, change only apex/`www`; leave mail, booking, and weight-loss
   DNS records untouched. Smoke immediately, then at +15 minutes, +1 hour, +4 hours, and next
   morning.
6. If routing, contact delivery, booking, attribution, or SEO fails, restore the recorded WP
   Engine origin and purge the affected cache. Submit the new sitemap and enable Clarity only
   after the public host is stable.
