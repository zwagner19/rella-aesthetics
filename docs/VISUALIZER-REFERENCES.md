# Rella Before/After References for AI Visualizer

Use real Rella patient outcomes to calibrate preview style — **not** to fine-tune a model. We distill each consented before/after pair into short style notes that get injected into the generate prompt.

## Google Drive import (Rella B&A catalog)

13 consented before/after pairs are cataloged in `data/visualizer-references/drive-pairs.json` (4 Botox, 9 laser/IPL/CO2). Photos stay gitignored; only `manifest.json` (metadata + distilled style notes) is committed.

### Re-import from Drive (Cloud Agent)

1. Authenticate **Cursor Settings → MCP → Google Drive**
2. Download pairs using `download_file_content` for each file ID in `drive-pairs.json`
3. Extract and rebuild:

```bash
node scripts/import-drive-pairs.mjs extract <agent-tools-download.txt> data/visualizer-references/botox/<id>-before.jpg
node scripts/import-drive-pairs.mjs manifest
OPENAI_API_KEY=sk-... npm run visualizer:distill-references
```

Until Drive is connected, export the folder locally and use the sync script below.

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
