# Booking destination health pass — 2026-08-03

## Outcome

The release workflow can now discover and verify every external booking URL actually rendered by the production-mode site.

Run:

`npm run check:booking-links`

Set `SITE_URL` when the optimized site is not running on the default `http://localhost:3000`.

The command is read-only. It follows booking links but never fills or submits a form, creates a contact, confirms an appointment, or sends patient information.

## What the check proves

1. The generated sitemap can be read.
2. Every sitemap page can be fetched.
3. At least one external booking destination is rendered.
4. All three required source hosts are represented:
   - `book.experiencerella.com`;
   - `book.rellaweightloss.com`;
   - `dashboard.boulevard.io`.
5. Every rendered booking link uses HTTPS.
6. Every rendered Boulevard URL includes a client-rendered `path` instead of relying on the tested-broken legacy business URL.
7. Every unique destination returns a successful response within 15 seconds.
8. Redirects stay inside the approved Rella, Boulevard, or JoinBLVD host set.

The final-host rule matters because Boulevard currently redirects its dashboard widget URLs to `www.joinblvd.com`. A future redirect to an unrelated host will fail the release check even if it returns HTTP 200.

## Current optimized-preview result

The August 3 production-mode preview passed with:

- 34 sitemap pages inspected;
- 14 unique external booking destinations;
- 1 `book.experiencerella.com` destination returning 200 on the same host;
- 4 `book.rellaweightloss.com` destinations returning 200 on the same host;
- 9 `dashboard.boulevard.io` destinations redirecting to `www.joinblvd.com` and returning 200.

This covers the hardened Napa Botox path, both city-specific weight-loss assessments, both city-specific weight-loss consultations, both clinic-scoped Boulevard menus, the verified Napa service/category paths, the rendered Vacaville Initial Laser Consult, Signature HydraFacial, Initial Microneedling Consult, and the Vacaville chemical-peel menu fallback. Generic booking now stays first-party long enough to choose a clinic at `/book`, so the broken business-level Boulevard URL is absent.

## Release usage

Run this after the production build and internal link crawl, against the same preview commit:

1. `npm run build`
2. `npm run start`
3. `npm run check:links`
4. `npm run check:booking-links`

A passing HTTP check does not prove that the client-rendered third-party screen works or that a returning Boulevard cart preserves the incoming clinic. The launch gate still requires one real-browser click-through per distinct clinic/service route before production approval. See `docs/BOOKING-RENDERED-DESTINATION-AUDIT-2026-08-03.md`.

## Failure policy

Do not cut over or send paid traffic when the command reports:

- a missing required booking host;
- a timeout or 4xx/5xx response;
- a non-HTTPS source or final URL;
- a Boulevard URL without a rendered `path`;
- a redirect outside the approved host set;
- no rendered booking destinations.

Resolve or deliberately replace the affected route in the typed booking resolver, rerun its contract tests, rebuild, and repeat both crawls.

## Verification

- Script syntax check passed.
- 321 automated checks passed across 29 test files.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- The command passed against the optimized preview's 34 sitemap pages and all 14 currently rendered external destinations.
