# Rella hosted-preview deployment run sheet — 2026-08-03

## Scope

This run sheet creates and verifies a private/approved hosted preview. It does not authorize a production promotion, DNS/Cloudflare/WordPress change, GitHub merge, campaign change, CRM cleanup, or public traffic cutover.

The imported infrastructure handoff says public cutover remains closed behind a separate Phase F process and exact owner authorizations. Reconfirm that state in the canonical ops repository before any action beyond preview.

## Gate A — owner authorizes the preview target

Record before deployment:

- [ ] Deployment owner:
- [ ] Hosting project/account:
- [ ] Approved preview-only target:
- [ ] Repository and branch:
- [ ] Exact release commit:
- [ ] Local `main` commit:
- [ ] Canonical remote base verified by:
- [ ] Rollback/previous preview target:
- [ ] Approval date/time:
- [ ] Owner approval record/link:

Do not assume that the local `main` ref is the current canonical remote release base. The prepared branch was linear on top of local `main` and passed `git diff --check main..HEAD`; repeat both checks against the owner-identified canonical base.

## Gate B — branch integrity

Run read-only checks from the release worktree:

```bash
git status --short
git rev-parse HEAD
git merge-base <canonical-base> HEAD
git diff --check <canonical-base>..HEAD
```

Pass criteria:

- [ ] Worktree is clean.
- [ ] Exact head matches the approved commit.
- [ ] Merge base and release history are understood.
- [ ] Full branch patch has no whitespace/error output.
- [ ] No unreviewed commit or unrelated local file is included.
- [ ] The deployment system will build this commit, not a moving branch head.

If the canonical base has moved, stop and perform a reviewed reconciliation. Do not silently rebase, merge, force-push, or deploy a newly generated head.

## Gate C — preview environment

Never paste credential values into this document, Git, terminal output, screenshots, or chat.

### Required revenue path

- [ ] `NEXT_PUBLIC_BOULEVARD_API_KEY`
- [ ] `NEXT_PUBLIC_BOULEVARD_BUSINESS_ID`
- [ ] `NEXT_PUBLIC_BOULEVARD_USE_SANDBOX=false` only when the approved preview should exercise the production booking handoff
- [ ] `GHL_API_KEY` as a server-only secret
- [ ] `GHL_LOCATION_ID`
- [ ] `GHL_CUSTOM_FIELD_MESSAGE_ID`
- [ ] `GHL_CUSTOM_FIELD_SERVICE_ID`
- [ ] `GHL_CUSTOM_FIELD_LOCATION_ID`, or recorded owner approval of the location-tag fallback

### Content and authenticated revalidation

- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [ ] `NEXT_PUBLIC_SANITY_DATASET`
- [ ] `SANITY_WEBHOOK_SECRET`

### Measurement

