# Google Ads booking attribution boundary

Implementation snapshot: October 19, 2026. This describes source behavior and mocked validation, not a completed public conversion or permission to enable uploads.

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
