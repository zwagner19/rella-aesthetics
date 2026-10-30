# Rella prelaunch audit handoff — October 18, 2026

> Current execution status, October 18 evening PDT: the owner authorized controlled-launch preparation. Read [CONTROLLED-LAUNCH-STATUS.md](CONTROLLED-LAUNCH-STATUS.md) and [CONTROLLED-LAUNCH-RUNBOOK.md](CONTROLLED-LAUNCH-RUNBOOK.md) first for implemented fixes, exact staged deployments, completed checks and remaining human gates. The original audit brief below records an older snapshot; its historical consent, deployment and test-count statements do not describe the latest source. Public traffic has not been cut over. Keep Amie’s visual design locked and deposit work with the separate chat.

## Objective and source of truth

Audit the actual website, paired booking backend and downstream measurement before the public cutover. Establish what functions, what needs improvement, what is unverified and what blocks launch. Start with an evidence-backed audit and proposed fix sequence; do not redesign or promote the site during this pass.

Fetch current remote branches without discarding concurrent work. Record the checked-out commits, deployed commits, origins, environment and effective runtime flags before testing. Audit these paired drafts, not the old PR #40 or an unrelated main-branch deployment:

- Website: `zwagner19/rella-aesthetics`, `codex/amie-shared-booking`, [PR #42](https://github.com/zwagner19/rella-aesthetics/pull/42), based on `amie-website-edits`. Implementation baseline before this documentation update: `dcaf0e555607b649495c8562d133b41c973bc5ae`.
- Backend: `zwagner19/rella-booking`, `codex/shared-booking-catalog`, [PR #67](https://github.com/zwagner19/rella-booking/pull/67). Latest verified implementation on October 17: `5c2a158d8ab2c5f9921c86d85d0765c71ac3e8f4`.
- Website Preview: <https://rella-aesthetics-git-codex-amie-shar-98a3c5-zwagner19s-projects.vercel.app/>.
- Paired backend Preview: <https://rella-booking-git-codex-shared-booki-0d140e-zwagner19s-projects.vercel.app>.
- Use Rella HQ to inspect deployed webhook, reconciliation, recovery and conversion-upload behavior. Its request-scoped client adapter mirror was committed locally as `c8270cab569515c5c61e5176ffe5c08de22d2d97`; that does not prove HQ was pushed or deployed. Verify its current state without overwriting another chat's work.

Current code, current PR descriptions and dated native evidence take precedence over historical architecture prose. Backend README/architecture and July provenance describe older phases. Read the backend's `docs/AMIE-SHARED-BOOKING.md`, `docs/package-booking.md` and `docs/AESTHETICS-FUNNEL-MEASUREMENT.md` alongside the current source.

## Owner requirements and completed work to preserve

- Keep Amie's approved page design, imagery, fonts, colors and visual system exactly the same. Recommend improvements to clarity, content and conversion separately from any optional design proposal.
- Keep the branded in-site journey while the shared booking backend operates behind it. Native service/location eligibility, providers and complete-visit availability remain authoritative; do not return to a copied limited menu or replace the flow with a separate-looking app.
- Multiple treatments in one booking, per-treatment provider preferences, actual native schedule, hold expiry/release, secure card isolation and durable confirmed-versus-pending handling are implemented. Do not replay uncertain financial mutations or turn pending into success.
- Both package paths are implemented: new native package purchase and authenticated booking from an existing owner's unused voucher. Staff applies the voucher at the appointment; this is not online voucher redemption. Package purchase is a separate financial outcome from an appointment.
- Deluxe HydraFacial's six-treatment package definition was saved in Boulevard and independently read back on October 17: six Deluxe treatments plus **six total Lip-or-Eye Perk add-ons**, not six of each. Its current native online offer is Napa only. Existing client wallets were not backfilled. Diamonds Are Forever X3 must remain unavailable online; Hair Restoration 3 remains guarded because its linked service is inactive.
- Established Patient Tox and the ordinary Deluxe HydraFacial appointment are approved at both clinics. Do not confuse that with location availability of the six-treatment sale package.
- No prices on the first treatment/package menu. Descriptions stay about two sentences, with booking policy later. Preserve approved contact-consent wording; promotional consent is optional.
- Leave deposit amounts, credit rules and reconciliation changes to the other chat. Inspect/report inconsistencies as launch dependencies without changing its policy or overwriting its work.

## Evidence baseline and known gaps

October 17 checks passed 455 website tests and 1,331 backend tests, both typechecks/builds and focused frontend lint. Real native catalog/quote reads and temporary appointment hold/release checks were performed at both clinics. Four complete phone-sized checkout cases used isolated external-API/PCI simulations. These are distinct kinds of evidence; rerun relevant checks against the audited commits.

No real OTP, client-wallet access, ownership transfer, package charge or completed appointment was exercised by the package implementation tests. Physical iPhone Safari remains unverified. Prepare the remaining supervised tests with an approved test profile/contact and owner-controlled payment entry; do not infer a successful live checkout from a mock or a visible card form.

Two concrete measurement gaps require investigation:

1. Website `src/lib/aesthetics-attribution.ts` currently limits the approved paid capture path to `experiencerella.com/napa/botox`, submits Napa and targets the production attribution endpoint. The shared booking bridge forwards existing attribution/scope/denial cookies; it does not establish sitewide capture. Audit every intended paid landing page and clinic, including Preview-versus-production origin behavior.
2. The phone-consent choices currently gate the form but are excluded from the four-field contact payload sent to checkout. Their display does not prove durable consent recording or downstream CRM opt-in. Trace the intended receipt, persistence and use; do not silently broaden advertising or messaging consent.

## Required audit coverage

### Functionality and patient experience

Crawl every public route and CTA: home, service/category and local treatment pages, both locations, team/about, gallery, memberships, packages, private parties, payment plans, contact and legal pages. Check forms and real lead-delivery/error behavior, call/map links, navigation, empty states, broken links, placeholders and browser errors. Verify ordinary `BookTrigger` overlays, raw external links, campaign links, middle-click/no-JavaScript fallback and intentionally separate weight-loss routing individually.

Build a booking matrix for both clinics: single/multiple treatments, new/established patients, Any/named providers, clinic/service/provider changes, Back/reopen, expired visitors/holds, payment failure, pending/duplicate submissions and confirmations. Check native schedule/duration/provider identity rather than assuming click order means adjacent appointments. Include follow-ups, package purchase, profile/DOB verification and owned-session eligibility; flag required options that the interface cannot collect. The proposed nurse planning consultation still needs a verified Boulevard service definition.

Test real mobile Safari when available, narrow responsive layouts, keyboard/autofill, scrolling, modals/focus, screen-reader names, form errors, contrast and tap targets. Separate actual-device results from viewport simulations.

### SEO, discoverability and performance

Check rendered titles/descriptions, headings, canonicals, social metadata, internal links, useful unique treatment/location copy, image alt text and matching visible-content/structured-data claims. Verify location names, addresses, hours and phone consistency against current approved business records. Use current primary search-engine documentation where standards matter.

Crawl actual robots/sitemap/status/redirect responses and compare them with the existing site's URLs and available Search Console evidence. Inspect `next.config.ts`, `src/proxy.ts`, `next-sitemap.config.js`, `legacy-redirects.json`, metadata and schema helpers. Check www/HTTPS/domain redirects, redirect chains and query-parameter preservation. Distinguish intentionally retired/excluded pages from accidental omissions. Measure representative mobile performance and Core Web Vitals; label lab measurements separately from available field data.

Preview `noindex` is intentional. Verify how production becomes indexable at cutover without exposing test/booking/private routes. The narrow Napa release host's allowlist is not automatically suitable for the whole website and booking APIs. Inspect the actual Vercel/Cloudflare response path rather than relying on checked-in XML or source configuration alone.

### Attribution through a verified business outcome

Trace supported UTMs/click identifiers, entry/referrer and consent through landing page, navigation, overlay, clinic changes, server bridge, cart/session and native booking. Check first/last-touch rules, expiry, missing/cleared cookies, consent denial/withdrawal, browser restrictions, cross-host continuity and QA exclusions. Inspect actual network/storage behavior; separate ordinary-site GA/Meta configuration from the campaign's first-party consented measurement path.

For an authorized test, prove the chain: consented source → attribution session → booking session → completed Boulevard appointment → durable booking outcome → exactly one eligible conversion job → accepted destination upload. Inspect deployed HQ webhook/recovery/uploader and retry/deduplication behavior. A click, lead, hold, package purchase, appointment confirmation and collected revenue are different outcomes. Do not count deposits as full treatment revenue, count a package purchase as an appointment, double-count multiple treatments, or claim accepted delivery from a queued job. Establish a separate agreed measurement contract for package purchases.

### Privacy, security and operating readiness

Audit consent persistence/revocation, tracking scripts and third-party widgets while booking/contact/card details are visible. Ensure patient identity, clinical selections, DOB and payment data cannot leak into advertising, analytics, URLs or logs. Verify server-only credentials, cookie/origin controls, ownership isolation, canonical database configuration and deployed schema privileges. Do not enable trackers or conversion uploads to make the audit appear to pass.

Review content accuracy and approved result/photo use, operational contact/confirmation delivery, runtime flags, environment dependencies, monitoring and recovery. Prepare the deployment order, legacy URL migration, domain/DNS/Cloudflare plan, backups/rollback and post-launch smoke tests. No production merge, cutover, real charge/appointment or advertising upload is authorized by this audit handoff.

## Required deliverable

Return a clear GO/NO-GO assessment with **PASS, FAIL or NOT VERIFIED** for every area. For each finding include severity, patient/business impact, route or file, expected versus observed behavior, reproducible evidence, concrete fix, owner/dependency, effort estimate and acceptance test. Distinguish verified defects, missing access and optional improvements. Prioritize P0 launch blockers, P1 work before launch and P2 follow-up; provide an ordered fix/test/cutover plan. Keep a separate list of the few decisions or supervised actions needed from Zach. Do not substitute a generic best-practices checklist or passing build for end-to-end proof.
