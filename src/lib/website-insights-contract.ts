// Deliberately excludes URLs, text, selectors, sources and booking identifiers.
export const INSIGHTS_VERSION = 1;
export const INSIGHTS_COOKIE = "__Host-rella_insights_consent_v1";
export type InsightPage = "home" | "napa" | "vacaville" | "other";
export type InsightViewport = "mobile" | "tablet" | "desktop";
export type InsightOutcome =
  "open" | "closed" | "pending" | "confirmed" | "package";
export type InsightSample = {
  id: string;
  seq: number;
  version: 1;
  kind: "page" | "booking";
  page: InsightPage;
  viewport: InsightViewport;
  qa: boolean;
  scroll: number;
  clicks: { x: number; y: number; n: number }[];
  clinic: "unknown" | "napa" | "vacaville";
  steps: number;
  lastStep: number;
  outcome: InsightOutcome;
};
export function insightPage(path: string): InsightPage | null {
  return path === "/"
    ? "home"
    : path === "/locations/napa"
      ? "napa"
      : path === "/locations/vacaville"
        ? "vacaville"
        : null;
}
export function validInsightSample(value: unknown): value is InsightSample {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const v = value as InsightSample;
  const keys = [
    "id",
    "seq",
    "version",
    "kind",
    "page",
    "viewport",
    "qa",
    "scroll",
    "clicks",
    "clinic",
    "steps",
    "lastStep",
    "outcome",
  ];
  if (
    Object.keys(v).length !== keys.length ||
    Object.keys(v).some((k) => !keys.includes(k))
  )
    return false;
  if (
    typeof v.id !== "string" ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
      v.id,
    ) ||
    v.version !== 1 ||
    !Number.isInteger(v.seq) ||
    v.seq < 1 ||
    v.seq > 500 ||
    !["page", "booking"].includes(v.kind) ||
    !["home", "napa", "vacaville", "other"].includes(v.page) ||
    !["mobile", "tablet", "desktop"].includes(v.viewport) ||
    typeof v.qa !== "boolean" ||
    !Number.isInteger(v.scroll) ||
    v.scroll < 0 ||
    v.scroll > 100 ||
    v.scroll % 10 !== 0 ||
    !["unknown", "napa", "vacaville"].includes(v.clinic) ||
    !Number.isInteger(v.steps) ||
    v.steps < 0 ||
    v.steps > 63 ||
    !Number.isInteger(v.lastStep) ||
    v.lastStep < 0 ||
    v.lastStep > 6 ||
    !["open", "closed", "pending", "confirmed", "package"].includes(
      v.outcome,
    ) ||
    !Array.isArray(v.clicks) ||
    v.clicks.length > 120
  )
    return false;
  let total = 0;
  const cells = new Set<string>();
  for (const c of v.clicks) {
    if (
      !c ||
      Object.keys(c).sort().join() !== "n,x,y" ||
      !Number.isInteger(c.x) ||
      c.x < 0 ||
      c.x > 11 ||
      !Number.isInteger(c.y) ||
      c.y < 0 ||
      c.y > 19 ||
      !Number.isInteger(c.n) ||
      c.n < 1 ||
      c.n > 200
    )
      return false;
    const cell = `${c.x}:${c.y}`;
    if (cells.has(cell)) return false;
    cells.add(cell);
    total += c.n;
  }
  if (total > 200) return false;
  if (v.kind === "page")
    return (
      v.page !== "other" &&
      v.clinic === "unknown" &&
      v.steps === 0 &&
      v.lastStep === 0 &&
      v.outcome === "open"
    );
  return (
    v.scroll === 0 &&
    v.clicks.length === 0 &&
    (v.lastStep === 0 || Boolean(v.steps & (1 << (v.lastStep - 1)))) &&
    (!["confirmed", "pending"].includes(v.outcome) || v.lastStep === 6)
  );
}
