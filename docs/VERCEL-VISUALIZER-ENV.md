# Adding Vercel Environment Variables for the AI Visualizer

The visualizer needs a few secrets in Vercel before live AI previews and GHL lead capture work on the preview/production URLs.

## Share publicly (anyone with the link)

The visualizer at `/see-your-results` is **public** — no login, no paywall, and no contact info required to see a preview.

### If visitors hit a Vercel login wall

Preview URLs (`*.vercel.app`) may be blocked by **Vercel Deployment Protection**. To let anyone with the link use it:

1. Open [Vercel → rella-nextjs → Settings → Deployment Protection](https://vercel.com/zwagner19s-projects/rella-nextjs/settings/deployment-protection)
2. For **Preview** deployments, set protection to **Off** (or use a shared password for testers)
3. Redeploy or re-share the preview URL

Production (`https://experiencerella.com/see-your-results`) is public once merged.

## Step 1 — Open Vercel project settings

1. Go to [vercel.com/zwagner19s-projects/rella-nextjs](https://vercel.com/zwagner19s-projects/rella-nextjs)
2. Click **Settings** → **Environment Variables**

Add the same variables to **rella-aesthetics** if that project also deploys this repo.

## Step 2 — Add required variables

| Variable | Required | Where to get it | Environments |
|----------|----------|-----------------|--------------|
| `OPENAI_API_KEY` | Yes (for live AI) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | Production, Preview, Development |
| `GHL_API_KEY` | Yes (for leads) | GoHighLevel → Settings → API Keys | Production, Preview |
| `GHL_LOCATION_ID` | Yes (for leads) | GoHighLevel location settings | Production, Preview |

### Optional

| Variable | Purpose |
|----------|---------|
| `VISUALIZER_BLOB_READ_WRITE_TOKEN` | Temp image storage (Vercel Blob dashboard → create RW token) |
| `GHL_CUSTOM_FIELD_SERVICE_ID` | Map service interest to a GHL custom field |
| `GHL_CUSTOM_FIELD_MESSAGE_ID` | Map intake summary to a GHL custom field |
| `GHL_CUSTOM_FIELD_VISUALIZER_SESSION_ID` | Store visualizer session ID on contact |

## Step 3 — Redeploy

After saving env vars:

1. Open [PR #19](https://github.com/zwagner19/rella-aesthetics/pull/19)
2. Click **Deployments** → **Redeploy** on the latest preview  
   — or push a new commit to trigger a fresh build

Env vars are baked in at **build/runtime** for serverless functions — a redeploy is required after adding them.

## Step 4 — Verify

1. Open `/see-your-results` on the Vercel preview URL
2. Try **Botox** and **Laser — Pigmentation** (or `/see-your-results?treatment=laser`)
3. Upload a selfie and click **Continue**
3. **Without** `OPENAI_API_KEY`: you should see "Demo preview mode" and a subtle blur preview
4. **With** `OPENAI_API_KEY`: demo banner should be gone; preview takes ~10–20s

## Troubleshooting

### "Photo is too large" / 413 error

Phone photos are now auto-compressed client-side before upload. If you still hit this:

- Retake with a smaller resolution, or
- Use a photo under ~5MB original size

### "Unexpected token 'R'" JSON error

This was caused by the server returning plain text (`Request Entity Too Large`) instead of JSON. Fixed in the latest branch with client compression + clearer error handling.

### Leads not appearing in GHL

- Confirm `GHL_API_KEY` and `GHL_LOCATION_ID` are set for **Preview** (not just Production)
- Redeploy after adding vars
- Check Vercel function logs for `[visualizer/lead]` errors

## Production (experiencerella.com)

Merge PR #19, then confirm the same env vars exist on the **Production** environment in Vercel. The live URL will be:

**https://experiencerella.com/see-your-results**
