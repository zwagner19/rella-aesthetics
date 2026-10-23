# Website insights and SEO — companion release

Approved by Zach: first-party, consented heatmapping and booking drop-off measurement, with reports and SEO controls in Rella HQ under existing admin login. Amie's public design and deposits remain unchanged.

- `/api/website-insights` accepts only a fixed enum/coarse-geometry contract after explicit fresh purpose consent. It signs a server-only request to HQ using a domain-separated version of the existing inquiry integration secret. No patient, treatment, provider, card, native booking identifiers, page text, selectors, form values, URLs or referrers are forwarded.
- Homepage, Napa and Vacaville click/scroll grids are split by screen size. Booking carries six step bits and a separate temporary attempt ID. Reopening or switching clinic counts another attempt; repeated steps are deduplicated. Pending confirmation stays pending. It is intentionally not a patient or independent Boulevard outcome ledger.
- Old grants ask again; declines stay declined. Denial, revoked/expired receipts and hidden/unapproved routes disable measurement. Optional requests never delay the booking path. `?insights_qa=1` labels this document's metrics as QA, excluded from reports.
- `/website` in HQ is the only editor/report surface. Its public metadata endpoint returns published title/description text for 30 allowlisted pages. Drafts, revisions and audit history remain private.
- `withWebsiteSeo()` runs only on the server, caches for 60 seconds, bounds requests to 1.2 seconds and preserves source defaults on any failure. Canonicals, indexing, structured data, social images and public JSX remain intact. Weight-loss, policy and five older WordPress treatment pages are outside this editor.
- The only public copy edits explain the new measurement purpose in the existing consent panel and privacy policy. No public styles, imagery, fonts, treatment content or booking pricing are edited.

HQ companion PR: https://github.com/zwagner19/rella-hq/pull/447 . Its applied additive migration and retention job store snapshots for the 30-day report window. Publish HQ before the website. Stage the website with `--prod --skip-domain`, then change only the controlled-launch Worker origin and the QA alias after verification. Keep booking, analytics and weight-loss aliases pinned to their existing deployments.

Rollback website Worker origin to the prior ready artifact to stop collection; old code ignores the new consent-purpose cookie. If HQ is unavailable, metadata falls back and optional metrics fail without blocking bookings.
