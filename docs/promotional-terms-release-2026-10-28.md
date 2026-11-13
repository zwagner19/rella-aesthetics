# Promotional terms release — October 28, 2026

Public URL: https://experiencerella.com/promotional-terms

The owner supplied the full policy and approved August 1, 2026 for both Effective Date and Last Updated. All 65 content lines, including all 10 numbered sections, were compared against the supplied copy with only those date placeholders replaced.

## Implementation

- Static page reuses the existing site layout, Poppins typography, ivory background, text colors and spacing. One H1 and 10 H2s; reading container max width 848px.
- The shared Footer contains exactly one additional legal link. The separate Next Napa Botox campaign footer includes the same link. Existing links and navigation are preserved.
- `wordpress/promotional-terms-footer.php` is active as WPCode PHP snippet **1363**, “Promotional Terms link — legacy Napa footers,” Auto Insert / Run Everywhere. It registers content filters restricted to page IDs 1203–1207 and inserts one link after the existing footer Privacy link. Both filters are idempotent. No page content, style or booking link is rewritten. The Elementor editor stalled, so no Elementor page was saved; the existing WPCode integration supplies the shared legacy footer addition server-side.
- The route is in the sitemap and uses the existing legal-page exclusion from the floating mobile booking bar.

## Release

- Application commit: `8817876`.
- Vercel deployment: `dpl_758UwRCo48xeuSWAmfo6skGnNt5E`, `rella-aesthetics-qdefglz8b-zwagner19s-projects.vercel.app`, READY.
- Cloudflare controlled-launch Worker version: `e19915db-bb3f-45bf-8582-c791cdd5892d`, 100% traffic. Only `ORIGIN_HOST` changed; Worker code and routes did not.
- Controlled-launch QA alias points to this deployment.
- Booking, analytics and weight-loss aliases were rechecked and retain their prior deployment IDs.
- Rollback origin: `rella-aesthetics-bi8gl1gm6-zwagner19s-projects.vercel.app`; prior Worker version `1b95a319-6b75-49de-94a3-e7b1fb894860`. The legacy footer addition can be disabled through snippet 1363 without editing page content.

## Verification

- Production build and TypeScript passed; lint has zero errors and three pre-existing unused-variable warnings.
- PHP syntax check and exact single-link insertion/idempotency checks passed.
- All 39 canonical marketing routes, plus four additional public pages, returned exactly one promotional footer link with their Privacy link retained. This includes all five legacy Napa pages.
- Three other checked routes preserve their existing behavior: `/booking` redirects to the separate booking application, and `/events` and `/upcoming-events` return 410.
- Public policy returned 200, correct title/description/canonical, one H1, 10 H2s and no noindex directive. All supplied legal content matched exactly.
- Browser checks at 320, 390, 768 and 1440px showed no horizontal overflow. The 390px legacy footer also fits. The legacy footer link was clicked and visibly reached the live policy.
- No global styles, navigation, booking logic or deposit settings changed.

Evidence in the parent workspace outputs: `promotional-terms-live-verification-2026-10-28.json`, `promotional-terms-live.html`, and `promotional-terms-live-{mobile,desktop}.jpg`.

## Owner date clarification — October 29, 2026

The owner clarified that Effective Date stays August 1, 2026 and Last Updated should be yesterday, October 28, 2026. This supersedes the initial Last Updated value above. Application commit `6b9201f` changes only that displayed date and its source comment; the legal language, design, footer integration and deposit behavior are unchanged.

The corrected application is Vercel deployment `dpl_6shJd3HHXHNLM1Er7czYXkb2fpdz`, `rella-aesthetics-iy975q8ca-zwagner19s-projects.vercel.app`. The controlled-launch Worker origin and QA alias now use it; Worker version `558f6232-9cf2-4ce0-ad23-3c2f5e794195` serves 100% of traffic. Booking, analytics and weight-loss aliases retain their previous deployments. Immediate rollback is Worker version `e19915db-bb3f-45bf-8582-c791cdd5892d`.

Production build and page lint passed. The staged and public HTML match all 65 supplied content lines with the two approved dates substituted, with one H1, 10 sections and the footer link retained. Evidence: parent workspace `outputs/promotional-terms-dates-live-2026-10-29.html` and `outputs/verify-promotional-dates-2026-10-29.py`.
