import { existsSync, readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AboutPage from "../about/page";
import TeamPage, { metadata } from "./page";
import {
  additionalTeamMembers,
  leadershipMember,
  teamLocations,
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
    expect(teamHtml).toContain(
      "does not perform aesthetic treatments or injections",
    );
    for (const paragraph of leadershipMember.bio) {
      expect(teamHtml).toContain(escapeHtmlText(paragraph));
    }
    expect(teamHtml.indexOf("Leadership")).toBeLessThan(
      teamHtml.indexOf("Aesthetic Injectors"),
    );
    expect(existsSync(`public${leadershipMember.image}`)).toBe(true);
  });

  it("uses only the exact confirmed public role labels", () => {
    expect(
      teamRoleGroups.flatMap((group) =>
        group.members.map((member) => [
          member.name,
          member.role,
          member.primaryLocation,
        ]),
      ),
    ).toEqual([
      ["Anna Johnson", "Lead Nurse, RN", "vacaville"],
      ["Marisa Avalos", "Aesthetic RN", "napa"],
      ["Warda Harchaoui", "PA-C", "vacaville"],
      ["Michaela", "Esthetician & MA", "vacaville"],
      ["Sandra Maldonado", "MA", "vacaville"],
      ["Pia Tiaoqui", "MA", "vacaville"],
      ["Hailey Butler", "Medical Assistant", "napa"],
    ]);

    for (const group of teamRoleGroups) {
      for (const member of group.members) {
        expect(teamHtml).toContain(member.name);
        if (!(
          member.name === "Marisa Avalos" || member.name === "Hailey Butler"
        )) {
          expect(teamHtml).toContain(member.role.replace("&", "&amp;"));
        }
        expect(member.bio.length).toBeGreaterThan(0);
        for (const paragraph of member.bio) {
          expect(teamHtml).toContain(escapeHtmlText(paragraph));
        }
        if (member.image)
          expect(existsSync(`public${member.image}`)).toBe(true);
      }
    }
    expect(teamHtml).toContain("Aesthetic Injectors");
    expect(teamHtml).toContain("Esthetician");
    expect(teamHtml).toContain("Medical Assistant");
    expect(teamHtml).toContain("Front Desk / Patient Services");
    expect(teamHtml).toContain(
      "under Dr. Zachary Wagner&#x27;s supervision",
    );
    expect(teamHtml).toContain("administer injections");
    expect(teamHtml).toContain("perform lab draws");
    expect(teamHtml).toContain("3D body scans");
    expect(teamHtml).toContain(
      "Dr. Wagner directs medical decisions, dosing, and individualized care plans",
    );
    expect(teamHtml).not.toMatch(
      /I customize GLP-1|adjust your dosing|I also offer BodyTone/i,
    );
    expect(teamRoleGroups.map((group) => group.title)).toContain(
      "Medical Assisting",
    );
    expect(teamRoleGroups.map((group) => group.title)).not.toContain(
      "Weight Loss & Body Contouring",
    );
    expect(teamHtml).not.toContain("body-contouring support");
  });

  it("presents the photo-only team members without inventing public roles or bios", () => {
    expect(
      additionalTeamMembers.map((member) => [
        member.name,
        member.primaryLocation,
      ]),
    ).toEqual([
      ["Devyn Pickett", "napa"],
      ["Paula", "vacaville"],
      ["Ayano", "napa"],
      ["Natalie", "napa"],
      ["Ryan", "both"],
    ]);
    for (const member of additionalTeamMembers) {
      expect(teamHtml).toContain(member.name);
      expect(existsSync(`public${member.image}`)).toBe(true);
    }
    expect(teamHtml).not.toMatch(
      /Director of Ops|Nurse Injector|verified roles|confirmed team members|approved for publication|listed without titles or biographies/i,
    );
  });

  it("breaks the roster down by Napa, Vacaville, and Rella-wide support", () => {
    expect(leadershipMember.locations).toEqual(["napa", "vacaville"]);
    expect(
      teamLocations.map((location) => [location.id, location.name]),
    ).toEqual([
      ["napa", "Napa"],
      ["vacaville", "Vacaville"],
    ]);

    const detailedByLocation = Object.fromEntries(
      teamLocations.map((location) => [
        location.id,
        teamRoleGroups.flatMap((group) =>
          group.members
            .filter((member) => member.primaryLocation === location.id)
            .map((member) => member.name),
        ),
      ]),
    );
    const additionalByLocation = Object.fromEntries(
      [...teamLocations, { id: "both", name: "Both" }].map((location) => [
        location.id,
        additionalTeamMembers
          .filter((member) => member.primaryLocation === location.id)
          .map((member) => member.name),
      ]),
    );

    expect(detailedByLocation).toEqual({
      napa: ["Marisa Avalos", "Hailey Butler"],
      vacaville: [
        "Anna Johnson",
        "Warda Harchaoui",
        "Michaela",
        "Sandra Maldonado",
        "Pia Tiaoqui",
      ],
    });
    expect(additionalByLocation).toEqual({
      napa: ["Devyn Pickett", "Ayano", "Natalie"],
      vacaville: ["Paula"],
      both: ["Ryan"],
    });
    expect(teamHtml).toContain('id="team-location-napa"');
    expect(teamHtml).toContain('id="team-location-vacaville"');
    expect(teamHtml).toContain("Napa team");
    expect(teamHtml).toContain("Vacaville team");
    expect(teamHtml).toContain("Across both locations.");
    expect(teamHtml).not.toContain("Napa and Vacaville.");
    expect(teamHtml).not.toContain("Vacaville care team");
    expect(
      teamRoleGroups.flatMap((group) =>
        group.members.flatMap((member) =>
          member.alsoServes ? [[member.name, member.alsoServes]] : [],
        ),
      ),
    ).toEqual([["Warda Harchaoui", "napa"]]);
    expect(
      additionalTeamMembers.flatMap((member) =>
        member.alsoServes ? [[member.name, member.alsoServes]] : [],
      ),
    ).toEqual([["Devyn Pickett", "vacaville"]]);
    expect(teamHtml).toContain("Also serves Napa");
    expect(teamHtml).toContain("Also serves Vacaville");
    expect(teamHtml.indexOf('id="team-location-napa"')).toBeLessThan(
      teamHtml.indexOf('id="team-location-vacaville"'),
    );

    const napaStart = teamHtml.indexOf('id="team-location-napa"');
    const vacavilleStart = teamHtml.indexOf('id="team-location-vacaville"');
    const allLocationsStart = teamHtml.indexOf('id="additional-team-heading"');
    const napaHtml = teamHtml.slice(napaStart, vacavilleStart);
    const vacavilleHtml = teamHtml.slice(vacavilleStart, allLocationsStart);
    const allLocationsHtml = teamHtml.slice(allLocationsStart);

    for (const name of [
      "Marisa Avalos",
      "Hailey Butler",
      "Devyn Pickett",
      "Ayano",
      "Natalie",
    ]) {
      expect(napaHtml).toContain(name);
    }
    expect(napaHtml.indexOf("Devyn Pickett")).toBeLessThan(
      napaHtml.indexOf("Marisa Avalos"),
    );
    expect(napaHtml.indexOf("Aesthetic Injectors")).toBeLessThan(
      napaHtml.indexOf("Esthetician"),
    );
    expect(napaHtml.indexOf("Esthetician")).toBeLessThan(
      napaHtml.indexOf("Medical Assistant"),
    );
    expect(napaHtml.indexOf("Medical Assistant")).toBeLessThan(
      napaHtml.indexOf("Front Desk / Patient Services"),
    );
    for (const name of [
      "Anna Johnson",
      "Warda Harchaoui",
      "Michaela",
      "Sandra Maldonado",
      "Pia Tiaoqui",
      "Paula",
    ]) {
      expect(vacavilleHtml).toContain(name);
    }
    expect(allLocationsHtml).toContain("Ryan");
  });

  it("uses every supplied portrait once and keeps the portraitless profile honest", () => {
    expect(teamHtml.match(/<img\b/g)).toHaveLength(13);
    expect(teamHtml.match(/<img\b[^>]*alt=""/g)).toHaveLength(11);
    expect(existsSync("public/images/clinic/rella-team-storefront.webp")).toBe(
      true,
    );
    expect(teamHtml).toContain(
      'alt="Rella Aesthetics team outside the Napa clinic"',
    );
    expect(teamSource).toContain("/images/clinic/rella-team-storefront.webp");
    expect(teamHtml).toContain("Hailey Butler");
    expect(teamHtml).not.toMatch(
      /portrait coming soon|stock portrait|placeholder portrait/i,
    );
    expect(teamSource).not.toMatch(/\b(?:rounded|shadow|gradient)-/);
    expect(teamSource).not.toMatch(/boulevard|joinblvd|rella-hq/i);
    expect(teamSource).not.toMatch(/<p[^>]*>\s*\{label\}\s*<\/p>/);
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
    expect(aboutHtml).toContain(
      "does not perform aesthetic treatments or injections",
    );
    expect(aboutHtml).toContain('href="/team"');
  });
});
