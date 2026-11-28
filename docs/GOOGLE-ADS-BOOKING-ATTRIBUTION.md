# Google Ads booking attribution boundary

Current implementation: October 21, 2026. Website source `d03c03f` and booking backend `dd891ba` are live. This records source-to-booking linkage and verification limits; it is not a certificate of a genuine accepted Google conversion.

## October 21 source measurement

The existing cookie panel now explains measurement of how a visit began and whether it led to a confirmed appointment. Its styles, placement and controls are preserved. It is available on the exact inventory of public marketing pages; private tools, booking/API documents, previews and the separate weight-loss website remain outside this controller.

A broader purpose receipt is bound to the exact shared consent receipt and opaque revocation handle. The old Google-only receipt is not silently reused as permission to collect other sources. Before explicit grant, the bounded entry stays in memory only and no source capture request occurs. Decline and withdrawal remove the source and revoke its durable scope.

After grant, the controller sends only a finite source/medium category and evidence type, acquisition clinic, consent and revocation handle. A single valid Google click still takes precedence and retains bounded numeric campaign/ad-group IDs. Recognized search/social referrers and supported UTM links cover Google Business Profile, search, Facebook, Instagram, LinkedIn, email/newsletters, SMS and referrals. Raw referrer URLs/domains, landing paths, search terms, freeform campaign/content/term values, fbclid, patient contact details, treatments and payment data are not sent. The request uses an origin-only referrer.

Missing evidence is `direct_or_unknown`, never a claim of known direct traffic. A healthy previous source can survive a direct revisit within its original expiry; consumed, expired, revoked, differently scoped or corrupt evidence cannot be reused. This is the last measurable non-direct source for a booking session, not a cross-device or multi-touch identity graph. Sources for older unmeasured bookings cannot be reconstructed.

The receiver verifies the stored source and durable granted scope before returning `sourceStored:true` and issuing the existing opaque HttpOnly attribution cookie. The unchanged booking bridge forwards that cookie. The native booking bootstrap links it to the clinic's cart/session. The existing native verification and atomic outcome writer establish a confirmed appointment. A source capture, cart, reservation, card frame, or browser success event alone is not a confirmed booking.

All 640 website tests and 1,443 backend tests, TypeScript, focused website lint, local builds and remote production builds passed. Fourteen mocked external-boundary chain cases cover both clinics, non-Google outcomes, incomplete-cart suppression, verified-clinic Google job arguments and duplicate confirmation. The tests do not execute a real appointment or Google ingestion. Public CUA checks separately verified zero capture POSTs before choice, the exact bounded request, URL cleanup, live provider discovery and two session links to the same QA source, one at each clinic. Withdrawal was read back as denied on both the row and durable scope with source fields cleared. No time holds, card entry, appointments, charges or advertising uploads were created.

The actual HQ scheduler runs separately from its manually pinned app alias. On October 21 from 00:00–19:00 UTC, all 76 recovery runs and 38 uploader runs returned HTTP 200; the latest uploader reported live mode, healthy attribution, zero errors/configuration blocks, and no submitted events. Both real Google booked-appointment actions are enabled. No eligible confirmed Google outcome exists yet, so a genuine accepted and deduplicated advertiser conversion remains unproven.

The operator-only read query and source contract are in `rella-booking/reports/website-booking-attribution-report.sql` and `rella-booking/docs/website-source-attribution.md`. The query distinguishes confirmed native outcomes, unique sessions, later lifecycle states, unmeasured consent, and Google transport versus terminal success. It is not a public reporting endpoint. Non-Google sources never create Google conversion jobs.

The matching version 1.4.0 plugin is installed and active on all six retained Napa WordPress pages. Anonymous public readback verified the frozen controller, unchanged ordinary page content and booking destinations, no-store responses and origin-only referrer policy. A live newsletter/email handoff reached native Boulevard availability with its source attached; withdrawal cleared its QA-marked source records. Both Google conversion destinations and the existing iPhone braid counting attestation were verified without changing Ads settings or HQ. Package purchases remain a separate outcome and are not reported as appointments. No deposit behavior, policy or amount changed.

