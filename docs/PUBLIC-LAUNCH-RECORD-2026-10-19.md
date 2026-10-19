# Public website launch — October 19, 2026

**Live:** [experiencerella.com](https://experiencerella.com/). The owner explicitly selected “Switch the public website live.” The controlled release was activated on October 19 at `2026-10-19T23:06:30Z` (4:06 p.m. PDT); public response checks completed at `23:08:07Z`.

Amie’s homepage, global styles, fonts, imagery and site chrome remain preserved. The final source corrects outdated treatment-availability copy and booking destinations to match the live Boulevard menu. Booking-menu changes remain those requested by the owner. This release did not change deposit policy, amounts or reconciliation, or edit, deploy or promote the separate deposit project. Cindy’s Rella-app handoff work remains paused; `CINDY_HANDOFFS_ENABLED=false`.

## Current release references

| Surface | Live or review reference |
|---|---|
| Website functional source | `b250597d19ba4497b933e80e4b35ef2c54b68d8c`, tree `3ca8c122c43888a89d7cb60df312753019731c85`, branch `codex/amie-shared-booking`. |
| Website RELEASE | `dpl_2deAgzevUSbSpnXHMKvzdqw9MzUD`, immutable host `rella-aesthetics-l92l29lrv-zwagner19s-projects.vercel.app`. The website uses permanent backend origin `https://book.experiencerella.com`. |
| Website QA | `dpl_2deAgzevUSbSpnXHMKvzdqw9MzUD`; [controlled preview](https://rella-aesthetics-controlled-launch-zwagner19s-projects.vercel.app/). The review alias now serves the same immutable release and permanent booking backend as public. |
| Public edge | `rella-controlled-launch`, version `63bf61f1-46de-416f-9edf-cbf7ca563ed4`, deployment `bb82b56f-6f97-4a72-8d6f-938723f2df62`, deployed at 100%; `EDGE_ENABLED` string `true`, origin pinned to the immutable RELEASE above. Only `experiencerella.com/*` and `www.experiencerella.com/*` are bound. |
| Public booking backend | `dpl_CT1GC3jB1MkiHkTc7U12HdamPxE5`, source `460d5d6e6f56f62692243deb173897a940695230`, immutable host `rella-booking-39fab4ict-zwagner19s-projects.vercel.app`. Both `book.experiencerella.com` and `book.rellaweightloss.com` were read back on this exact deployment. |
| Rella HQ | The inquiry connection was overwritten by automatic main deployment `dpl_34DSKMoHfHfrAyHm6XBzuvYYCLMr` / `98fa7f6` during launch. Combined source `8817dcc50913c6172574a931d14f6372cb5417c1` preserves that exact latest main plus the website bridge; HQ-only deployment `dpl_DgBDsVAhGQ7SFLpEJuhxC9NpbXNA` is now live at the fixed HQ alias, with automatic production-domain assignment disabled and read back. It contains no Cindy notification implementation. |

The website Vercel project’s shared production alias was not generally promoted. The fixed website RELEASE is served through the Worker, preserving the existing weight-loss website deployment. No DNS, nameserver, TLS or security-setting change was needed.

## Homepage team order follow-up

At `2026-10-19T23:23:08Z`, the owner-requested homepage order was published: Zach, Warda, Anna, Devyn, Marisa, Michaela, Natalie, Sandra, Pia, Paula, Ayano. Existing unlisted staff Hailey and Ryan follow that ordered group; no staff record was removed. Shared team/location data and the homepage JSX/classes are byte-identical to the prior release. Seven existing team/design tests, focused lint, TypeScript and Production build passed. The live browser and public HTML confirm the order; homepage/team/contact and both clinic menu GETs passed. No booking, form submission, HQ deployment or deposit change was needed for this follow-up. [Order evidence](../../../outputs/rella-homepage-team-order-2026-10-19.json).

The previous public website artifact was `dpl_6r1K2UNv2A92kLZ1gfrjWPhvr1JG`; the preceding enabled Worker version was `64779a9e-44bb-4b2d-b540-2e4e77a25ab8`. The current references above supersede those website references only. Initial launch acceptance below remains historical evidence for its original artifacts.

## Public checks completed

- **56 website GET checks and 40 referenced assets passed.** Public pages returned their expected status, canonical and content; no reviewed public marketing HTML retained the Vercel transport `noindex` header. Amie’s homepage hero was present.
- Both clinic menus returned successful native-backed JSON: **77 Napa services and 66 Vacaville services**. Both package catalogs returned successful JSON. The bridge reports permanent card origin `https://book.experiencerella.com`.
- Menu/catalog responses remain `no-store, private` and `noindex, nofollow`; returned menu-visitor cookies retain HttpOnly, Secure and SameSite attributes. No cookie values are recorded here.
- All six preserved WordPress campaign paths and their slash forms retain their WordPress response or native slash redirect: `/napa`, `/napa/botox`, `/napa/laser`, `/napa/filler`, `/napa/hydrafacial`, `/napa/hyperhidrosis`. WordPress asset/form/admin namespaces remain on the existing origin.
- `www` returns an apex 308 with the same path/query. The release smoke used an ordinary `utm_source` value, not a fabricated advertising click. `/booking` returns the expected private/noindex redirect to the branded chooser. Robots, sitemaps, Next assets and the existing weight-loss canonical passed their checks.
- **14 backend GET checks passed**, including exact public alias mapping, both booking-domain scopes and secure-card parent boundaries. No holds, card entry/tokenization, appointments, charges, package purchases or advertising events were created by these release checks. Prior owner acceptance of checkout, packages and physical iPhone testing is retained.
- The independent Worker suite passed **53 tests**, covering routing, exact canonical proof, cookies, origin checks, private responses and prevention of POST replay/fallback.

The final website source passed all **593 tests**, TypeScript, focused lint and the remote production build. Restored HQ source passed 39 focused bridge/WMC tests, TypeScript, focused bridge lint and production build. Required full HQ lint still reports unrelated baseline findings in files byte-identical to current main; this release introduces no new lint finding.

Sanitized evidence outside Git: [public website checks](../../../outputs/rella-public-website-launch-2026-10-19.json), [public backend checks](../../../outputs/rella-public-backend-launch-2026-10-19.json). These are workspace evidence files, not application runtime dependencies.

## Inquiry delivery and remaining evidence

Before cutover, three designated contact-form canaries produced separate immutable inquiry threads with one Ayano event, unread notification and accepted push transport per receipt. Ayano remains primary for both clinics; Paula is the Vacaville handoff, Napa stays with Ayano, and Andrea is deferred. The final public-origin readback below independently verifies the restored HQ bridge. The older native Elevaite-only evidence does not substitute for Rella HQ readback.

**Fresh public-origin inquiry delivery is verified.** The first designated test persisted its GHL consent receipt, then correctly reported pending when the concurrently replaced HQ receiver failed; exact-marker readback found no HQ event. It was not replayed. After restoring the receiver, a distinct two-channel canary produced one Ayano thread/event/notification and accepted push at `2026-10-19T23:16:22.294Z`; its existing-profile email mismatch correctly caused contact-review handling and suppressed the unsafe email shortcut. A final distinct matching-phone canary showed the normal **Thank you / Your message reached Rella** confirmation and persisted exactly one Ayano-owned thread/event, one unread Ayano-only notification and accepted push at `23:17:34.113Z`. Operational consent was true, marketing false, and no contact-review warning applied. No appointment, charge, patient reply or promotional message was created.

Final sanitized evidence: [matching-phone delivery](../../../outputs/rella-public-inquiry-phone-2026-10-19.json), [contact-review delivery](../../../outputs/rella-public-inquiry-final-2026-10-19.json), [original failed canary retained without replay](../../../outputs/rella-public-inquiry-launch-2026-10-19.json), [public edge readback](../../../outputs/rella-public-edge-launch-2026-10-19.json), [HQ merge/checks](../../../outputs/rella-hq-launch-bridge-merge-2026-10-19.json), and [public form success screenshot](../../../outputs/rella-public-contact-success.png). The final matching-phone receipt is `382cdca8f67f0909b325f5d261ff0b4205cac9b3d9098bfd56dfe6cbfc8e1f53`, thread `f4cf0b52-9a62-4f22-9d58-1afa27868d40`. No contact details or credentials are included here.

Two evidence limits remain explicit:

- **Ayano’s human read is unproven.** Stored inbox/notification state and accepted push transport do not establish that she opened the inquiry.
- **A genuine eligible Google-ad booking and accepted/deduplicated conversion remain unproven.** The owner reported no genuine ad booking yet. No advertising click, conversion or financial event was fabricated. This release does not claim complete UTM/referrer, Meta or package-purchase attribution.

The final lightweight public-site iPhone smoke can use the live link without repeating accepted checkout or payment. The known rose-button contrast finding remains a separate design decision; no colors were changed under the locked design.

## Rollback and future releases

Removing the two new Worker routes restores the existing WordPress origin without changing DNS. The previously recorded disabled Worker version is `5c87cae0-aee4-48fc-bb7a-1a913fd17a0d`; it represents the historical prepared state. Preserve current route IDs and deployment readback with the release evidence before any rollback operation. A safe immediate route fallback is deployment of the exact disabled version above at 100%, which passes through to WordPress while preserving the two route bindings. The authenticated route table shows exactly the two patterns above; opaque route IDs were not exposed by the visible table and are not invented. Do not activate the obsolete Napa-only Worker.

Backend rollback affects both booking domains and must preserve already-started or uncertain checkout sessions. A route rollback does not cancel appointments, reverse charges or authorize replaying a request. The previous backend anchor is `dpl_FzvsMLVsfMNFdxn6EuEzPpZQPCmP`; do not blindly revert an active visit to an incompatible backend.

Automatic production-domain assignment is disabled **only** for the HQ and booking projects to keep unmerged main releases from replacing the reviewed live integrations. Existing production aliases remain live; future builds may stage, while manual promotion re-enables automatic assignment. Retain the freeze until the corresponding bridge/backend PRs are included in main. The separate deposit project and its release settings are unchanged.

Future HQ/main releases must retain the website bridge from [PR420](https://github.com/zwagner19/rella-hq/pull/420), or they can overwrite its manually promoted delivery path. Website [PR42](https://github.com/zwagner19/rella-aesthetics/pull/42), backend [PR67](https://github.com/zwagner19/rella-booking/pull/67) and HQ PR420 remain coordination references; live deployment does not mean those draft PRs were merged. Keep deposit-owner work separate.

The remainder of [CONTROLLED-LAUNCH-STATUS.md](CONTROLLED-LAUNCH-STATUS.md) and [CONTROLLED-LAUNCH-RUNBOOK.md](CONTROLLED-LAUNCH-RUNBOOK.md) is a preserved **historical prelaunch snapshot**. Its disabled routing, older deployment mappings and “not launched” statements do not describe the current live state above.
