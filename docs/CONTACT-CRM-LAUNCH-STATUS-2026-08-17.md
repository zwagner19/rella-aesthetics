# Contact form / HighLevel launch status — 2026-08-17

## Decision

**Preview acceptance passed; Production promotion remains a launch gate.** The
protected Preview is configured for the intended Rella HighLevel sub-account and
one labeled nonpatient lead completed the acceptance and cleanup sequence.
Production remains intentionally unconfigured and untouched.

No credential value or custom-field ID is printed or committed in this record.

## Verified evidence

- Vercel project: `rella-aesthetics` (`prj_3ppAinB6Uzy0i0WA1OxB81rubmnD`).
- Production currently has `NEXT_PUBLIC_GA_MEASUREMENT_ID` and
  `NEXT_PUBLIC_GTM_ID`; it has none of the five `GHL_*` variables required by
  the contact form.
- Preview has the branch-scoped booking origins, `NEXT_PUBLIC_GA_MEASUREMENT_ID`,
  and all five required server-side `GHL_*` variables.
- Development currently has no hosted environment variables.
- The separate `rella-hq` Vercel project has sensitive `GHL_PIT_TOKEN` and
  `GHL_LOCATION_ID` entries in Preview and Production. Sensitive Vercel values
  cannot be recovered through the CLI, and their presence in another project
  does not prove the correct location, `contacts.write` scope, or suitability
  for a public website form. They were not copied.
- `POST /api/leads` requires `GHL_API_KEY`, `GHL_LOCATION_ID`, and
  `GHL_CUSTOM_FIELD_MESSAGE_ID`, and returns a non-success response when any
  required delivery destination is absent.
- Contact data is not printed to application logs. A browser conversion fires
  only after the API returns `accepted: true`.
- The focused server and browser form suites pass: 14 tests across
  `src/app/api/leads/route.test.ts` and
  `src/app/(site)/contact/ContactForm.test.tsx`.

## Preview acceptance evidence

- Preview deployment: `dpl_9RBoAAq1BMzaJo5vw5uc699gNJ3y`.
- Test submitted through the protected Preview `/contact` route on August 17,
  2026 at approximately 10:30am PDT.
- It used a clearly labeled nonpatient test identity and message, `Facials` as
  the service interest, and `Napa` as the clinic preference.
- HighLevel showed source `Rella Website — Contact Form`.
- The dedicated message, service-interest, and clinic-preference fields were
  populated correctly.
- Tags were `website-lead`, `interest-facials`, and `location-napa`.
- No opportunity or outbound conversation was created.
- The synthetic contact was deleted after verification; HighLevel indicated it
  remains recoverable for 60 days.

## Configured Preview contract

The intended Rella HighLevel sub-account now has a Private Integration Token
with the required contact-write access, its location ID, and these dedicated
Contact fields:

1. `Website Inquiry Message` — multiline or large-text field; required.
2. `Website Service Interest` — text or approved single-select field; required
   for clean reporting.
3. `Website Clinic Preference` — text or approved single-select field that
   accepts `Napa`, `Vacaville`, and `No preference`; required unless the owner
   explicitly accepts tag-only routing.

The corresponding values are stored in **Preview only** as sensitive
server-side values:

- `GHL_API_KEY`
- `GHL_LOCATION_ID`
- `GHL_CUSTOM_FIELD_MESSAGE_ID`
- `GHL_CUSTOM_FIELD_SERVICE_ID`
- `GHL_CUSTOM_FIELD_LOCATION_ID`

None is prefixed with `NEXT_PUBLIC_`. Their secret values and field IDs must not
be copied into source control or release notes.

## Remaining Production sequence

1. Promote the same five verified values to Production when creating the exact
   approved production candidate.
2. Use a new unique nonpatient identity and dedicated test email/phone.
3. Submit one `/contact` inquiry with a nonmedical test message, service, and
   clinic preference after the public cutover.
4. Require browser success only after HighLevel accepts the request.
5. In the intended HighLevel sub-account, verify exactly one contact, source
   `Rella Website — Contact Form`, intact message, service/clinic fields, and
   `website-lead`, `interest-*`, and `location-*` tags.
6. Verify exactly one lead conversion and no form values in analytics.
7. Delete the synthetic contact or retain it only under an owner-approved test
   convention, then record the evidence with test values redacted.
8. If contact delivery, fields, tags, or analytics privacy fail, restore the
   previous public origin and investigate before accepting real inquiries.

## Authoritative API references

- HighLevel upsert contact (`contacts.write`):
  https://marketplace.gohighlevel.com/docs/2021-07-28/ghl/contacts/upsert-contact/index.html
- HighLevel contact custom fields (`locations/customFields.readonly` for
  read-only discovery):
  https://marketplace.gohighlevel.com/docs/ghl/locations/get-custom-fields/
