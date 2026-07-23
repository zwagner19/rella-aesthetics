import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC_DIR = path.resolve(__dirname, "..", "src");
const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);

function collectSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectSourceFiles(full, acc);
    } else if (CODE_EXTENSIONS.has(path.extname(entry))) {
      acc.push(full);
    }
  }
  return acc;
}

const sourceFiles = collectSourceFiles(SRC_DIR);

describe("static source guarantees", () => {
  it("finds source files to scan", () => {
    expect(sourceFiles.length).toBeGreaterThan(10);
  });

  it("contains zero links to the internal /booking route", () => {
    // Matches "/booking", '/booking', `/booking` and "/booking?..." link
    // literals. Module paths like "@/components/booking/..." do not match
    // because the quote is not immediately before "/booking".
    const bookingLink = /["'`]\/booking(?![-a-zA-Z0-9])/;
    const offenders = sourceFiles.filter((f) =>
      bookingLink.test(readFileSync(f, "utf8")),
    );
    expect(offenders).toEqual([]);
  });

  it("contains no aggregateRating markup anywhere in src", () => {
    const offenders = sourceFiles.filter((f) =>
      readFileSync(f, "utf8").includes("aggregateRating"),
    );
    expect(offenders).toEqual([]);
  });
});
