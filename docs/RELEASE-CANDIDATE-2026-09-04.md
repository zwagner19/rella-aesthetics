# Website revamp release candidate — September 4, 2026

## Status

The reconciled website revamp is code-complete on
`codex/reconcile-pr14-from-main-20260901` and is open for review in GitHub PR
20. Its Vercel preview is ready and independently verified. The PR has not been
merged, promoted, or connected to a production domain by this work.

No appointment, cart, payment, contact-form submission, Google conversion,
conversion upload, or WordPress mutation was created during verification.

## What is ready

- The full marketing site uses the reconciled revamp layouts and approved Rella
  photography at desktop and mobile sizes.
- Public booking buttons use only `book.experiencerella.com` or the approved
  `book.rellaweightloss.com` consultation routes.
- Napa Botox is the only aesthetics intent that deep-links directly to
  `/book/napa/botox`. Broad intents open an appropriate category or clinic
  chooser instead of pretending an appointment is selected.
- IV hydration fails safely to a phone call because there is no verified IV
  booking category. Medical weight loss uses the existing clinic-specific
  booking routes on its dedicated first-party host.
- The retired website-side Boulevard booking implementation and campaign GTM
  component are removed. Cart, checkout, appointment creation, payment, booking
  outcomes, and Google conversion uploads remain owned by the booking and HQ
  systems.
- The exact `experiencerella.com/napa/botox` campaign has a small cookie-choice
  panel. It can send one bounded Google click payload to the first-party booking
  attribution endpoint only after acceptance. It does not add ad identifiers to
  booking links and does not load the ordinary site analytics, Meta, chat, or
  booking-engine scripts.
- Denial and revocation fail closed. Other pages and hostnames cannot activate
  the Napa attribution controller.
- Legacy indexed WordPress URLs have direct permanent redirects, retired event
  URLs return `410 Gone`, and the generated sitemap is deterministic.
- General Napa clinic hours match the currently published location schedule:
  Monday–Friday 9am–5pm and Saturday 9am–1pm. The ad landing page directs users
  to live appointment availability rather than promising a provider schedule.
- The contact form validates and sends accepted leads to GHL without logging
  patient-entered content. It fails closed when required CRM configuration is
  absent.

## Verification completed

- Clean dependency install: 1,203 packages.
- Unit and contract tests: 27 files, 281 tests, all passed.
- TypeScript: passed.
- ESLint: passed.
- Production dependency audit: zero vulnerabilities.
- Production build: 45 routes generated successfully.
- Runtime crawl: 34 public routes, 44 internal paths, and 434 generated asset
  requests returned their expected responses.
- Redirect check: all 78 slash and slashless legacy variants reached their
  final destination in one permanent redirect.
- Host boundaries: the narrow Napa release host and dedicated weight-loss host
  allowed only their intended surfaces.
- Sitemap: 33 unique canonical URLs and no false build-time `lastmod` values.
- Campaign runtime: 21 loaded script blocks and bundles scanned with no Google
  Analytics, GTM, Meta, GHL, JoinBLVD, or embedded booking runtime.
- Responsive check: rebuilt Napa campaign verified at 320 × 800 and
  1440 × 900 with no horizontal overflow.
- Safe external check: the Napa Botox, Napa weight-loss, and Vacaville
  weight-loss booking pages each returned HTTP 200. No booking step was taken.
- Vercel preview check: all 34 public routes, 78 redirect variants, two retired
  routes, and the campaign external-script boundary passed against the deployed
  preview.

The full dependency audit still reports four moderate and four high advisories
through the development-only Sanity CLI tree. The deployed production
dependency graph reports zero vulnerabilities. npm's automatic proposal is a
breaking Sanity downgrade and is not an acceptable release fix.

## Required release operations

1. Complete review of GitHub PR 20, then merge through the protected release
   process. All connected Vercel preview checks are green.
2. Configure the five GHL contact variables listed in `.env.example` and submit
   one clearly identified contact-form QA lead after deployment.
3. Run the post-launch checks in `POST_LAUNCH_CHECKLIST.md` before moving the
   public domain.
4. Keep the website deployment separate from booking-app or HQ conversion
   uploader changes. This release does not require a synthetic appointment or
   conversion.
5. If website editing through Sanity is needed, deploy the Studio separately and
   set its approved `https://*.sanity.studio` URL as documented in
   `docs/SANITY-STUDIO-OPERATIONS.md`.
