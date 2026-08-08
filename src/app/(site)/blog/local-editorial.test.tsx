import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import BlogPostPage, {
  generateMetadata,
  generateStaticParams,
} from "./[slug]/page";
import { CANONICAL_NAPA_TOX } from "@/lib/booking-routes";
import { getLocalEditorialPost } from "@/lib/local-editorial-posts";

const slug = "botox-cost-napa";
const post = getLocalEditorialPost(slug);

if (!post) throw new Error("The durable Napa Botox article is missing");

const page = await BlogPostPage({ params: Promise.resolve({ slug }) });
const html = renderToStaticMarkup(page);
const visibleText = html
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/&reg;/g, "®")
  .replace(/\s+/g, " ");

const schemaBodies = [
  ...html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  ),
].map((match) => JSON.parse(match[1]));

describe("durable local editorial routing", () => {
  it("pre-renders the approved slug even when the CMS is unavailable", async () => {
    await expect(generateStaticParams()).resolves.toContainEqual({ slug });
  });

  it("publishes complete canonical and social metadata", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug }),
    });

    expect(metadata.title).toBe("Botox Cost in Napa: 2026 Pricing Guide");
    expect(metadata.alternates?.canonical).toBe(`/blog/${slug}`);
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      url: `/blog/${slug}`,
    });
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(
      "/images/og-botox-cost-napa.png",
    );
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(JSON.stringify(metadata.twitter?.images)).toContain(
      "/images/og-botox-cost-napa.png",
    );
  });
});

describe("Napa Botox pricing article integrity", () => {
  it("has one clear page title and the complete current public price set", () => {
    expect([...html.matchAll(/<h1\b/g)]).toHaveLength(1);
    expect(visibleText).toContain("Botox in Napa: 2026 Pricing, Membership, and What to Expect");
    expect(visibleText).toContain("$18/unit");
    expect(visibleText).toContain("$6/unit");
    expect(visibleText).toContain("$13/unit");
    expect(visibleText).toContain("$4.40/unit");
    expect(visibleText).toContain("$30/month");
    expect(visibleText).toContain("one-year commitment");
    expect(visibleText).toContain("$50");
  });

  it("states the local visit facts and explains the membership arithmetic", () => {
    expect(visibleText).toContain("1541 3rd St, Napa, CA 94559");
    expect(visibleText).toContain("(707) 358-2928");
    expect(visibleText).toContain("30-minute new-patient tox visit");
    expect(visibleText).toContain("72 Botox units");
    expect(visibleText).toContain("225 Dysport units");
    expect(visibleText).toContain("transparent arithmetic, not a treatment recommendation");
  });

  it("does not revive stale prices, availability promises, or ratings", () => {
    expect(visibleText).not.toContain("$15/unit");
    expect(visibleText).not.toContain("$5/unit");
    expect(visibleText).not.toContain("$11/unit");
    expect(visibleText).not.toContain("$20/month");
    expect(visibleText).not.toMatch(/same-day appointments|available this week/i);
    expect(html).not.toMatch(
      /aggregateRating|reviewCount|ratingValue|\b[1-5](?:\.\d)?[- ]star/i,
    );
  });

  it("keeps every article booking action on the hardened Napa Tox path", () => {
    const bookingAnchors = [
      ...html.matchAll(/<a[^>]*data-cta="service-booking"[^>]*>/g),
    ];
    const hrefs = bookingAnchors.map(
      (match) => /href="([^"]+)"/.exec(match[0])?.[1],
    );

    expect(hrefs.length).toBeGreaterThanOrEqual(3);
    expect(new Set(hrefs)).toEqual(new Set([CANONICAL_NAPA_TOX]));
    expect(html).not.toContain("dashboard.boulevard.io");
  });

  it("connects the article to the relevant clinic, service, and membership pages", () => {
    for (const href of [
      "/napa/botox",
      "/membership",
      "/services/botox",
      "/locations/napa",
    ]) {
      expect(html).toContain(`href="${href}"`);
    }
  });
});

describe("article structured data", () => {
  it("uses an organization author and mirrors every visible FAQ", () => {
    expect(schemaBodies).toHaveLength(1);
    const graph = schemaBodies[0]["@graph"];
    const article = graph.find(
      (item: Record<string, unknown>) => item["@type"] === "Article",
    );
    const faqPage = graph.find(
      (item: Record<string, unknown>) => item["@type"] === "FAQPage",
    );

    expect(article.author).toEqual(
      expect.objectContaining({
        "@type": "Organization",
        name: "Rella Aesthetics",
      }),
    );
    expect(faqPage.mainEntity).toEqual(
      post.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    );
    for (const faq of post.faqs) {
      expect(visibleText).toContain(faq.question);
      expect(visibleText).toContain(faq.answer);
    }
  });

  it("contains no review, offer, or aggregate-rating schema", () => {
    expect(JSON.stringify(schemaBodies)).not.toMatch(
      /AggregateRating|aggregateRating|reviewCount|ratingValue|"offers"|"Review"/,
    );
  });
});
