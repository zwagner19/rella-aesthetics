import { existsSync, readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AboutPage from "../about/page";
import TeamPage, { metadata } from "./page";
import {
  additionalTeamMembers,
  leadershipMember,
  teamRoleGroups,
} from "@/content/team";

const teamHtml = renderToStaticMarkup(<TeamPage />);
const teamSource = readFileSync("src/app/(site)/team/page.tsx", "utf8");

function escapeHtmlText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("'", "&#x27;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

describe("team roster integrity", () => {
  it("puts bounded leadership before the role groups", () => {
    expect(teamHtml.match(/<h1\b/g)).toHaveLength(1);
    expect(teamHtml).toContain("Dr. Zachary Wagner");
    expect(teamHtml).toContain("Founder &amp; Owner");
    expect(teamHtml).toContain("Medical Weight-Loss Physician");
    expect(teamHtml).toContain("does not perform aesthetic treatments or injections");
    expect(teamHtml.indexOf("Leadership")).toBeLessThan(teamHtml.indexOf("Nursing"));
    expect(existsSync(`public${leadershipMember.image}`)).toBe(true);
  });

  it("uses only the exact confirmed public role labels", () => {
    expect(
      teamRoleGroups.flatMap((group) =>
        group.members.map((member) => [member.name, member.role]),
      ),
    ).toEqual([
      ["Anna Johnson", "Lead Nurse, RN"],
      ["Marisa Avalos", "Aesthetic RN"],
      ["Warda Harchaoui", "PA-C"],
      ["Michaela", "Esthetician & MA"],
      ["Sandra Maldonado", "MA"],
      ["Pia Tiaoqui", "MA"],
      ["Hailey Butler", "Weight Loss & Body Contouring"],
    ]);

    for (const group of teamRoleGroups) {
      for (const member of group.members) {
        expect(teamHtml).toContain(member.name);
        expect(teamHtml).toContain(member.role.replace("&", "&amp;"));
        expect(member.bio.length).toBeGreaterThan(0);
        for (const paragraph of member.bio) {
          expect(teamHtml).toContain(escapeHtmlText(paragraph));
        }
        if (member.image) expect(existsSync(`public${member.image}`)).toBe(true);
      }
    }
  });

  it("presents the photo-only team members without inventing public roles or bios", () => {
    expect(additionalTeamMembers.map((member) => member.name)).toEqual([
      "Devyn Pickett", "Paula", "Ayano", "Natalie", "Ryan",
    ]);
    for (const member of additionalTeamMembers) {
      expect(teamHtml).toContain(member.name);
      expect(existsSync(`public${member.image}`)).toBe(true);
    }
    expect(teamHtml).not.toMatch(
      /Director of Ops|Front Desk|Nurse Injector|verified roles|confirmed team members|approved for publication|listed without titles or biographies/i,
    );
  });

  it("uses every supplied portrait once and keeps the portraitless profile honest", () => {
    expect(teamHtml.match(/<img\b/g)).toHaveLength(12);
    expect(teamHtml.match(/<img\b[^>]*alt=""/g)).toHaveLength(11);
    expect(teamHtml).toContain("Hailey Butler");
    expect(teamHtml).not.toMatch(/portrait coming soon|stock portrait|placeholder portrait/i);
    expect(teamSource).not.toMatch(/\b(?:rounded|shadow|gradient)-/);
    expect(teamSource).not.toMatch(/boulevard|joinblvd|rella-hq/i);
    expect(teamSource).toContain("resolveBookingHref({})");
  });

  it("adds a canonical, navigable Team route and aligns About copy", () => {
    expect(metadata.alternates?.canonical).toBe("/team");
    expect(readFileSync("src/components/layout/Header.tsx", "utf8")).toContain(
      '{ href: "/team", label: "Team" }',
    );
    expect(readFileSync("src/components/layout/Footer.tsx", "utf8")).toContain(
      'mainSiteHref("/team")',
    );
    expect(readFileSync("public/sitemap-0.xml", "utf8")).toContain(
      "https://experiencerella.com/team",
    );
    expect(readFileSync("next-sitemap.config.js", "utf8")).toContain('"/team"');

    const aboutHtml = renderToStaticMarkup(<AboutPage />);
    expect(aboutHtml).toContain("does not perform aesthetic treatments or injections");
    expect(aboutHtml).toContain('href="/team"');
  });
});
