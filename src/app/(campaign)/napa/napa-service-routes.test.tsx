import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import NapaHubPage, { metadata as hubMetadata } from "./page";
import NapaFillerPage, { metadata as fillerMetadata } from "./filler/page";
import NapaLaserPage, { metadata as laserMetadata } from "./laser/page";
import NapaHydraFacialPage, {
  metadata as hydrafacialMetadata,
} from "./hydrafacial/page";
import NapaHyperhidrosisPage, {
  metadata as hyperhidrosisMetadata,
} from "./hyperhidrosis/page";
import { resolveBookingHref } from "@/lib/booking-routes";
import { NAPA_CAMPAIGN_SERVICES } from "@/lib/napa-campaign-services";
import { LOCATION_ENTITY_IDS } from "@/lib/schemas";

const decode = (html: string) =>
  html
    .replace(/<!-- -->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");

const routes = [
  {
    slug: "filler",
    Page: NapaFillerPage,
    metadata: fillerMetadata,
    canonical: "https://experiencerella.com/napa/filler",
    bookingService: "dermal-fillers",
    bookingToken: "s_e3564b2f",
    prices: ["$840", "$540–$960"],
  },
  {
    slug: "laser",
    Page: NapaLaserPage,
    metadata: laserMetadata,
    canonical: "https://experiencerella.com/napa/laser",
    bookingService: "laser-treatments",
    bookingToken: "%2Fcart%2Fmenu%2FLaser",
    prices: ["$420", "$1,440"],
  },
  {
    slug: "hydrafacial",
    Page: NapaHydraFacialPage,
    metadata: hydrafacialMetadata,
    canonical: "https://experiencerella.com/napa/hydrafacial",
    bookingService: "hydrafacial",
    bookingToken: "s_68b27f62",
    prices: ["$240", "$300", "$390"],
  },
  {
    slug: "hyperhidrosis",
    Page: NapaHyperhidrosisPage,
    metadata: hyperhidrosisMetadata,
    canonical: "https://experiencerella.com/napa/hyperhidrosis",
    bookingService: "hyperhidrosis",
    bookingToken: "s_14029fc9",
    prices: ["$2,400", "60 min"],
  },
] as const;

describe("Napa paid + local-search route preservation", () => {
  it.each(routes)("/$slug exists with unique indexable metadata", (route) => {
    expect(route.metadata.alternates?.canonical).toBe(route.canonical);
    expect(route.metadata.robots).toEqual({ index: true, follow: true });
    expect(String(route.metadata.title)).toContain(
      NAPA_CAMPAIGN_SERVICES[route.slug].metaTitle,
    );
  });

  it.each(routes)("/$slug keeps every Book CTA on one verified Napa path", (route) => {
    const html = renderToStaticMarkup(<route.Page />);
    const expected = resolveBookingHref({
      location: "napa",
      service: route.bookingService,
    });
    const bookAnchors = [...html.matchAll(/<a\b([^>]*)data-cta="book"([^>]*)>/g)]
      .map((match) => `${match[1]}${match[2]}`)
      .map((attrs) => ({
        href: (/href="([^"]+)"/.exec(attrs)?.[1] ?? "").replace(/&amp;/g, "&"),
        attrs,
      }));

    expect(bookAnchors.length).toBeGreaterThanOrEqual(4);
    expect(new Set(bookAnchors.map((anchor) => anchor.href))).toEqual(
      new Set([expected]),
    );
    for (const anchor of bookAnchors) {
      expect(anchor.attrs).toContain('data-gtm="booking_start"');
      expect(anchor.attrs).toContain(`data-service="${route.slug}"`);
    }
    expect(expected).toContain(route.bookingToken);
    expect(expected).toContain("locationId=91eba843-57fb-49e9-8505-431d501ffec7");
  });

  it.each(routes)("/$slug renders local facts, current prices, and no patient form", (route) => {
    const html = renderToStaticMarkup(<route.Page />);
    const text = decode(html);

    expect(text).toContain("1541 3rd St");
    expect(text).toContain("Napa, CA 94559");
    expect(text).toContain("Physician-owned");
    expect(text).toContain("Zachary Wagner, DO");
    expect(html).toContain('href="tel:+17073582928"');
    for (const price of route.prices) expect(text).toContain(price);
    expect(html).not.toMatch(/<form|<input|<textarea|<select/);
    expect(html).not.toMatch(/aggregateRating|ratingValue|reviewCount/);
  });

  it.each(routes)("/$slug schema contains exactly its visible FAQs", (route) => {
    const html = renderToStaticMarkup(<route.Page />);
    const body = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/.exec(html)?.[1];
    expect(body).toBeTruthy();
    const schema = JSON.parse(body!.replace(/&quot;/g, '"'));
    const service = schema["@graph"].find(
      (node: { "@type": string }) => node["@type"] === "Service",
    );
    expect(service.provider["@id"]).toBe(LOCATION_ENTITY_IDS.napa);
    expect(service.provider.url).toBe(
      "https://experiencerella.com/locations/napa",
    );
    const faq = schema["@graph"].find(
      (node: { "@type": string }) => node["@type"] === "FAQPage",
    );
    expect(faq.mainEntity.map((item: { name: string }) => item.name)).toEqual(
      NAPA_CAMPAIGN_SERVICES[route.slug].faqs.map((item) => item.q),
    );
    const text = decode(html);
    for (const item of NAPA_CAMPAIGN_SERVICES[route.slug].faqs) {
      expect(text).toContain(item.q);
      expect(text).toContain(item.a);
    }
  });
});

