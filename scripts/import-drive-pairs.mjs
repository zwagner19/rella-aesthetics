import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";

const ROOT = join(process.cwd(), "data/visualizer-references");
const PAIRS_PATH = join(ROOT, "drive-pairs.json");
const MANIFEST_PATH = join(ROOT, "manifest.json");

function extractDownload(downloadJsonPath, destPath) {
  const raw = readFileSync(downloadJsonPath, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed.content) throw new Error(`No content in ${downloadJsonPath}`);
  mkdirSync(dirname(destPath), { recursive: true });
  writeFileSync(destPath, Buffer.from(parsed.content, "base64"));
}

function buildManifest() {
  const catalog = JSON.parse(readFileSync(PAIRS_PATH, "utf8"));
  const references = [];

  for (const pair of catalog.pairs) {
    const folder = catalog.folders[pair.parentId];
    if (!folder) continue;

    const shortId = pair.uuid.split("-")[0];
    const treatmentFolder = folder.treatmentType;
    const beforePath = `${treatmentFolder}/${shortId}-before.jpg`;
    const afterPath = `${treatmentFolder}/${shortId}-after.jpg`;
    const beforeFull = join(ROOT, beforePath);
    const afterFull = join(ROOT, afterPath);

    if (!existsSync(beforeFull) || !existsSync(afterFull)) {
      console.warn(`Skipping incomplete pair ${pair.uuid}`);
      continue;
    }

    references.push({
      id: `${treatmentFolder}-${shortId}`,
      treatmentType: folder.treatmentType,
      zones: folder.zones,
      treatmentLabel: folder.label,
      beforePath,
      afterPath,
      consentOnFile: true,
    });
  }

  const manifest = {
    version: 1,
    updatedAt: new Date().toISOString(),
    references,
  };

  writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Manifest updated: ${references.length} references`);
}

const [command, ...args] = process.argv.slice(2);

if (command === "extract") {
  const [downloadJsonPath, destPath] = args;
  extractDownload(downloadJsonPath, destPath);
  console.log(`Extracted ${destPath}`);
} else if (command === "manifest") {
  buildManifest();
} else {
  console.error("Usage: node scripts/import-drive-pairs.mjs extract <download.json> <dest.jpg>");
  console.error("       node scripts/import-drive-pairs.mjs manifest");
  process.exit(1);
}
