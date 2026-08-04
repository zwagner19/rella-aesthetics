# Rella website overnight executive handoff — 2026-08-03

## Executive decision

The rebuilt Rella website is ready for an approved preview deployment. It is not yet authorized for public cutover or paid traffic.

The website itself is no longer the main risk. The remaining blockers are owner-controlled operating inputs: a production-like HighLevel test, final clinical and legal approvals, several Boulevard content cleanups, current capacity and ads-account confirmation, analytics/privacy decisions, and the separately gated infrastructure cutover.

No deployment, push, merge, DNS change, CRM mutation, patient-data access, ad/account change, billing action, campaign mutation, or public cutover was performed.

## Current release evidence

| Area | Current result |
| --- | --- |
| Branch | `codex/weight-loss-conversion-foundation` |
| Runtime checkpoint | `908326a` — `feat: connect city IV booking paths`; this handoff adds documentation only |
| Branch scope | Multi-commit release branch; deploy only an exact reviewed head |
| Production build | Passed; 47 routes generated |
| Automated suite | 345 checks across 31 files; all passed |
| Lint and TypeScript | Passed with no findings |
| Indexable crawl | 36 pages; all passed |
| Internal destinations | 46; all passed |
| External booking destinations | 20; all passed HTTP and approved-host checks |
| Legacy migration | 31 moved WordPress URLs and 2 preserved records; all passed |
| SEO integrity | 13 social images and 54 JSON-LD blocks; all passed |
| Live booking UI | Distinct city/service routes rendered in Boulevard without completing a form or appointment |

The optimized preview used for the final checks ran locally on port 3010 from the current runtime code. The full production gate still must be repeated on the approved hosted preview and again immediately after cutover.

## What is now built

### Revenue paths

- Physician-led medical-weight-loss page with separate Napa and Vacaville consultation and assessment routes.
- First-party clinic chooser for generic booking intent.
- Location-first booking on all eight ordinary treatment families.
- Verified service or category handoffs for Napa Botox, filler, laser, HydraFacial, hyperhidrosis, facials, and IV Hydration.
- Verified service or category handoffs for Vacaville Botox, filler, laser, HydraFacial, facials, microneedling, and IV Hydration.
- Safe Vacaville menu fallback for chemical peels because the attempted direct category route rendered Boulevard's not-found screen.
- HighLevel contact delivery that fails closed, preserves clinic/service routing, avoids logging form contents, and fires lead conversion only after CRM acceptance.

### Acquisition and SEO

- Dedicated Vacaville pages for Botox, filler, laser, HydraFacial, chemical peels, microneedling, and facials.
- Dedicated Napa campaign hub plus Botox, filler, laser, HydraFacial, hyperhidrosis, and facial pages.
- Local editorial foundation and Napa Botox cost article with a valid public social image.
- Canonicals, metadata, FAQ schema, service schema, clinic schema, XML sitemap, robots behavior, and redirect coverage.
- Preserved giveaway terms record and generated two-clinic KML for local migration integrity.

### Trust and conversion quality

- Zachary Wagner, DO shown as Physician Owner and American Board of Obesity Medicine diplomate.
- Authentic Dr. Wagner image used on the public trust path.
- Approved 2026 pricing canon applied across injectable memberships, Botox/Dysport, filler, HydraFacial, and named laser services.
- Broader unsupported medical, recovery, candidacy, duration, and outcome claims removed or narrowed.
- Mobile action bars and clinic-specific CTAs tested at 390 × 844 on representative and newly built pages.
- Booking events remain intent signals; no click is reported as an appointment, arrival, or revenue event.

## Blocking owner decisions

| Priority | Owner decision or action | Why it blocks revenue traffic |
| --- | --- | --- |
| 1 | Authorize a hosted preview and identify the deployment owner/target | Production-like CRM, analytics, and returning-browser tests require a real preview origin |
| 2 | Approve the final public clinical copy and the medical-weight-loss facts sheet | Pricing, medications, labs, monitoring, virtual-care boundaries, and service claims require physician approval |
| 3 | Supply counsel-approved Rella Aesthetics Terms and privacy text | The current placeholders cannot be treated as final legal approval for the actual data stack |
| 4 | Confirm Napa Tuesday–Saturday and Vacaville Wednesday–Saturday public hours | Website, Google Business Profile, booking, and call scheduling must agree at launch |
| 5 | Correct Boulevard content defects | ProNox says `$50` in the description but `+$60.00` in the selector; microneedling contains stray `right but`; IV names/descriptions need clinical review |
| 6 | Provide or verify production HighLevel fields and accept a synthetic preview lead | A rendered success state is not proof that a real inquiry reached the correct sub-account |
| 7 | Confirm GA4/GTM ownership and privacy rules for Meta Pixel and GHL chat | Conversion reporting must work without sending patient or health information |
| 8 | Confirm Google Ads balance/account state, intended enabled campaigns, and current provider capacity | Paid demand must not be sent into suspended billing, the wrong campaign state, or an unavailable calendar |
| 9 | Reconfirm the separately gated infrastructure/Phase F state in the canonical ops repo | The imported handoff explicitly says public cutover remains closed and requires phase-specific authorization |

