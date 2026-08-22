# AI Treatment Visualizer — Rella Aesthetics

Conservative selfie-based treatment preview funnel at **https://experiencerella.com/see-your-results**.

Supported treatments:

- **Botox & Dysport** — forehead, frown lines, crow's feet
- **Laser — Pigmentation** — sun spots, melasma, uneven tone (IPL/laser simulation)

Deep link for laser: `/see-your-results?treatment=laser-pigmentation` (also accepts `?treatment=laser`).

## Environment variables

See **[docs/VERCEL-VISUALIZER-ENV.md](./VERCEL-VISUALIZER-ENV.md)** for step-by-step Vercel setup.

Add to `.env.local` (or Vercel project settings):

```bash
# Required for live AI previews (falls back to demo blur mode without it)
OPENAI_API_KEY=

# Optional: temporary image storage with auto-managed blob lifecycle
VISUALIZER_BLOB_READ_WRITE_TOKEN=

# Lead capture (same as contact form)
GHL_API_KEY=
GHL_LOCATION_ID=

# Optional GHL custom field UUIDs
GHL_CUSTOM_FIELD_SERVICE_ID=
GHL_CUSTOM_FIELD_MESSAGE_ID=
GHL_CUSTOM_FIELD_VISUALIZER_SESSION_ID=
```

## Flow

1. Patient consents and uploads a selfie
2. Vision analysis validates photo quality and suggests treatment zones
3. Masked image edit + conservative blend produces a subtle preview
4. Short intake + contact info unlocks full preview and creates a GHL lead
5. Booking CTA routes via `resolveBookingHref({ service })` — `botox` or `laser-treatments`

## Compliance

- Required 18+ photo consent checkbox
- "SIMULATION" watermark on all after images
- Privacy policy section documents 24-hour photo retention
- Previews are not medical advice; in-person consultation required

## API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/visualizer/analyze` | POST | Face quality + zone detection |
| `/api/visualizer/generate` | POST | Conservative preview generation |
| `/api/visualizer/lead` | POST | GHL lead with scoring tags |

## Demo mode

When `OPENAI_API_KEY` is unset, `/api/visualizer/generate` applies a subtle zone-limited blur instead of calling OpenAI. The UI shows a demo mode notice.
