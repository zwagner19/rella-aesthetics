# Rella Growth and Conversion Pass — 2026-08-03

## Outcome

This pass strengthens the path from a search result or ad click to a measurable booking action without introducing unapproved medical, pricing, or outcome claims.

## What changed

### Mobile booking access

- Added a persistent mobile action bar across ordinary marketing pages.
- The bar always offers a direct call action and a booking action.
- The booking destination is context-aware:
  - the medical-weight-loss page stays inside its Napa/Vacaville consultation funnel;
  - the Napa location page uses the verified Napa Boulevard destination;
  - the Vacaville location page uses the verified Vacaville Boulevard destination;
  - all other ordinary pages use the safe business-level Boulevard widget.
- Campaign pages retain their separate focused shell and do not inherit this bar.

### Revenue-intent measurement

- Added one sitewide conversion observer for ordinary marketing routes.
- It distinguishes:
  - booking intent;
  - assessment intent;
  - booking-funnel starts;
  - phone and email intent;
  - contact-page intent;
  - successful contact-form leads.
- A contact form is recorded as `generate_lead` only after the lead API returns success.
- Booking clicks remain intent events; they are not mislabeled as completed appointments.
- Event payloads are deliberately generic. No form values, names, phone numbers, email addresses, provider names, location names, service selections, messages, or health information are sent by this layer.

Google Analytics event mapping:

| Action | GA4 event |
| --- | --- |
| Successful contact form | `generate_lead` |
| Booking, call, assessment, email, or funnel intent | `select_content` |

Meta event mapping:

| Action | Meta event |
| --- | --- |
| Successful contact form | standard `Lead` |
| Phone or email action | standard `Contact` |
| Booking click | custom `RellaBookingIntent` |
| Assessment or funnel start | custom `RellaFunnelStart` |

### Napa and Vacaville local landing pages

- Replaced the empty visual placeholders with complete, polished landing experiences.
- Added city-specific hero copy, address, phone, hours, directions, services, and repeated city-correct booking actions.
- Added canonical URLs and city-specific Open Graph metadata.
- Expanded structured data to describe each location as a `MedicalBusiness` and `DaySpa`, including its URL, map, parent organization, address, phone, hours, and service area.
- Increased sitemap priority for both location pages, the medical-weight-loss page, and the Napa Botox campaign page.

### Trust, gallery integrity, and indexation

- Added the authentic transferred portrait of Zachary Wagner, DO, to the medical-weight-loss consultation section.
- Replaced the placeholder Gallery page. It no longer implies that six nonexistent images are real patient outcomes.
- Reframed the route as a polished Results experience centered on natural-looking goals, informed consent for public photography, realistic expectations, and existing patient reviews.
- Renamed the navigation label from Gallery to Results while preserving the established `/gallery` URL.
- Added explicit canonical URLs to the homepage and every ordinary index landing page, plus dynamic blog articles.

## Verification

- Desktop visual review: Napa landing page passed.
- Mobile visual review: Napa landing page and medical-weight-loss page passed at 390 × 844.
- Mobile CTA routing visibly resolved to the correct Napa booking URL and the weight-loss city-choice section.
- 197 automated tests passed.
- Full lint check passed.
- Next.js 16 production build passed and generated 27 pages.
- Sitemap regenerated successfully.

## Production measurement setup

The tracking components remain inert when their existing environment variables are absent. Before launch, confirm:

1. `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set to the correct GA4 property.
2. `NEXT_PUBLIC_META_PIXEL_ID` is set only after the privacy/compliance decision for health-service pages.
3. `GHL_API_KEY` and `GHL_LOCATION_ID` are set so contact submissions create real CRM contacts.
4. The production domain is tested in GA4 DebugView and Meta Test Events.
5. Only successful `generate_lead` events are marked as lead conversions initially.
6. A later Boulevard completion or approved thank-you-page integration supplies the authoritative completed-appointment event. Booking-click intent must not be treated as a completed appointment.

## Remaining launch approvals

1. Confirm that the published Napa and Vacaville hours are current.
2. Approve the medical-weight-loss facts sheet: pricing/range, inclusions, medications, labs, monitoring cadence, and virtual-care boundaries.
3. Approve the privacy/compliance policy for GA4, Meta, and GHL chat on medical-weight-loss pages.
4. Confirm the production analytics and GHL environment variables.
5. Approve a preview deployment before any production cutover.

## Operating scorecard after launch

Review weekly by source and location:

- qualified leads;
- booking clicks;
- completed appointments from the scheduling source of truth;
- lead-to-book rate;
- booked-to-arrived rate;
- cost per qualified lead;
- cost per arrived patient;
- appointment capacity filled by location and service.

The website click event is an early signal. Boulevard or the scheduling system must remain the source of truth for completed and arrived appointments.

## Reference basis

- Google Analytics recommends `generate_lead` for an actually generated lead: <https://developers.google.com/analytics/devguides/collection/ga4/reference/events>
- Google recommends location-specific `LocalBusiness` structured data with complete address and business details: <https://developers.google.com/search/docs/appearance/structured-data/local-business>
- Google recommends explicit canonical URLs to consolidate duplicate signals: <https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls>