Use `docs/REVENUE-PATH-LAUNCH-GATE-2026-08-03.md` as the binding checklist. A check is complete only when it passes on the exact hosted preview commit.

Fast owner review packets:

- `docs/PHYSICIAN-COPY-APPROVAL-PACKET-2026-08-03.md`
- `docs/BOULEVARD-ADMIN-CLEANUP-PACKET-2026-08-03.md`
- `docs/REVENUE-OPERATING-SCORECARD-2026-08-03.md`
- `docs/PREVIEW-DEPLOYMENT-RUN-SHEET-2026-08-03.md`

## Recommended activation order

### Phase 0 — preview only

1. Create the approved hosted preview from this branch.
2. Record the exact commit and rollback target.
3. Run the full build, legacy, internal-link, booking-link, and SEO checks against the preview origin.
4. Complete a clean-browser and returning-browser click-through for every distinct booking destination.
5. Submit one synthetic HighLevel lead and prove the contact, fields, tags, source, and conversion event.
6. Obtain Dr. Wagner's clinical signoff and counsel's final legal text.

### Phase 1 — controlled public cutover

1. Satisfy the canonical infrastructure handoff and exact owner-authorization requirements.
2. Promote the already approved preview commit; do not rebuild an unreviewed head during cutover.
3. Re-run contact, booking, analytics, mobile, canonical, sitemap, robots, HTTPS, and redirect smoke tests on the public domain.
4. Keep paid traffic paused while the public-domain smoke tests and rollback window remain active.

### Phase 2 — measured demand generation

Based on the imported Napa capacity map, prioritize only after current capacity and account state are reconfirmed:

1. Napa Botox/Dysport and filler — highest documented open capacity and strategic value.
2. Napa laser/pigmentation — next-highest documented capacity and value.
3. Napa hyperhidrosis — controlled, low-volume intent.
4. Napa facials/HydraFacial — capped expansion only while the single-provider calendar remains healthy.
5. Keep IV promotion gated by the Boulevard clinical-label review.
6. Keep medical-weight-loss paid expansion gated by program facts, privacy/compliance, platform policy, and current operating capacity.

This is an activation order, not authorization to change campaigns or budgets.

## First-week operating cadence

### Launch day

- Check lead-delivery errors at launch, +1 hour, +4 hours, and next business morning.
- Reconcile accepted HighLevel leads to `generate_lead` events.
- Reconcile booking-intent events to Boulevard starts, completed appointments, and arrivals.
- Verify that calls and clinic choices route to the intended team.
- Stop traffic and roll back for missing CRM records, wrong-clinic booking, incorrect claims/prices, analytics leakage, or unusable mobile CTAs.

### Weekly revenue review

Review by service, clinic, and source:

- qualified leads;
- median first-response time;
- contact-to-book rate;
- booked-to-arrived rate;
- available capacity filled;
- cost per qualified lead;
- cost per arrived patient;
- collected revenue per arrived patient;
- CRM delivery failures and booking-route failures.

Optimize from arrived-patient economics, not clicks. HighLevel is the lead source of truth; Boulevard is the appointment source of truth; the practice operating record is the arrival and revenue source of truth.

## Next safe work if owner inputs are not yet available

1. Execute the prepared hosted-preview run sheet only after the owner identifies and authorizes the deployment target.
2. Reconcile the final branch against the canonical ops/release branch after the owner identifies it.
3. Complete the prepared physician-copy approval packet.
4. Complete the prepared Boulevard admin cleanup packet.
5. Confirm the owners and missing source fields identified in the prepared revenue operating scorecard.

The correct next external move is an approved preview, not more paid traffic and not a blind production cutover.
