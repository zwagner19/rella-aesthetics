# Website insights and SEO — companion release

Approved by Zach: first-party, consented heatmapping and booking drop-off measurement, with reports and SEO controls in Rella HQ under existing admin login. Amie's public design and deposits remain unchanged.

- `/api/website-insights` accepts only a fixed enum/coarse-geometry contract after explicit fresh purpose consent. It signs a server-only request to HQ using a domain-separated version of the existing inquiry integration secret. No patient, treatment, provider, card, native booking identifiers, page text, selectors, form values, URLs or referrers are forwarded.
- Homepage, Napa and Vacaville click/scroll grids are split by screen size. Booking carries six step bits and a separate temporary attempt ID. Reopening or switching clinic counts another attempt; repeated steps are deduplicated. Pending confirmation stays pending. It is intentionally not a patient or independent Boulevard outcome ledger.
- Changing screen-size breakpoint stops that page's geometry until the next navigation. It cannot mix layouts or inflate page-view counts; booking progress continues independently.
- Old grants ask again; declines stay declined. Denial, revoked/expired receipts and hidden/unapproved routes disable measurement. Optional requests never delay the booking path. `?insights_qa=1` labels this document's metrics as QA, excluded from reports.
- `/website` in HQ is the only editor/report surface. Its public metadata endpoint returns published title/description text for 30 allowlisted pages. Drafts, revisions and audit history remain private.
- `withWebsiteSeo()` runs only on the server, caches for 60 seconds, bounds requests to 1.2 seconds and preserves source defaults on any failure. Canonicals, indexing, structured data, social images and public JSX remain intact. Weight-loss, policy and five older WordPress treatment pages are outside this editor.
- The only public copy edits explain the new measurement purpose in the existing consent panel and privacy policy. No public styles, imagery, fonts, treatment content or booking pricing are edited.

HQ companion PR: https://github.com/zwagner19/rella-hq/pull/447 . Its applied additive migration and retention job store snapshots for the 30-day report window. Publish HQ before the website. Stage the website with `--prod --skip-domain`, then change only the controlled-launch Worker origin and the QA alias after verification. Keep booking, analytics and weight-loss aliases pinned to their existing deployments.

Rollback website Worker origin to the prior ready artifact to stop collection; old code ignores the new consent-purpose cookie. If HQ is unavailable, metadata falls back and optional metrics fail without blocking bookings.

## Live verification — October 22, 2026 Pacific

- HQ feature PR 447 merged and deployed as `dpl_AA5WSpzMmtYPr8eHK6X42oADX6Yn`, source `f6f352d84e6b5c182352e7fe0e8c9d7b48bf8d6d`; its canonical alias was explicitly moved after readiness. PR 449 corrects the report's step 3 label to Review without altering booking behavior.
- Initial website release `dpl_DzkuGVgmJaesvTCMC7m5JiALN8q7`, source `7dddfe76949523de6d68531d8d760a38651cbfcf`, was published through Worker version `f3d61e2a-0b9c-408d-aa6c-9560b05efd96`. It retains all unrelated custom aliases.
- Existing admin login opened `/website`. Napa draft stayed unpublished; publishing appeared in the public page's metadata; Restore original defaults was verified on the public page. Audit revisions 1/2/3 record draft/publish/restore. No test copy remains published.
- Marked live Napa and Vacaville visits each recorded two public clicks, scroll reach, and treatment/review/provider progress. Provider choices loaded for both clinics. Overlay clicks/geometry stayed empty. Tests ended before time selection, patient details or payment.
- All controlled samples are `qa=true`. The admin report excluded them. Turning off measurement, reloading and interacting did not create another view or click.
- Public JSX comparison found only the intended consent and privacy-policy text additions. Compiled CSS differed only by an unused resize utility; public layout, styles, fonts and imagery were preserved. No deposits changed.
- Original release validation: 790 full-suite tests before the additional social-image preservation assertion; final focused checks cover privacy contracts, consent, overlay exclusion, step deduplication, rotation, SEO fallbacks and original social artwork. Typecheck, production build and scoped lint passed; three pre-existing website lint warnings remain.

Rollback origin: `rella-aesthetics-p2b5em39p-zwagner19s-projects.vercel.app` (`dpl_G6Y6rQseGJbmGYth9y8yh9eshLyw`); previous Worker `b83af4c6-ba3c-4870-8173-8a4b8f0f3222`. Keep shared weight-loss, booking and analytics aliases unchanged. The canonical HQ alias must be explicitly moved after a ready deployment; a Git deployment by itself does not move it.

### Final live artifacts

- Website: `13321440df6a8f86a9ff2804be02deb64e546d97`, ready production `dpl_DR5KTHSkqoL4LMBKNjB36a5GBzpr` / `rella-aesthetics-bi8gl1gm6-zwagner19s-projects.vercel.app`. Worker `1b95a319-6b75-49de-94a3-e7b1fb894860` and the controlled-launch QA alias point here. The final Vercel production build passed. A separate local rerun timed out prerendering `/services`; the earlier local build passed and the final remote build completed all routes. No live timeout was inferred from that local result.
- HQ: PR 449 merged as `133a8dea427358767542bcce7c6251988163c223`, ready production `dpl_7JYWSdoGwzxV8Zh7JK7tbuUQP31H` / `rella-m66wj760i-zwagner19s-projects.vercel.app`. `rella-hq.vercel.app` explicitly moved and live report verified with step 3 labeled Review. Focused tests 15/15, typecheck, scoped lint and local/remote production builds passed.
- Final website refinement: 9/9 focused tests, typecheck and lint (only three existing warnings) passed. Resize does not start a new page view. The existing report still excludes every QA record.
