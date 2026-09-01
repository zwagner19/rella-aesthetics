import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const APP = __dirname;
const read = (path: string) => readFileSync(join(APP, path), "utf8");

describe("Clarity ownership and privacy boundary", () => {
  it("is mounted only by the ordinary-site layout", () => {
    expect(read("(site)/layout.tsx")).toContain("<ClarityAnalytics");
    expect(read("layout.tsx")).not.toContain("ClarityAnalytics");
    expect(read("(campaign)/layout.tsx")).not.toContain("ClarityAnalytics");
  });

  it("requires explicit consent and never grants advertising storage", () => {
    const source = read("../components/integrations/ClarityAnalytics.tsx");
    expect(source).toContain('analytics_Storage: "granted"');
    expect(source).toContain('ad_Storage: "denied"');
    expect(source).toContain('analytics_Storage: "denied"');
    expect(source).toContain("applyClarityChoice(");
    expect(source).not.toMatch(/clarity\s*\(\s*["']identify["']/i);
    expect(source).not.toMatch(/clarity\s*\(\s*["']set["']/i);
  });

  it("documents the exact sensitive-route exclusions", () => {
    const policy = read("../lib/clarity-policy.ts");
    for (const forbidden of ["/contact", "/book", "/services/botox", "/napa/botox"]) {
      expect(policy, forbidden).not.toMatch(new RegExp(`^[^/]*[\"']${forbidden}[\"']`, "m"));
    }
    const runbook = read("../../docs/CLARITY-LAUNCH-RUNBOOK-2026-08-16.md");
    for (const required of ["/contact", "/book", "/services/<detail>", "weight-loss host"]) {
      expect(runbook).toContain(required);
    }
  });
});