## Historical October 19 boundary

The remaining snapshot below describes the narrower Google-only implementation before the October 21 extension.

## Supported scope

The shared root mounts the existing first-party cookie-consent component once, so its controller persists while App Router navigation changes between ordinary and campaign route groups. Its existing wording and stylesheet are unchanged. The exact canonical apex and www hosts and an explicit inventory of public marketing routes are eligible; Preview, local, private/API/booking routes and the separate weight-loss surface remain inactive. Organic visitors without an existing consent/linkage indicator see no new UI and cause no capture request.

After the existing explicit advertising choice is granted, the controller sends exactly one bounded `gclid`, `gbraid` or `wbraid`, optional numeric campaign/ad-group IDs, the consent choice and an opaque revocation handle to `https://book.experiencerella.com/api/booking-v2/attribution`. The request explicitly uses an origin-only referrer. No landing path, service/treatment, contact, identity, DOB, payment data or freeform campaign text is sent. Unsupported or conflicting identifiers are not captured.

Clinic-specific entry paths supply Napa or Vacaville as acquisition context. General entry pages supply `unknown`; they do not guess a clinic. The backend derives a conversion's destination from the verified appointment's booking-session location, independently of that acquisition context.

An unresolved click can survive public soft navigation in controller memory only. It is not written to local/session storage or browser cookies. Grant acknowledgement or denial cleans attribution parameters from the current URL. An unconsented full reload or departure from the approved public surface can discard the in-memory click; no pre-consent persistence is introduced to prevent that loss.

The native cookie-choice UI remains distinct from operational booking/contact consent and optional promotions consent. Neither of those checkboxes grants advertising consent. Existing cookie/channel names are retained to honor prior choices and revocations.

## Booking continuity and withdrawal

The receiver owns opaque HttpOnly attribution/scope cookies. The website booking bridge forwards only its bounded cookie allowlist, including attribution, scope, denial sentinel and opaque revocation handle. It does not expose those identifiers to booking-page JavaScript.

A Book click held by the consent boundary resumes the existing in-site modal when applicable, keeping the original trigger's mobile navigation mounted until replay. External/no-JavaScript fallbacks keep their existing destinations. New cart creation waits for a granted capture already in flight; an older capture cannot acknowledge a newer click or unblock its cart. Denial remains fail-closed and carries no click identifiers. The existing family-wide revocation/handle rotation contract remains in place.

Guided-booking browser diagnostics emit generic local events only. They do not call advertising globals and do not include service identifiers. GA, Meta, GHL chat and other third-party marketing loaders remain absent from the booking/contact document.

## Limits and release evidence

- This is Google Ads click attribution, not all-channel attribution. Freeform UTMs, referrers, Meta/fbclid capture, GA4 reporting and Meta conversions are not added.
- The six protected WordPress entry paths remain served by WordPress in the controlled plan. This Next.js change does not install or certify their WordPress capture scripts or active-ad destinations.
- Source and mocked tests establish route coverage, consent boundaries, request fields, cart ordering, withdrawal and generic diagnostics. They do not establish public cookie delivery, a real completed appointment, HQ reconciliation, an accepted deduplicated advertising upload or package-sale measurement.
- A package purchase is separate from an appointment outcome. No package conversion contract or conversion value is introduced, and deposit behavior is unchanged.
- Before calling the Google chain complete, verify the exact deployed receiver and flags, public capture/cookie handoff, approved real appointment outcome, durable HQ reconciliation and eligible job, then the authorized destination acceptance and deduplication evidence. Do not generate fake production clicks/conversions or enable uploads to make a test pass.

Primary references: [Google Data Manager field mappings](https://developers.google.com/data-manager/api/devguides/events/google-ads/offline/upgrade/field-mappings), [Google Analytics healthcare data boundary](https://support.google.com/analytics/answer/13297105?hl=en). This implementation does not add a browser analytics tag or enhanced-conversion user-data matching.