describe("Napa campaign hub", () => {
  const html = renderToStaticMarkup(<NapaHubPage />);
  const text = decode(html);

  it("preserves the paid /napa/ destination with one local business entity", () => {
    expect(hubMetadata.alternates?.canonical).toBe(
      "https://experiencerella.com/napa",
    );
    expect(hubMetadata.title).toBe("Napa Med Spa Services | Rella Aesthetics");
    expect(text).toContain("Rella Aesthetics — Napa");
    expect(text).toContain("American Board of Obesity Medicine diplomate");
    expect(text).toContain("1541 3rd St");
    expect(html).toContain('"@type":["MedicalBusiness","DaySpa"]');
    expect(html).toContain(`"@id":"${LOCATION_ENTITY_IDS.napa}"`);
    expect(html).toContain(
      '"url":"https://experiencerella.com/locations/napa"',
    );
    expect(html).not.toContain(
      '"@id":"https://experiencerella.com/napa#location"',
    );
  });

  it("links all six high-intent Napa service pages", () => {
    for (const href of [
      "/napa/botox",
      "/napa/filler",
      "/napa/laser",
      "/napa/facials",
      "/napa/hydrafacial",
      "/napa/hyperhidrosis",
    ]) {
      expect(html).toContain(`href="${href}"`);
    }
  });

  it("uses only the Napa-scoped generic booking menu", () => {
    const expected = resolveBookingHref({ location: "napa" }).replace(/&/g, "&amp;");
    const bookHrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*data-cta="book"/g)].map(
      (match) => match[1],
    );
    expect(bookHrefs.length).toBeGreaterThanOrEqual(3);
    expect(new Set(bookHrefs)).toEqual(new Set([expected]));
    expect(html).not.toContain("book.experiencerella.com");
  });
});

describe("superseded acquisition claims stay retired", () => {
  const combined = routes.map((route) => decode(renderToStaticMarkup(<route.Page />))).join(" ");

  it("does not revive old filler, laser, HydraFacial, tox, or membership offers", () => {
    for (const stale of [
      "$700/syringe",
      "half syringe from $600",
      "members from $500",
      "CoolPeel from $700",
      "CO2 from $800",
      "$50 off",
      "$15/unit",
      "$5/unit",
      "$11/unit",
      "from $20/month",
    ]) {
      expect(combined).not.toContain(stale);
    }
  });

  it("makes no same-day or same-week availability promise", () => {
    expect(combined).not.toMatch(/same[- ]day|same[- ]week|available today/i);
  });
});
