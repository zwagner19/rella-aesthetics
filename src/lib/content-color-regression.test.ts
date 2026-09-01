import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (file: string) => readFileSync(file, "utf8");

const auditedContentSurfaces = [
  "src/app/(site)/blog/page.tsx",
  "src/app/(site)/blog/[slug]/page.tsx",
  "src/app/(site)/cancellation-policy/page.tsx",
  "src/app/(site)/contact/ContactForm.tsx",
  "src/app/(site)/contact/page.tsx",
  "src/app/(site)/giveaway-terms-and-conditions/page.tsx",
  "src/app/(site)/privacy-policy/page.tsx",
  "src/app/(site)/terms/page.tsx",
  "src/app/not-found.tsx",
  "src/components/blog/BlogCard.tsx",
  "src/components/blog/BlogContent.tsx",
  "src/components/blog/BlogSidebar.tsx",
] as const;

describe("content color and flat-surface contract", () => {
  it.each(auditedContentSurfaces)(
    "%s does not use low-opacity Silver text",
    (file) => {
      expect(source(file), file).not.toContain("text-silver-light");
    },
  );

  it("keeps ordinary content copy on accessible Ink-based colors", () => {
    expect(source("src/app/(site)/privacy-policy/page.tsx")).not.toMatch(
      /prose[^"\n]*\btext-silver\b/,
    );
    expect(source("src/app/(site)/terms/page.tsx")).not.toMatch(
      /prose[^"\n]*\btext-silver\b/,
    );
    expect(
      source("src/app/(site)/giveaway-terms-and-conditions/page.tsx"),
    ).not.toMatch(/prose[^"\n]*\btext-silver\b/);
    expect(source("src/components/blog/BlogCard.tsx")).not.toContain(
      'className="text-silver text-sm',
    );
    expect(source("src/components/blog/BlogContent.tsx")).not.toContain(
      "italic text-silver",
    );
    expect(source("src/components/blog/BlogSidebar.tsx")).not.toContain(
      'className="text-sm text-silver mb-',
    );
    expect(source("src/app/not-found.tsx")).not.toContain(
      "text-lg text-silver",
    );
  });

  it.each([
    "src/app/(site)/blog/[slug]/page.tsx",
    "src/app/(site)/contact/ContactForm.tsx",
    "src/components/blog/BlogContent.tsx",
    "src/components/blog/BlogSidebar.tsx",
  ] as const)("%s keeps cards and editorial imagery square", (file) => {
    expect(source(file), file).not.toContain("rounded-lg");
  });

  it("keeps the social card on the approved palette", () => {
    expect(source("src/lib/social-card.tsx")).not.toContain("#5d6165");
  });
});
