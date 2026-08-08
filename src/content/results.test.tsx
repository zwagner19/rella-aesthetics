import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { BeforeAfterGallery } from "@/components/blocks/BeforeAfterGallery";
import {
  beforeAfterResults,
  resultPublishingIssues,
  visibleResultsFor,
  type BeforeAfterResult,
} from "./results";

const approvedResult: BeforeAfterResult = {
  id: "weight-loss-01",
  status: "approved",
  placement: ["weight-loss"],
  treatment: "Medical weight management",
  timeframe: "After 6 months",
  beforeSrc: "/images/results/weight-loss/weight-loss-01-before.jpg",
  afterSrc: "/images/results/weight-loss/weight-loss-01-after.jpg",
  beforeAlt: "Before medical weight-management treatment",
  afterAlt: "Six months after beginning medical weight-management treatment",
  caption: "Treatment and results are individual.",
};

describe("before-and-after publishing safeguards", () => {
  it("keeps drafts and placement-mismatched results off public pages", () => {
    const draft = { ...approvedResult, id: "draft-01", status: "draft" as const };
    expect(visibleResultsFor([draft, approvedResult], "weight-loss")).toEqual([approvedResult]);
    expect(visibleResultsFor([approvedResult], "main-gallery")).toEqual([]);
  });

  it("blocks incomplete approved entries", () => {
    expect(resultPublishingIssues(approvedResult)).toEqual([]);
    expect(resultPublishingIssues({ ...approvedResult, timeframe: "", afterAlt: "" })).toEqual([
      "timeframe",
      "afterAlt",
    ]);
  });

  it("requires every approved entry to reference two files that ship with the site", () => {
    for (const result of beforeAfterResults.filter((item) => item.status === "approved")) {
      expect(existsSync(`public${result.beforeSrc}`), `${result.id} before image`).toBe(true);
      expect(existsSync(`public${result.afterSrc}`), `${result.id} after image`).toBe(true);
    }
  });

  it("renders an accessible side-by-side result and the outcome disclaimer", () => {
    const html = renderToStaticMarkup(<BeforeAfterGallery results={[approvedResult]} />);
    expect(html).toContain("Before medical weight-management treatment");
    expect(html).toContain("Six months after beginning medical weight-management treatment");
    expect(html).toContain("Individual results vary");
  });

  it("renders nothing when there are no approved results", () => {
    expect(renderToStaticMarkup(<BeforeAfterGallery results={[]} />)).toBe("");
  });
});
