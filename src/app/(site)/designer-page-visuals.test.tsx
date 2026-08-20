import { existsSync, readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AboutPage from "./about/page";
import MembershipPage from "./membership/page";
import ServicesPage from "./services/page";
import { membershipTiers, services } from "@/lib/data";

const aboutSource = readFileSync("src/app/(site)/about/page.tsx", "utf8");
const servicesSource = readFileSync("src/app/(site)/services/page.tsx", "utf8");
const membershipSource = readFileSync(
  "src/app/(site)/membership/page.tsx",
  "utf8",
);

describe("designer page color checklist", () => {
  it("gives About the requested white hero/team titles and solid-pink sections", () => {
    const html = renderToStaticMarkup(<AboutPage />);

    expect(html).toContain("text-4xl font-bold uppercase");
    expect(html).toContain("tracking-[0.06em] text-white md:text-6xl");
    expect(aboutSource).toContain('className="overflow-hidden bg-rose"');
    expect(aboutSource).toContain(
      'font-medium text-white">Dr. Zachary Wagner, DO',
    );
    expect(aboutSource).toContain("bg-rose py-16 md:py-20");
    expect(aboutSource).toContain("tracking-[0.06em] text-white md:text-4xl");
    expect(aboutSource).toContain(
      "border-[1.5px] border-rose bg-white px-4 py-3",
    );
    expect(aboutSource).toContain(
      'className="bg-rose py-20 text-white md:py-28"',
    );
    expect(aboutSource).toContain("bg-white/45 md:grid-cols-2");
    expect(aboutSource).toContain("bg-rose p-7 md:p-9");
    expect(aboutSource).not.toContain("/images/clinic/rella-consultation.webp");
    expect(html).toContain('href="/book"');
    expect(html).toContain('href="tel:+17073582928"');
    expect(html).toContain("Call Rella");
    expect(html).not.toContain("Ask a Question");
  });

  it("gives every service a pink title and Learn more treatment with white hover copy", () => {
    const html = renderToStaticMarkup(<ServicesPage />);

    for (const service of services) {
      expect(html).toContain(`href="/services/${service.slug}"`);
      expect(html).toContain(service.title.replaceAll("&", "&amp;"));
      expect(existsSync(`public${service.image}`), service.image).toBe(true);
      expect(service.imageAlt.length).toBeGreaterThan(0);
    }
    expect(servicesSource).toContain("text-rose md:text-5xl");
    expect(servicesSource).toContain("group-hover:text-white");
    expect(servicesSource).toContain("group-focus-visible:text-white");
    expect(servicesSource).toContain("src={service.image}");
    expect(servicesSource).toContain("alt={service.imageAlt}");
    expect(servicesSource).not.toContain("clinicImages[");
    expect(servicesSource).not.toContain("alt={service.title}");
    expect(html.match(/Learn more/g)).toHaveLength(services.length);
  });

  it("gives memberships white hero/FAQ titles plus pink tier details", () => {
    const html = renderToStaticMarkup(<MembershipPage />);

    for (const tier of membershipTiers) {
      expect(html).toContain(tier.name);
      expect(html).toContain(tier.price);
    }
    expect(membershipSource).toContain("text-3xl font-bold text-rose");
    expect(membershipSource).toContain('className="bg-rose py-24 md:py-28"');
    expect(membershipSource).toContain(
      "tracking-[0.08em] text-white md:text-6xl",
    );
    expect(membershipSource).toContain('className="bg-rose py-20 md:py-28"');
    expect(membershipSource).toContain(
      "tracking-[0.08em] text-white md:text-5xl",
    );
    expect(membershipSource).toContain(
      "w-full !border-rose !bg-white !text-rose",
    );
    expect(html.match(/Ask About Membership/g)).toHaveLength(
      membershipTiers.length,
    );
  });

  it("does not use conspicuous em dashes on the three checklist pages", () => {
    for (const source of [aboutSource, servicesSource, membershipSource]) {
      expect(source).not.toContain("—");
    }
  });
});
