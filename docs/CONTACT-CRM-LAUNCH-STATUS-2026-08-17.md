# Contact form / HighLevel launch status — 2026-08-17

## Decision

**Blocked for public launch.** The form implementation fails closed correctly,
but no Rella Aesthetics Vercel environment currently has the HighLevel delivery
configuration, and no CRM-accepted synthetic lead has been verified on the
release preview.

This audit made no CRM record, environment-variable, production, DNS, merge, or
deployment change. No credential value was read, copied, printed, or committed.

## Verified evidence

- Vercel project: `rella-aesthetics` (`prj_3ppAinB6Uzy0i0WA1OxB81rubmnD`).
- Production currently has `NEXT_PUBLIC_GA_MEASUREMENT_ID` and
  `NEXT_PUBLIC_GTM_ID`; it has none of the five `GHL_*` variables required by
  the contact form.
- Preview currently has the branch-scoped booking origins and
  `NEXT_PUBLIC_GA_MEASUREMENT_ID`; it has none of the five required `GHL_*`
  variables.
- Development currently has no hosted environment variables.
- The separate `rella-hq` Vercel project has sensitive `GHL_PIT_TOKEN` and
  `GHL_LOCATION_ID` entries in Preview and Production. Sensitive Vercel values
  cannot be recovered through the CLI, and their presence in another project
  does not prove the correct location, `contacts.write` scope, or suitability
  for a public website form. They were not copied.
- The only local HighLevel credential file found contains empty quoted
  placeholders, not usable credentials.
- `POST /api/leads` requires `GHL_API_KEY`, `GHL_LOCATION_ID`, and
  `GHL_CUSTOM_FIELD_MESSAGE_ID`, and returns a non-success response when any
  required delivery destination is absent.
- Contact data is not printed to application logs. A browser conversion fires
  only after the API returns `accepted: true`.
- The focused server and browser form suites pass: 14 tests across
  `src/app/api/leads/route.test.ts` and
  `src/app/(site)/contact/ContactForm.test.tsx`.

## Exact configuration still required

In the intended Rella HighLevel sub-account, an owner with HighLevel admin
access must provide or mint a **sub-account Private Integration Token** with the
minimum `contacts.write` scope. HighLevel documents that scope for
`POST /contacts/upsert`.

The owner must also confirm the sub-account/location ID and the IDs of these
contact fields:

1. `Website Inquiry Message` — multiline or large-text field; required.
2. `Website Service Interest` — text or approved single-select field; required
   for clean reporting.
3. `Website Clinic Preference` — text or approved single-select field that
   accepts `Napa`, `Vacaville`, and `No preference`; required unless the owner
   explicitly accepts tag-only routing.

Add the values to **Preview only** first, as sensitive server-side values:

- `GHL_API_KEY`
- `GHL_LOCATION_ID`
- `GHL_CUSTOM_FIELD_MESSAGE_ID`
- `GHL_CUSTOM_FIELD_SERVICE_ID`
- `GHL_CUSTOM_FIELD_LOCATION_ID`

Do not prefix any of them with `NEXT_PUBLIC_`. Do not reuse the separate
`rella-hq` token merely because an entry with a similar purpose exists.

## Acceptance and cleanup sequence

1. Redeploy the exact approved website commit after Preview receives the five
   values.
2. Use a unique nonpatient identity such as
   `Rella Preview Test 20260817-<time>` and a dedicated test email/phone.
3. Submit one `/contact` inquiry with a nonmedical test message, service, and
   clinic preference.
4. Require browser success only after HighLevel accepts the request.
5. In the intended HighLevel sub-account, verify exactly one contact, source
   `Rella Website — Contact Form`, intact message, service/clinic fields, and
   `website-lead`, `interest-*`, and `location-*` tags.
6. Verify exactly one lead conversion and no form values in analytics.
7. Delete the synthetic contact or retain it only under an owner-approved test
   convention, then record the evidence with test values redacted.
8. Only after that pass, enter the verified values in Production and repeat one
   immediate post-cutover smoke test.

The current credentials are not a dedicated test credential and no verified
cleanup path was available, so this audit deliberately did not submit a live
synthetic lead.

## Authoritative API references

- HighLevel upsert contact (`contacts.write`):
  https://marketplace.gohighlevel.com/docs/2021-07-28/ghl/contacts/upsert-contact/index.html
- HighLevel contact custom fields (`locations/customFields.readonly` for
  read-only discovery):
  https://marketplace.gohighlevel.com/docs/ghl/locations/get-custom-fields/

