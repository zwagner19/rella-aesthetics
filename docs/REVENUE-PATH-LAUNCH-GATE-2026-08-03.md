# Rella revenue-path launch gate — 2026-08-03

## Decision rule

The website is ready for a preview deployment after the repository checks pass. It is ready for production traffic only when every blocking item below is verified on that exact deployment.

No paid campaign should point to the site until one real test inquiry is visible in the correct HighLevel sub-account and both clinic booking journeys reach the correct Boulevard destination.

## Blocking launch checks

### 1. Build integrity

- [ ] `npm test` passes with no skipped revenue-path suite.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes and regenerates the sitemap.
- [ ] `npm run check:links` passes against the exact preview deployment.
- [ ] `npm run check:booking-links` passes against the exact preview deployment with outbound network access.
- [ ] `npm run check:seo` passes against the exact preview deployment.
- [ ] Every distinct external booking URL is opened in a real browser on the exact preview; HTTP 200 alone does not pass this gate.
- [ ] The preview commit matches the commit that was reviewed.

### 2. Contact-form delivery

- [ ] `GHL_API_KEY` is a server-side secret and is not exposed as a `NEXT_PUBLIC_` variable.
- [ ] `GHL_LOCATION_ID` points to the intended Rella sub-account.
- [ ] `GHL_CUSTOM_FIELD_MESSAGE_ID` points to a dedicated large-text contact field.
- [ ] `GHL_CUSTOM_FIELD_SERVICE_ID` is configured for clean service reporting.
- [ ] `GHL_CUSTOM_FIELD_LOCATION_ID` is configured for clean clinic routing, or the owner has deliberately approved the location-tag fallback.
- [ ] Submit a unique preview lead from `/contact` with name, email, phone, service, clinic preference, and a recognizable test message.
- [ ] The website shows success only after submission completes.
- [ ] The contact is visible in HighLevel under the intended location.
- [ ] The record contains the exact email and normalized phone.
- [ ] `source` is `Rella Website — Contact Form`.
- [ ] The message appears intact in the dedicated message field.
- [ ] The service appears in its custom field and as an `interest-*` tag.
- [ ] The clinic preference appears in its custom field when configured and as the correct `location-*` tag.
- [ ] `website-lead` is present without deleting any existing tags on a repeat-contact test.
- [ ] The browser records one `generate_lead`/Lead event only for the CRM-accepted submission.
- [ ] Delete or clearly label the test contact after verification.

Use a unique label such as `Rella Site Test 20260803-2215`; do not use a real patient's information.

### 3. Failure and fallback behavior

- [ ] On a non-production test deployment with the CRM key intentionally absent, submission does not show success.
- [ ] The error state shows clickable `707.358.2928` and `info@experiencerella.com` alternatives.
- [ ] Application logs contain no submitted name, email, phone, service, or message.
- [ ] A filled hidden `website` honeypot returns no CRM record and no lead conversion.

### 4. Booking path

- [ ] Global booking opens `/book`, presents exactly Napa and Vacaville, and never calls Boulevard's broken legacy business-level URL.
- [ ] Each `/book` clinic action renders Boulevard's live `Menu` screen and never `#/not-found`, “things have moved,” or an empty booking shell.
- [ ] Repeat both `/book` clinic actions after beginning a journey at the opposite clinic; Boulevard's returning-browser cart state must not leave the patient in the wrong clinic.
- [ ] Every ordinary treatment page opens the Vacaville/Napa chooser instead of a generic booking destination.
- [ ] Each treatment page's Napa and Vacaville actions preserve the selected clinic and never cross-route into the other clinic.
- [ ] Every advertised service-location pairing is visible in that clinic's live booking menu; a service unavailable at one clinic does not render a booking CTA or structured-data claim for that city.
- [ ] The treatment-page mobile action bar opens the same clinic chooser and does not cover it at 390 × 844.
- [ ] Napa location booking reaches the verified Napa destination.
- [ ] `/vacaville/botox` returns HTTP 200, uses its exact slashless canonical, and every booking action reaches the Vacaville menu rather than Napa or the generic chooser.
- [ ] `/napa/`, `/napa/botox/`, `/napa/filler/`, `/napa/laser/`, `/napa/hydrafacial/`, and `/napa/hyperhidrosis/` all return HTTP 200 on the exact preview commit.
- [ ] `/blog/botox-cost-napa` and `/images/og-botox-cost-napa.png` both return HTTP 200 on the exact preview commit.
- [ ] The Botox pricing article canonical is the public article URL, and its Open Graph/X image resolves on the public domain.
- [ ] Every Book action on the Botox pricing article reaches the hardened Napa Botox destination.
- [ ] Each Napa service page keeps every Book action on its one approved service/location destination.
- [ ] Each Napa booking click emits one `booking_start` signal with the correct service label and no personal or health information.
- [ ] Vacaville location booking reaches the verified Vacaville destination.
- [ ] The Vacaville chemical-peel action opens the live Vacaville menu; do not reinstate the tested-broken `/cart/menu/Peels` handoff without a new rendered-browser pass.
- [ ] Medical weight-loss visitors can choose Napa or Vacaville before leaving the page.
- [ ] The sticky mobile action bar does not cover form controls or legal copy at 390 × 844.
- [ ] Booking clicks are tracked as intent, not completed appointments.

