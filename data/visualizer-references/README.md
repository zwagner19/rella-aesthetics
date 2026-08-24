# Rella visualizer reference photos (private)

Patient before/after pairs used to calibrate AI preview style. **Do not commit raw photos.**

## Folder layout

```
data/visualizer-references/
  manifest.json          ← committed (metadata + distilled style notes only)
  botox/
    case-01-before.jpg
    case-01-after.jpg
  laser-pigmentation/
    case-01-before.jpg
    case-01-after.jpg
```

Pair naming: `{case-id}-before.{jpg|png|webp}` and `{case-id}-after.{jpg|png|webp}`

## Setup

1. Connect **Google Drive** in Cursor (MCP → Google Drive → authenticate).
2. Copy or sync your B&A folder — see `docs/VISUALIZER-REFERENCES.md`.
3. Run `npm run visualizer:sync-references -- --source /path/to/folder`
4. Run `npm run visualizer:distill-references` (requires `OPENAI_API_KEY`)

Only `manifest.json` is tracked in git. Image files stay local or in private blob storage.
