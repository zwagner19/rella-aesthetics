<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This repo is a single Next.js 16 (Turbopack) marketing/booking site for Rella Aesthetics. `.nvmrc` pins Node 20; the VM's Node 22 also satisfies `engines` (`>=20.9.0`). Scripts live in `package.json`: `dev`, `build`, `start`, `lint`, `test`.

- The app runs standalone with no secrets. Sanity is optional: `src/sanity/client.ts` returns a `null` client when `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset, and pages fall back to hardcoded content in `src/lib/data.ts`. The lead API (`src/app/api/leads/route.ts`) runs in "local" mode without `GHL_API_KEY`/`GHL_LOCATION_ID` — it returns `{success, mode:"local"}` and just logs the lead instead of hitting GoHighLevel. Provide those env vars (in `.env.local`) only if you need real Sanity content or CRM/GHL integration.
- Dev server: `npm run dev` on port 3000. Good end-to-end smoke test: submit the `/contact` form (posts to `/api/leads`) and confirm the "Thank you!" state.
- `npm run build` triggers a `postbuild` (`next-sitemap`) step that regenerates `public/sitemap-0.xml`/`sitemap.xml`. Discard those regenerated files after a local build — do not commit build-generated sitemap churn.
