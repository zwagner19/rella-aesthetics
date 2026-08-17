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

- [ ] `NEXT_PUBLIC_RELLA_BOOKING_ORIGIN` points to the approved protected Rella booking preview for cross-preview QA; omit it for the production default
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
npm run check:paid-search
```

Record the actual test, route, and sitemap counts from the exact reviewed
commit. Do not reuse the August 3 checkpoint counts as a pass condition.

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

The protected hosted preview has its own Host header, so this hosted pass checks
the aesthetics response only. Do not force the branded weight-loss Host onto a
Vercel preview URL; that can route to a different deployment. The exact commit's
weight-loss branch is covered by the local production-build check above. After
an approved promotion, run the branded host check separately:

```bash
SITE_URL='https://experiencerella.com' \
BOOKING_CHECK_WEIGHT_LOSS_SITE_URL='https://weightloss.experiencerella.com' \
npm run check:booking-links
```

Prepared checkpoint expectation:

- 31 moved legacy routes, including both former WordPress sitemap endpoints, 2 retired routes, and 2 preserved records;
- 38 sitemap pages; record the exact internal-destination count from the candidate build;
- zero orphaned indexed pages and maximum homepage crawl depth no greater than three;
- both public host contexts inspected on the exact local build, plus the actual
  hosted aesthetics preview response;
- no direct Boulevard/JoinBLVD or Rella HQ destination;
- social-image and JSON-LD counts recorded from the exact build.
- Napa campaign provider schemas use the canonical `https://experiencerella.com/locations/napa#location` clinic entity, never `/napa#location`.

Record actual results and attach the output. HTTP success does not replace rendered-browser booking checks.

## Gate F — visual and rendered booking checks

Use no real patient's information. Inspect navigation, chooser, and service-intro
screens only. Stop before `Choose a date`; never create a cart, select a
professional, formula, treatment area, add-on, date, payment, or form field
unless a later specifically approved smoke test requires it.

### Website chooser

- [ ] Website `/book` shows exactly the Napa and Vacaville clinic choices.
- [ ] Each clinic choice stays on `book.experiencerella.com`.

### Custom-booking application

- [ ] Booking-app `/book` shows the approved 15-item catalog: 8 Napa and 7 Vacaville choices.
- [ ] No chooser or service-intro page exposes a Boulevard/JoinBLVD or Rella HQ link.
- [ ] IV remains call-assisted and `Anna (Event)` remains absent.

### Service paths

- [ ] Each of the 15 published aesthetics links opens its intended Rella service-intro route and returns 200.
- [ ] Napa Botox opens the exact custom `/book/napa/botox` route.
- [ ] Broad Vacaville chemical-peel intent remains a chooser; it must not silently force Universal Peel.
- [ ] IV routes remain unavailable for direct self-booking and show the call-assisted alternative.
- [ ] Napa and Vacaville weight-loss consultation and assessment routes load the intended city.

Fail for the wrong clinic, wrong service, 404, empty shell, a direct vendor/HQ
link, or an exposed excluded workflow. Do not begin a cart merely to prove the
intro screen.

### Visual baseline

- [ ] Desktop representative pages at 1440 × 1000.
- [ ] Mobile representative and high-intent pages at 390 × 844.
- [ ] One visible H1; no horizontal overflow; no clipped sticky action; no blocked form/policy controls.
- [ ] Keyboard focus enters the mobile menu, remains inside it, and returns to the menu trigger after Escape or close.
- [ ] Primary booking labels remain readable in default, hover, focus, and disabled states.
- [ ] Contact accepts name plus either email or phone and announces validation, sending, failure, and success states without losing entered data.
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
- [ ] current custom-booking catalog/provider-boundary evidence;
- [ ] counsel-approved Terms/privacy record;
- [ ] completed paid-acquisition owner decision card and a passing `npm run check:paid-search` result;
- [ ] current Google Ads billing, payment method, enabled-campaign, budget, network, location-option, final-URL, and conversion-role evidence;
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
- booking CTA clicks are primary, an unapproved sensitive-health audience is configured, or a paid-search final URL differs from the approved public path.

Passing this run sheet authorizes an owner decision about the production gate. It does not itself authorize production or paid traffic.
