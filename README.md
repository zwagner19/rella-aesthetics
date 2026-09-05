# Rella Aesthetics marketing site

Next.js App Router site for `experiencerella.com`, including the focused Napa
Botox campaign page and the dedicated medical weight-loss host presentation.
Booking remains owned by the separate first-party booking application; this
repository only creates verified links to approved booking routes.

## Local verification

Use the Node version in `.nvmrc`, then run:

```bash
npm ci
npm test
npm run lint
npx tsc --noEmit
npm run audit:production
npm run build
```

`npm run audit:production` must report zero high or critical production
advisories before release. The optional Sanity CLI is development-only and is
assessed separately with `npm audit`; do not apply npm's proposed breaking
Sanity downgrade.

## Production configuration

Start from `.env.example` and set secrets only in the deployment platform.
Never commit real values.

The contact form is operational only when `GHL_API_KEY` and `GHL_LOCATION_ID`
are configured. `GHL_CUSTOM_FIELD_MESSAGE_ID` is also required to accept a
submission containing free text. Configure all three custom-field IDs so the
CRM preserves the visitor's selected service, clinic, and message in dedicated
fields.

Sanity content is optional at runtime: the site retains its local fallback
content when `NEXT_PUBLIC_SANITY_PROJECT_ID` is absent. See
`docs/SANITY-STUDIO-OPERATIONS.md` for the separate hosted Studio workflow.

Ordinary marketing pages may load the configured GA, Meta, and GHL chat
integrations. The exact `experiencerella.com/napa/botox` pilot is structurally
isolated from those integrations. It may send one bounded Google click payload
to the first-party booking endpoint only after the visitor accepts cookies.

## Release boundaries

- `experiencerella.com` serves the full marketing site.
- `weightloss.experiencerella.com` serves only the qualification funnel, its
  required assets, and host-correct SEO documents.
- The restricted Napa release alias serves only `/napa/botox` and required
  static assets.
- Public booking CTAs use `book.experiencerella.com` or the approved
  `book.rellaweightloss.com` consultation routes.
- No Boulevard SDK, cart, checkout, payment, appointment mutation, or Google
  conversion uploader runs in this repository.

See `POST_LAUNCH_CHECKLIST.md` and
`docs/BOOKING-ROUTING-IMPLEMENTATION-MAP.md` for the production verification
sequence.
