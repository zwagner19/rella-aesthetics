# Public cutover readiness — August 17, 2026

## Decision

**Not approved for public cutover yet.** The technical website and booking candidates are healthy,
and Preview contact delivery plus clinic-hours alignment are now verified. Production CRM
promotion, the remaining binding business facts, legal approval, and recorded human sign-off remain
open. No production site, DNS, merge, appointment, payment, or ad setting was changed in this
hardening pass.

## Green evidence

### Website PR #14

- Draft PR #14 is mergeable and the protected Vercel builds are green.
- Full current suite: 57 files / 539 tests, ESLint, TypeScript, and Next 16 production build pass.
- Internal crawl: 38 sitemap pages, 58 destinations, zero orphans, maximum homepage depth two.
- SEO gate: 38 pages, 19 social images, and 52 structured-data blocks pass.
- Migration gate: 31 permanent WordPress mappings, two intentional `410 Gone` paths, and two
  preserved records pass.
- `/sitemap_index.xml` and `/wp-sitemap.xml` permanently redirect to `/sitemap.xml`; the release
  checker now fails if either mapping is removed.
- Exact-build booking containment passes across all 38 aesthetics pages and the weight-loss root.
- The weight-loss host keeps only its canonical root and both Napa/Vacaville consultation routes.

### Booking PR #27

- Exact head `c6b907f4891507bdd715ee4c73ea518f3129e48e` is synced with `main`, clean, and mergeable.
- 469 unit tests, typecheck, production build, and 6/6 desktop Chromium/mobile WebKit tests pass.
- Clean install reports zero known npm vulnerabilities.
- Napa/Vacaville filtering, clinic switch, Boulevard-style categories, service pages, and approved
  click/UTM propagation pass on the current protected preview:
  https://rella-booking-git-codex-filter-booki-585f93-zwagner19s-projects.vercel.app/book
- No cart, time hold, patient record, card, checkout, payment, or appointment was created.
- Production rollback target before PR #27 is `dpl_BXcyhTyAqcFqbtoE5iZAAtQgszcG`.

### Clarity preparation

- The Rella-owned Microsoft Clarity project is created but deliberately inactive.
- Account: `info@experiencerella.com`; project `Rella Aesthetics — Public Website`; project ID
  `y3oafpgl31`.
- Zach explicitly authorized acceptance of the general and Health & Wellness Additional Terms.
- Strict masking is selected, cookies are off by default, and Ads/Analytics integrations remain
  disconnected.
- `CLARITY_PROJECT_ID` is configured in Vercel Production only; `CLARITY_ENABLED` is absent.
- It requires an explicit server-side enable flag, a valid project ID, the exact public host,
  a closed low-sensitivity page allowlist, and visitor consent.
- Protected previews, contact, booking, treatment details, campaigns, and weight-loss routes are
  excluded. Advertising storage is always denied.
- Withdrawal fails closed and forces a clean document reload; stale consent cannot resurrect after
  a storage failure.
- Activation steps and a mandatory network/cookie test are in
  `docs/CLARITY-LAUNCH-RUNBOOK-2026-08-16.md`.

## Hard blockers

### 1. Contact form production delivery

The `rella-aesthetics` Preview environment now has the five required HighLevel variables. One
clearly labeled nonpatient lead was accepted by the intended Rella sub-account, its source, three
custom fields, and tags were verified, and the test contact was deleted afterward. Production has
not received those values and remains intentionally untouched.

Promote the same verified five server-side values to Production only when creating the immutable
production candidate, then repeat one labeled post-cutover smoke test and clean it up. Exact evidence
and the remaining procedure are in `docs/CONTACT-CRM-LAUNCH-STATUS-2026-08-17.md`.

### 2. Owner facts and clinical scope

The following location facts were approved from the live Google Business Profile listings on
August 17, 2026 and are now aligned in visible copy, KML, and structured data:

- Napa: 1541 3rd St, Napa, CA 94559; Thursday–Saturday 9am–5pm; Sunday–Wednesday
  closed; `(707) 358-2928`.
- Vacaville: 542 Main St, Vacaville, CA 95688; Tuesday–Friday 9am–5pm; Saturday
  9am–1pm; Sunday–Monday closed; `(707) 358-2928`.

Zach must still approve one binding source for:

- Botox/Dysport, filler, HydraFacial, laser, MiraDry, deposit, and membership pricing/terms.
- Free consultation and complimentary touch-up promises.
- Weight-loss eligibility, medication/compounding, labs, follow-up, and cost wording.
- Every team credential, scope claim, service, and location assignment.
- Review counts/excerpts and written consent for the semaglutide video.

When evidence is unavailable, omit the claim rather than copying a stale value.

### 3. Legal and communications approval

- Counsel/owner must approve the final Privacy Policy, Terms, cancellation/deposit language, SMS
  disclosure, and historical giveaway page.
- The current public site says 24 hours in one policy while PR #14 says 48 hours.
- The new contact form accepts phone numbers but does not yet carry the current live SMS disclosure.
- The short replacement legal pages omit material HIPAA/SMS/weight-loss terms from the live site.

### 4. Human release approval

- PR #14 and PR #27 remain draft and have no recorded approval.
- Amie and Zach must approve the exact immutable website and booking revisions, not an older PDF or
  moving branch alias.
- PR #27 must be released and verified on both production booking domains before the website sends
  public traffic into the reviewed booking experience.

## Clarity activation gate

Account creation, Terms acceptance, Strict masking, cookie-off mode, and the Production-only
project ID are complete. Clarity stays off until internal-IP exclusions, final privacy approval,
the exact public release, and the production network/cookie test are complete. Only then may
`CLARITY_ENABLED=true` be added and the approved release redeployed.

## Controlled release order

1. Close the owner facts/legal checklist and record approval against immutable commits.
2. Approve and release booking PR #27; smoke both booking domains and both weight-loss routes.
3. Freeze PR #14, rerun the full website checks, and create the production candidate with the
   verified HighLevel values promoted to Production.
4. Capture the current Cloudflare/WP Engine configuration and Vercel deployment as rollback targets.
5. Attach and verify apex/`www` in the canonical Vercel project without moving traffic.
6. Run 390px mobile and desktop acceptance, links, redirects, 410s, sitemap/robots/canonicals,
   contact delivery, booking handoff, analytics privacy, and performance on the exact candidate.
7. In a staffed low-traffic window, switch only apex/`www`; leave mail, booking, and weight-loss DNS
   untouched.
8. Smoke immediately and at +15 minutes, +1 hour, +4 hours, and the next morning. Restore the prior
   WP Engine origin immediately if contact, booking, routing, attribution, or SEO checks fail.
9. After the public host is stable, submit `/sitemap.xml` in Search Console, monitor old/new URLs,
    and measure real mobile Core Web Vitals. Activate Clarity only after every earlier gate is green.

Google's site-move guidance remains the migration standard:
https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
