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
npm run check:paid-search
npm run start
# In another terminal:
npm run check:legacy-redirects
npm run check:links
npm run check:booking-links
npm run check:seo
```

The production build also regenerates `public/sitemap.xml` through `next-sitemap`.
`check:links` reads the generated sitemap from `http://localhost:3000` by default and fails if a public page or internal destination returns an error, an indexed page has no internal inlink, an indexed page is unreachable from the homepage, or homepage crawl depth exceeds three. Set `SITE_URL` to run the same read-only check against another local port or an approved preview.

`check:booking-links` discovers the external booking URLs actually rendered by the sitemap pages, requires the three approved booking hosts, follows each destination without submitting a form, and fails on unreachable responses, non-HTTPS links, or redirects outside the approved Rella/JoinBLVD host set. It requires outbound network access. Set `SITE_URL` the same way when the preview uses another port.

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

`GHL_CUSTOM_FIELD_SERVICE_ID` and `GHL_CUSTOM_FIELD_LOCATION_ID` are strongly recommended for reporting and routing. Without them, service interest and an optional clinic preference are still preserved as non-destructive contact tags.

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
- The public form accepts a name plus either email or phone, matching the server contract and supporting phone-first prospects.
- A free-text message is stored only in the configured message custom field.
- Clinic preference accepts only Napa, Vacaville, or no preference; it is stored in the configured field when available and preserved as a routing tag either way.
- Form contents are never printed to application logs.
- Browser lead conversions fire only when the API returns `accepted: true`.
- The form provides direct phone and email fallback whenever delivery fails.
- A honeypot absorbs obvious bot submissions without creating contacts or firing lead conversions.

## Release process

Start with [`docs/OVERNIGHT-EXECUTIVE-HANDOFF-2026-08-03.md`](docs/OVERNIGHT-EXECUTIVE-HANDOFF-2026-08-03.md) for the current readiness decision, owner approvals, activation order, and operating priorities.

Use [`docs/PAID-ACQUISITION-CONTROL-PACK-2026-08-04.md`](docs/PAID-ACQUISITION-CONTROL-PACK-2026-08-04.md) before any Google Ads billing, status, budget, keyword, goal, audience, or final-URL change. Its machine-readable campaign plan must pass `npm run check:paid-search`, but a passing check is not authorization to activate ads.

The current live risk evidence is in [`docs/GOOGLE-ADS-LIVE-READONLY-AUDIT-2026-08-04.md`](docs/GOOGLE-ADS-LIVE-READONLY-AUDIT-2026-08-04.md). It records seven enabled campaigns at `$207/day`, recent spend, conversion-routing and tracking failures, and the exact recommendation awaiting owner authorization.

1. Build and test locally.
2. Create a preview deployment.
3. Complete every item in [`docs/REVENUE-PATH-LAUNCH-GATE-2026-08-03.md`](docs/REVENUE-PATH-LAUNCH-GATE-2026-08-03.md).
4. Obtain explicit approval for the preview.
5. Promote the approved build to production.
6. Re-run the contact, booking, analytics, and mobile checks on the production domain.

Do not start paid traffic merely because the website renders. A real test inquiry must appear in the correct HighLevel record and each location's booking route must reach the correct scheduler first.
