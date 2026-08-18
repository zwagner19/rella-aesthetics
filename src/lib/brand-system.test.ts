import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "..", "..");

describe("brand system normalization (Pass 3)", () => {
  const serviceCard = readFileSync(join(ROOT, "src/components/blocks/ServiceCard.tsx"), "utf8");
  const blogCard = readFileSync(join(ROOT, "src/components/blog/BlogCard.tsx"), "utf8");
  const globals = readFileSync(join(ROOT, "src/app/globals.css"), "utf8");
  const button = readFileSync(join(ROOT, "src/components/ui/Button.tsx"), "utf8");

  it("removes card shadow treatments from marketing cards", () => {
    expect(serviceCard).not.toContain("shadow");
    expect(blogCard).not.toContain("shadow");
  });

  it("uses square image containers on service cards", () => {
    expect(serviceCard).not.toContain("rounded-lg");
  });

  it("defines shared eyebrow and display typography utilities", () => {
    expect(globals).toContain(".text-eyebrow");
    expect(globals).toContain(".text-display");
  });

  it("uses Ink labels on rose primary buttons for contrast", () => {
    expect(button).toContain("bg-rose text-ink");
  });
});
