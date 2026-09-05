# Sanity Studio Operations

The marketing app reads published content with `@sanity/client`. Sanity Studio is
build-time/editor tooling and must not be embedded in the production Next.js
dependency tree.

## Editor deployment

1. Use Node 20.19+ (excluding Node 22 below 22.12).
2. Configure `NEXT_PUBLIC_SANITY_PROJECT_ID` and
   `NEXT_PUBLIC_SANITY_DATASET`.
3. Run `npm run studio:deploy` and choose the Sanity-hosted Studio hostname.
4. Set server-side `SANITY_STUDIO_URL` to the resulting
   `https://<name>.sanity.studio` URL.

The public `/studio` route redirects only to an HTTPS `*.sanity.studio` URL. It
returns 404 if the variable is missing or unsafe. The release-origin proxy still
blocks `/studio`; the redirect is for approved non-release/editor hosts.

## Release guard

Run `npm run audit:production` before release. A high or critical production
advisory blocks release. Studio/CLI advisories are development-tool findings and
must be assessed separately with `npm audit`; never resolve them by downgrading
Sanity or `next-sanity` into an unsupported application combination.
