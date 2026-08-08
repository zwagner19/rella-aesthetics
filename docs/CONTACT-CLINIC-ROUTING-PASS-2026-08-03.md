# Contact clinic-routing pass — 2026-08-03

## Outcome

The website contact form can now carry a prospect's optional clinic preference into the existing HighLevel lead workflow.

Accepted choices are deliberately narrow:

- Vacaville;
- Napa;
- No preference — help me choose.

The form explains that the choice helps route the question and does not prevent the prospect from changing locations later.

No live CRM submission, deployment, ad edit, campaign-state change, billing action, environment change, push, merge, or public cutover was performed.

## Why this mattered

The existing form captured service interest but not clinic preference. The team could receive a valid inquiry and still need another contact cycle before knowing where to route it. That delay is especially costly when a prospect is ready to schedule.

The new field reduces an avoidable follow-up question while remaining optional so it does not block someone who is unsure.

## Delivery contract

### Browser

- Sends the selected clinic only inside the existing contact request.
- Does not add the clinic selection to the conversion event.
- Continues to fire a lead conversion only after the API returns `accepted: true`.
- Continues to provide phone and email recovery when delivery fails.

### Lead API

- Trims and length-limits the submitted value.
- Accepts only the three public choices.
- Rejects any unrecognized value with HTTP 400 before contacting HighLevel.
- Adds one non-destructive routing tag:
  - `location-napa`;
  - `location-vacaville`;
  - `location-flexible`.
- Stores the human-readable preference in `GHL_CUSTOM_FIELD_LOCATION_ID` when that field is configured.
- Preserves the routing tag if the optional custom field is absent.
- Does not print the preference or any other form contents to application logs.

This extends the existing service-interest pattern; the HighLevel upsert still does not overwrite the contact's existing tags.

## Environment configuration

Recommended server-only variable:

`GHL_CUSTOM_FIELD_LOCATION_ID`

Create a HighLevel contact custom field for clinic preference and set this variable to that field's ID. Never prefix it with `NEXT_PUBLIC_`.

If the field is not configured, the lead can still be accepted and the normalized location tag remains available for routing. The custom field is recommended because it is clearer for staff, filters, and reporting.

## Verification

- 253 automated checks passed across 17 test files.
- Contract tests verify Napa custom-field delivery, Napa routing tag, Vacaville tag-only fallback, and rejection of an unknown location before any CRM call.
- Full ESLint pass completed with no findings.
- TypeScript completed with no errors.
- Next.js 16.2.12 production build generated 33 routes.
- Release crawl passed across 27 sitemap pages and 36 unique internal destinations.
- The optimized preview returned all three location options in the contact form.
- A local synthetic request with an invalid clinic returned HTTP 400.
- A local synthetic request with Napa returned HTTP 503 because CRM credentials are intentionally absent, proving the existing fail-closed behavior remains intact.
- No real contact was created.
- The optimized local preview is running at `http://localhost:3010` from this exact build.

## Production acceptance test

On the exact preview deployment with the intended HighLevel configuration:

1. Submit a uniquely labeled synthetic inquiry with Napa selected.
2. Confirm the contact appears in the intended sub-account.
3. Confirm the location custom field reads `Napa`.
4. Confirm the contact has `location-napa`, `website-lead`, and the expected service-interest tag.
5. Repeat with Vacaville and confirm `location-vacaville` without deleting existing tags.
6. Confirm the browser emits one successful lead conversion and that analytics contains no name, email, phone, message, service choice, or clinic choice.
7. Delete or clearly label the synthetic contacts after verification.

Paid traffic should not rely on the form until this production-like CRM acceptance test passes.