- [ ] Confirm the one intended GA4/GTM path; never enable duplicate collection.
- [ ] Set `NEXT_PUBLIC_GTM_ID` only for the approved campaign-shell container.
- [ ] Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` only if it will not duplicate the same property through GTM.
- [ ] Leave `NEXT_PUBLIC_META_PIXEL_ID` unset until privacy/compliance approval.
- [ ] Leave `NEXT_PUBLIC_GHL_CHAT_WIDGET_ID` unset until privacy/compliance and page-scope approval.
- [ ] Confirm no secret uses a `NEXT_PUBLIC_` prefix.

## Gate D — build the exact commit

From the exact release worktree:

```bash
npm test
npm run lint
npm run build
```

Prepared checkpoint expectation:

- 31 test files and 345 tests pass;
- Next.js 16.2.12 generates 47 routes;
- sitemap generation completes.

Record actual hosted-preview build evidence:

- [ ] Build ID:
- [ ] Commit displayed by host:
- [ ] Preview URL:
- [ ] Build/test log link:
- [ ] Build completed at:

Fail if counts unexpectedly shrink, a route disappears, the sitemap is stale, or the host builds a different commit.

## Gate E — automated preview checks

Run against the approved preview origin:

```bash
SITE_URL='https://approved-preview.example' npm run check:legacy-redirects
SITE_URL='https://approved-preview.example' npm run check:links
SITE_URL='https://approved-preview.example' npm run check:booking-links
SITE_URL='https://approved-preview.example' npm run check:seo
```

Prepared checkpoint expectation:

- 31 moved legacy routes and 2 preserved records;
- 36 sitemap pages and 46 unique internal destinations;
- 20 unique external booking destinations on approved hosts;
- 13 social images and 54 JSON-LD blocks.

Record actual results and attach the output. HTTP success does not replace rendered-browser booking checks.

## Gate F — visual and rendered booking checks

Use no real patient's information. Never select a professional, formula, treatment area, add-on, date, payment, or form field unless a later specifically approved smoke test requires it.

### Global and location paths

- [ ] `/book` shows exactly Napa and Vacaville.
- [ ] Napa opens the live Napa menu.
- [ ] Vacaville opens the live Vacaville menu.
- [ ] Repeat both after beginning—but not completing—a journey at the other clinic.

### Service paths

- [ ] Napa Botox → hardened Napa Botox app.
- [ ] Napa filler → `Dermal Fillers` and selectable next step.
- [ ] Napa laser → live `Laser` category.
- [ ] Napa HydraFacial → `Signature Hydrafacial` and selectable next step.
- [ ] Napa hyperhidrosis → `New Patient Consult` and selectable next step.
- [ ] Napa facials → `Initial Skin Health Consult` and selectable next step.
- [ ] Napa IV → live `IV Hydration` category.
- [ ] Vacaville Botox → `New Patient Tox` and selectable next step.
- [ ] Vacaville filler → `Dermal Fillers` and selectable next step.
- [ ] Vacaville laser → `Initial Laser Consult` and selectable next step.
- [ ] Vacaville HydraFacial → `Signature Hydrafacial` and selectable next step.
- [ ] Vacaville facials → `Initial Skin Health Consult` and selectable next step.
- [ ] Vacaville microneedling → `Initial Microneedling Consult` and selectable next step.
- [ ] Vacaville IV → live `IV Hydration` category.
- [ ] Vacaville chemical peels → Vacaville menu, then visible `Peels` category; do not substitute the rejected shortcut.
- [ ] Napa and Vacaville weight-loss consultation and assessment routes load the intended city.

Fail for the wrong clinic, wrong service, `#/not-found`, “things have moved,” empty shell, or no selectable next step. Record the Boulevard defects from `docs/BOULEVARD-ADMIN-CLEANUP-PACKET-2026-08-03.md`; routing success does not waive them.

### Visual baseline

- [ ] Desktop representative pages at 1440 × 1000.
- [ ] Mobile representative and high-intent pages at 390 × 844.
- [ ] One visible H1; no horizontal overflow; no clipped sticky action; no blocked form/policy controls.
- [ ] Authentic Dr. Wagner portrait is clear.
- [ ] Addresses, phones, hours, prices, service names, and clinic labels match the approved sources.

## Gate G — synthetic HighLevel lead

Use a unique synthetic identity, never patient information. Example label: `Rella Preview Test <YYYYMMDD-HHMM>`.

- [ ] Submit name, test email/phone, service, clinic preference, and recognizable nonmedical test message.
- [ ] Website shows success only after the request completes.
- [ ] Contact appears in the intended HighLevel sub-account.
- [ ] Email and normalized phone are exact.
- [ ] Source is `Rella Website — Contact Form`.
- [ ] Message is intact in the dedicated field.
- [ ] Service and clinic fields/tags are correct.
- [ ] `website-lead` is present.
- [ ] Repeat-contact test preserves existing tags.
- [ ] Exactly one successful lead conversion fires after CRM acceptance.
- [ ] Analytics contains no name, email, phone, message, service choice, clinic choice, or health information.
- [ ] Delete or clearly label the synthetic contacts after verification.

Also test the approved non-production failure path with missing CRM configuration and the honeypot behavior defined in the revenue launch gate.

## Gate H — owner acceptance

Attach:

- [ ] build and crawler output;
- [ ] booking-screen evidence for clean and returning browsers;
- [ ] mobile/desktop screenshots;
- [ ] synthetic HighLevel record evidence with sensitive test values redacted;
- [ ] analytics privacy evidence;
- [ ] completed physician copy packet;
- [ ] completed Boulevard cleanup packet;
- [ ] counsel-approved Terms/privacy record;
- [ ] rollback target.

Final preview decision:

- [ ] Approved for production gate
- [ ] Approved after listed corrections
- [ ] Not approved

Reviewer:

Decision date/time:

Exact reviewed commit:

Corrections required:

## Stop conditions

Stop the preview process and do not request production promotion when:

- the hosted commit differs from the reviewed commit;
- a valid synthetic lead receives success but no CRM record exists;
- any booking route reaches the wrong clinic/service or fails to render;
- a price, schedule, membership term, or medical claim conflicts with the approved source;
- analytics contains form or health information;
- a mobile visitor cannot operate the primary action;
- counsel, clinical-owner, billing/capacity, or canonical infrastructure gates remain open.

Passing this run sheet authorizes an owner decision about the production gate. It does not itself authorize production or paid traffic.
