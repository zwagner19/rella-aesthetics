import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The test runner must actually run the tests.
 *
 * `include: ["src/**\/*.test.ts"]` silently excluded every `.test.tsx` file.
 * A suite that is never discovered is worse than no suite: it reports success
 * for assertions that never executed. This guard fails if the glob narrows
 * again, and it is itself a `.ts` file asserting that a `.tsx` sibling runs.
 */
const ROOT = join(__dirname, "..", "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next" || e.name === ".git") continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.includes(".test.")) out.push(full);
  }
  return out;
}

describe("vitest discovers every test file on disk", () => {
  it("includes both .test.ts and .test.tsx", () => {
    const cfg = readFileSync(join(ROOT, "vitest.config.ts"), "utf8");
    const include = /include:\s*\[([^\]]+)\]/.exec(cfg)?.[1] ?? "";
    expect(include).toMatch(/\*\.test\.\{ts,tsx\}/);
    expect(include).not.toMatch(/\*\.test\.ts["']/);
  });

  it("leaves no test file unmatched, and a .tsx suite really exists", () => {
    const files = walk(join(ROOT, "src")).map((f) => f.slice(ROOT.length + 1));
    for (const f of files) expect(f, `${f} would not be discovered`).toMatch(/\.test\.(ts|tsx)$/);
    expect(files.some((f) => f.endsWith(".test.tsx"))).toBe(true);
    expect(files.some((f) => f.endsWith(".test.ts"))).toBe(true);
  });
});
