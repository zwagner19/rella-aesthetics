# Rella Before/After References for AI Visualizer

Use real Rella patient outcomes to calibrate preview style — **not** to fine-tune a model. We distill each consented before/after pair into short style notes that get injected into the generate prompt.

## Google Drive access

**This agent does not currently have access to your Google Drive.** The Google Drive MCP integration must be authenticated in Cursor first.

### Connect Google Drive in Cursor

1. Open **Cursor Settings → MCP → Google Drive**
2. Click **Authenticate** and sign in with the account that owns the B&A folder
3. Start a new agent message: *“Sync my Rella B&A folder from Google Drive”* and share the folder name or link

Until Drive is connected, you can export or download the folder locally and use the sync script below.

## Quick start (local folder)

1. Export or copy your Drive folder to your machine
2. Name pairs consistently:
   - `case-01-before.jpg` + `case-01-after.jpg`
   - Or use subfolders: `botox/`, `laser-pigmentation/`
3. Sync into the project (photos stay gitignored):

```bash
npm run visualizer:sync-references -- --source ~/Downloads/Rella-BA
```

4. Distill style notes with OpenAI vision:

```bash
OPENAI_API_KEY=sk-... npm run visualizer:distill-references
```

5. Redeploy — `/api/visualizer/generate` automatically picks the best matching reference style for each treatment + zone.

## Consent

Only include patients with **explicit consent for AI/simulation use**. Marketing gallery rights are not enough. Mark `consentOnFile: true` only for approved cases (sync script sets this when importing — review before distill).

## What gets committed

| File | Committed? |
|------|------------|
| `data/visualizer-references/manifest.json` | Yes (metadata + style notes only) |
| `data/visualizer-references/**/*.jpg` | **No** (gitignored) |

For production on Vercel, either:
- Commit only the distilled `manifest.json` after running distill locally, or
- Store reference images in private Vercel Blob and extend the manifest with blob URLs

## Folder structure

```
data/visualizer-references/
  manifest.json
  botox/
    case-01-before.jpg
    case-01-after.jpg
  laser-pigmentation/
    case-01-before.jpg
    case-01-after.jpg
```

## After Google Drive is connected

Ask the agent to:

1. List folders matching “before after” or “Rella”
2. Download pairs into `data/visualizer-references/`
3. Run distill
4. Commit updated `manifest.json`

No patient photos need to be pushed to GitHub.
