import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (file: string) => readFileSync(file, "utf8");

describe("designer checklist for Results, Education, and Contact", () => {
  it("keeps Results pink-forward without changing its booking or consent contract", () => {
    const source = read("src/app/(site)/gallery/page.tsx");

    expect(source).toContain('className="bg-rose py-16 text-center text-white');
    expect(source).toContain("!border-white !bg-transparent !text-white");
    expect(source).toContain("hover:!bg-transparent hover:!text-white");
    expect(source).toContain("bg-white px-5 py-2 text-base font-light text-rose");
    expect(source).toContain('data-cta="gallery-booking"');
    expect(source).toContain("resolveBookingHref({})");
    expect(source).toContain("Individual results vary");
    expect(source).not.toMatch(
      /Natural-looking|Before-and-after|one-size-fits-all|result—not|trend-driven/,
    );
  });

  it("keeps Education titles pink and the three sidebar panels pink with white content", () => {
    const page = read("src/app/(site)/blog/page.tsx");
    const post = read("src/app/(site)/blog/[slug]/page.tsx");
    const card = read("src/components/blog/BlogCard.tsx");
    const content = read("src/components/blog/BlogContent.tsx");
    const sidebar = read("src/components/blog/BlogSidebar.tsx");
    const localPost = read("src/components/blog/LocalEditorialPost.tsx");
    const localPosts = read("src/lib/local-editorial-posts.ts");

    expect(page).toContain("uppercase text-rose mb-4");
    expect(card).toContain("text-lg text-rose");
    expect(content).toContain("text-2xl text-rose");
    expect(content).toContain("text-xl text-rose");
    expect(sidebar.match(/bg-rose p-6/g)).toHaveLength(3);
    expect(sidebar).not.toContain("bg-rose-blush");
    expect(sidebar).toContain("!bg-white !text-rose");
    expect(post).toContain('className="bg-rose-cta py-16 text-center text-white"');
    expect(post).toContain("!bg-white !text-rose");
    expect(sidebar).toContain("resolveBookingHref({})");
    expect(localPosts).toContain(
      'coverImage: "/images/clinic/rella-front-desk-consult.jpg"',
    );
    expect(localPosts).toContain(
      'coverAlt: "The reception and front-desk area at Rella Aesthetics in Vacaville"',
    );
    expect(localPost).toContain(
      'className="bg-rose-cta py-16 text-white"',
    );
    expect(localPost).toContain(
      "!border-white !bg-white !text-rose",
    );
    expect(localPost).toContain("text-lg font-medium text-rose");
  });

  it("keeps Contact headings and field titles pink while preserving delivery and tracking", () => {
    const page = read("src/app/(site)/contact/page.tsx");
    const form = read("src/app/(site)/contact/ContactForm.tsx");

    expect(page).toContain('<SectionHeader title="Send Us a Message" />');
    expect(page).toContain('<SectionHeader title="Other Ways to Reach Us" />');
    expect(page).toContain('href="tel:+17073582928"');
    expect(page).toContain('href="mailto:info@experiencerella.com"');
    expect(form.match(/<(?:label|legend)[^>]*text-rose/g)).toHaveLength(7);
    expect(form).toContain('fetch("/api/leads"');
    expect(form).toContain('dispatchConversion("contact_form_success")');
    expect(form).toContain("result.accepted === true");
    expect(form).toContain("w-full !text-white hover:!text-white sm:w-auto");
    expect(form).toContain('role="alert" className="mt-3 text-sm font-medium text-ink"');
    expect(form).not.toContain("—");
  });
});
