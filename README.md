# Rella Aesthetics website

Production Next.js website for Rella Aesthetics in Vacaville and Napa. The site includes service discovery, local landing pages, Boulevard booking routes, a HighLevel lead form, conversion measurement, and Sanity-backed content.

## Run and verify

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Before sharing a release:

```bash
npm test
npm run lint
npm run build
```

The production build also regenerates `public/sitemap.xml` through `next-sitemap`.

## Environment configuration

Never commit real credentials. `.env.local` and hosted environment values stay outside Git.

### Revenue path: required

| Variable | Purpose | Failure behavior |
| --- | --- | --- |
| `NEXT_PUBLIC_BOULEVARD_API_KEY` | Loads the Boulevard booking experience | Booking widget cannot initialize |
| `NEXT_PUBLIC_BOULEVARD_BUSINESS_ID` | Selects the Rella business in Boulevard | Booking widget cannot initialize |
| `GHL_API_KEY` | Sends contact inquiries to HighLevel | Contact form fails closed and displays phone/email fallback |
| `GHL_LOCATION_ID` | Places the contact in the correct HighLevel sub-account | Contact form fails closed |
| `GHL_CUSTOM_FIELD_MESSAGE_ID` | Stores the prospect's message in a dedicated HighLevel field | Contact form fails closed; messages are never hidden in logs or `source` |

`GHL_CUSTOM_FIELD_SERVICE_ID` is strongly recommended for reporting. Without it, service interest is still added as a contact tag.

The HighLevel token must be a sub-account/private integration token with `contacts.write` access. Use the `2021-07-28` API version configured in `src/lib/ghl.ts`.

### Content and security

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project used for site content |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset; defaults to `production` |
| `SANITY_WEBHOOK_SECRET` | Authenticates `/api/revalidate`; the endpoint fails closed when missing |

### Measurement and optional tools

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Ordinary-site GA4 measurement |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta measurement after privacy/compliance approval |
| `NEXT_PUBLIC_GTM_ID` | Campaign-shell GTM container |
| `NEXT_PUBLIC_GHL_CHAT_WIDGET_ID` | Optional HighLevel chat widget |
| `NEXT_PUBLIC_AI_CHATBOT_URL` | Optional approved chatbot URL |

Do not place names, emails, phone numbers, messages, provider selections, or health information into analytics events.

## Lead-delivery contract

`POST /api/leads` accepts a prospect only after HighLevel confirms an upserted contact. Repeat inquiries use HighLevel's upsert endpoint. Tags are added separately so existing tags are not overwritten.

- Missing CRM configuration returns an error, never a fake success.
- A free-text message is stored only in the configured message custom field.
- Form contents are never printed to application logs.
- Browser lead conversions fire only when the API returns `accepted: true`.
- The form provides direct phone and email fallback whenever delivery fails.
- A honeypot absorbs obvious bot submissions without creating contacts or firing lead conversions.

## Release process

1. Build and test locally.
2. Create a preview deployment.
3. Complete every item in [`docs/REVENUE-PATH-LAUNCH-GATE-2026-08-03.md`](docs/REVENUE-PATH-LAUNCH-GATE-2026-08-03.md).
4. Obtain explicit approval for the preview.
5. Promote the approved build to production.
6. Re-run the contact, booking, analytics, and mobile checks on the production domain.

Do not start paid traffic merely because the website renders. A real test inquiry must appear in the correct HighLevel record and each location's booking route must reach the correct scheduler first.