### 5. Trust, claims, and local accuracy

Source verification note (2026-08-03): the approved July 15 Signature Menu and Memberships documents specify Napa Tuesday–Saturday 9am–5pm and Vacaville Wednesday–Saturday 9am–5pm. They explicitly supersede the live site's shared Monday–Friday/Saturday hours and the Napa Wednesday–Saturday prototype. The live Contact page still supports the central phone, both addresses, and email, but it is not the controlling hours source. Reconfirm the approved schedules with the owner and Google Business Profile immediately before cutover.

- [ ] About displays Zachary Wagner, DO as Physician Owner.
- [ ] The credential reads `American Board of Obesity Medicine diplomate`.
- [ ] The authentic Dr. Wagner portrait renders clearly on desktop and mobile.
- [ ] Public prices match the approved July 24, 2026 pricing canon or a newer explicitly approved source.
- [ ] The Membership page matches the approved injectable dues, product-specific member rates, included HydraFacial tiers, redemption timing, 10% retail benefit, and one-year terms.
- [ ] A synthetic `Membership Questions` inquiry reaches HighLevel with the expected service field and interest tag.
- [ ] The Botox pricing article's membership commitment, deposit boundary, arithmetic disclaimer, visible FAQs, and structured data match the approved public facts.
- [ ] Napa and Vacaville addresses, phone, and published hours are confirmed current.
- [ ] Weight-management claims, medication wording, pricing, labs, monitoring cadence, and virtual-care boundaries have final clinical approval.

### 6. Measurement and privacy

- [ ] Counsel supplies Rella Aesthetics-specific Terms and a website/privacy policy covering the actual data stack; publish that text verbatim and record the approval date.
- [ ] `/terms` contains no Rella Weight Loss language, unsupported 24-hour policy, or unapproved fee promise.
- [ ] `/cancellation-policy` states the approved 48-hour policy and keeps the Napa $50 booking deposit separate from per-unit treatment pricing.
- [ ] Footer, booking, and consent links resolve to the approved legal and cancellation pages on the exact production host.
- [ ] GA4 property ownership and `NEXT_PUBLIC_GA_MEASUREMENT_ID` are confirmed.
- [ ] `generate_lead` is marked as a conversion only after a successful test.
- [ ] Meta Pixel and GHL chat are enabled on health-service pages only after the privacy/compliance decision.
- [ ] GA4 DebugView and Meta Test Events contain no names, emails, phone numbers, messages, service choices, location choices, or health information.
- [ ] Boulevard remains the source of truth for completed and arrived appointments.

## Production cutover

- [ ] Google Ads past-due balance and suspension risk are confirmed resolved before any campaign expansion.
- [ ] Enabled Napa, Vacaville, and weight-loss campaign states are reconciled against the owner's intended budget plan.
- [ ] The preview has explicit owner approval.
- [ ] A rollback target is identified before promotion.
- [ ] Production environment values match the verified preview values.
- [ ] Production contact and booking smoke tests pass immediately after cutover.
- [ ] Domain, canonical URLs, robots file, sitemap, and HTTPS resolve correctly.

## Stop and roll back if

- a valid inquiry receives a success message but no HighLevel record exists;
- Napa or Vacaville booking reaches the wrong clinic or fails to load;
- production emits repeated application errors on `/api/leads`;
- a public price or medical claim conflicts with the approved source;
- analytics receives form contents or health information;
- mobile visitors cannot reach or operate the primary CTA.

Pause paid traffic first. Restore the last known-good deployment, verify contact and booking behavior, document the cause, and repeat this gate before resuming.

## First 24 hours

- Review `/api/leads` error rate at launch, +1 hour, +4 hours, and next business morning.
- Reconcile HighLevel contacts against successful `generate_lead` events; investigate any mismatch.
- Reconcile booking-intent events against Boulevard starts and completed appointments.
- Review mobile conversion actions separately from desktop.
- Call back new qualified inquiries according to the practice's approved response process.

## Weekly operating review

Review by source, service, and location:

- qualified leads;
- contact-to-book rate;
- booked-to-arrived rate;
- appointment capacity filled;
- cost per qualified lead;
- cost per arrived patient;
- lead-response time;
- CRM delivery failures and booking-route failures.

Clicks indicate intent. HighLevel confirms captured inquiries; Boulevard confirms appointments; the practice's operating system confirms arrivals and revenue.
