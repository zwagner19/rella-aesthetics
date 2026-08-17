# Public cutover readiness — August 17, 2026

## Decision

**Not approved for public cutover yet.** The technical website and booking candidates are healthy,
but customer lead delivery, binding business facts, legal approval, and recorded human sign-off
remain open. No production site, DNS, merge, appointment, payment, or ad setting was changed in
this hardening pass.

## Green evidence

### Website PR #14

- Draft PR #14 is mergeable and the protected Vercel builds are green.
- Full current suite: 57 files / 538 tests, ESLint, TypeScript, and Next 16 webpack build pass.
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

- The website-side Microsoft Clarity integration is prepared but deliberately inactive.
- It requires an explicit server-side enable flag, a valid project ID, the exact public host,
  a closed low-sensitivity page allowlist, and visitor consent.
- Protected previews, contact, booking, treatment details, campaigns, and weight-loss routes are
  excluded. Advertising storage is always denied.
- Withdrawal fails closed and forces a clean document reload; stale consent cannot resurrect after
  a storage failure.
- Activation steps and a mandatory network/cookie test are in
  `docs/CLARITY-LAUNCH-RUNBOOK-2026-08-16.md`.

## Hard blockers

### 1. Contact form delivery

The `rella-aesthetics` Vercel project has no HighLevel variables in Preview, Production, or
Development. The form fails safely, but accepted inquiries cannot reach the CRM.

Required owner input:

- Rella sub-account HighLevel Private Integration Token with `contacts.write`.
- Correct location/sub-account ID.
- Message, service-interest, and clinic-preference contact custom-field IDs.

Configure Preview first, submit one clearly labeled synthetic lead, confirm field placement and
routing, delete the lead, then promote the verified values to Production. Exact instructions are
in `docs/CONTACT-CRM-LAUNCH-STATUS-2026-08-17.md`.

### 2. Owner facts and clinical scope

Zach must approve one binding source for:

- Clinic hours and Google Business Profile alignment. Repository hours conflict with the live site.
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

## Clarity account gate

Both available Google logins reach Microsoft's first-time Terms of Use screen, and no existing
Clarity project ID was found in code, Vercel, WordPress, GTM, or local records. Zach must personally
accept Microsoft's terms and choose the Rella-owned account. Codex will not accept a legal agreement
on the owner's behalf. Clarity stays off until that account step, strict masking, Consent Mode,
internal-IP exclusions, privacy approval, and the production network test are complete.

## Controlled release order

1. Close the owner facts/legal checklist and record approval against immutable commits.
2. Configure Preview-only HighLevel credentials; pass and clean up one labeled lead test.
3. Approve and release booking PR #27; smoke both booking domains and both weight-loss routes.
4. Freeze PR #14, rerun the full website checks, and create the production candidate with exact
   Production environment values.
5. Capture the current Cloudflare/WP Engine configuration and Vercel deployment as rollback targets.
6. Attach and verify apex/`www` in the canonical Vercel project without moving traffic.
7. Run 390px mobile and desktop acceptance, links, redirects, 410s, sitemap/robots/canonicals,
   contact delivery, booking handoff, analytics privacy, and performance on the exact candidate.
8. In a staffed low-traffic window, switch only apex/`www`; leave mail, booking, and weight-loss DNS
   untouched.
9. Smoke immediately and at +15 minutes, +1 hour, +4 hours, and the next morning. Restore the prior
   WP Engine origin immediately if contact, booking, routing, attribution, or SEO checks fail.
10. After the public host is stable, submit `/sitemap.xml` in Search Console, monitor old/new URLs,
    and measure real mobile Core Web Vitals. Activate Clarity only after every earlier gate is green.

Google's site-move guidance remains the migration standard:
https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
