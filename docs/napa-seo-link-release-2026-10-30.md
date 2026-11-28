# Napa contextual-link release — October 30, 2026

Application source `7080a91` links the existing “HydraFacial” word on `/napa/facials` to `/napa/hydrafacial/`. Its words, visual styling at rest, page layout, images, navigation and existing general-guide link are retained. The ordinary anchor intentionally crosses into the retained WordPress page.

- Production-environment build: `dpl_svWg18mZE3BgX5CvgWixeDD7Jzwd`, `rella-aesthetics-ep4262mcr-zwagner19s-projects.vercel.app`; created with `--prod --skip-domain` and verified ready.
- Public controlled-launch Worker: `06d07697-d5af-4107-989e-7e57428ffa5c` at 100%; only its origin binding changed. QA alias also points to this artifact.
- Rollback: Worker `558f6232-9cf2-4ce0-ad23-3c2f5e794195`, origin `rella-aesthetics-iy975q8ca-zwagner19s-projects.vercel.app`.
- Scoped ESLint and production build passed. At 390px and desktop width, old and staged paragraphs have identical text, dimensions, Poppins font, size, weight, line-height and color; no horizontal overflow. This was Chrome viewport emulation, not a physical iPhone test.
- Public GET verification at 08:07 UTC confirms one new local anchor, retained general HydraFacial guide, status 200, self-canonical and `index, follow`. Clicking the public anchor reached the live Napa HydraFacial page with its self-canonical.
- Public Napa House and Vacaville pages retain their text, booking hrefs and indexable self-canonicals. The cost guide remains noindex pending factual review; its draft indexability patch is outside the app repository and was not applied.
- Booking, weight-loss booking, weight-loss website and analytics custom aliases were read back unchanged. No booking/deposit behavior or policy, Ads settings, global styles or legacy WordPress content changed.

The seven original SEO baseline artifact hashes remain intact. Dated query map, factual review and validation are in `../../outputs/rella-seo-90-day/`. PR #48 targets the active shared website branch, not the older divergent `main`.
