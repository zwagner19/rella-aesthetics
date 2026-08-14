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
      }
    }
  });

  it("presents team members whose public role is not shown by name only", () => {
    expect(additionalTeamMembers).toEqual([
      "Devyn",
      "Paula",
      "Ayano",
      "Natalie",
      "Ryan",
    ]);
    for (const name of additionalTeamMembers) expect(teamHtml).toContain(name);
    expect(teamHtml).not.toMatch(
      /verified roles|confirmed team members|approved for publication|listed without titles or biographies/i,
    );
  });

  it("uses one verified portrait and no card effects or vendor destinations", () => {
    expect(teamSource.match(/<Image\b/g)).toHaveLength(1);
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
