import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { additionalTeamMembers, teamRoleGroups } from "@/content/team";

const read = (path: string) => readFileSync(path, "utf8");

function expectTextColor(source: string, text: string, color: "text-white" | "text-rose") {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  expect(source).toMatch(
    new RegExp(`className="[^"]*${color}[^"]*"[^>]*>\\s*${escaped}`),
  );
}

describe("latest owner color and team-content decisions", () => {
  it("locks the requested White and Rose section labels", () => {
    const popup = read("src/components/preview/PreviewClinicChooser.tsx");
    const home = read("src/app/(site)/page.tsx");
    const banner = read("src/components/blocks/MembershipBanner.tsx");
    const about = read("src/app/(site)/about/page.tsx");
    const team = read("src/app/(site)/team/page.tsx");
    const membership = read("src/app/(site)/membership/page.tsx");
    const privateParties = read("src/app/(site)/private-parties/page.tsx");
    const gallery = read("src/app/(site)/gallery/page.tsx");
    const patientGallery = read("src/components/blocks/PatientResultImageGallery.tsx");

    expectTextColor(popup, "The Rella Reveal", "text-white");
    expect(popup).toContain("tracking-[0.05em] text-white md:text-4xl");
    expectTextColor(home, "Medical weight management", "text-white");
    expectTextColor(home, "Care should feel clear", "text-white");
    expectTextColor(banner, "2026 Injectable Memberships", "text-white");
    expectTextColor(about, "Locally owned · Vacaville + Napa", "text-white");
    expectTextColor(about, "The Rella standard", "text-rose");
    expectTextColor(about, "The people behind Rella", "text-white");
    expectTextColor(about, "How Rella approaches care", "text-white");
    expectTextColor(about, "Start with clarity", "text-white");
    expectTextColor(team, "Vacaville + Napa", "text-white");
    expectTextColor(team, "Start with a conversation", "text-white");
    expect(team).toContain("leading-relaxed text-white md:text-xl");
    expectTextColor(membership, "Membership", "text-white");
    expect(membership).toContain("leading-relaxed text-white");
    expectTextColor(membership, "2026 Public Plans", "text-rose");
    expectTextColor(privateParties, "Private Events", "text-white");
    expectTextColor(privateParties, "Get in Touch", "text-rose");
    expectTextColor(gallery, "Results that still look like you.", "text-white");
    expectTextColor(patientGallery, "Real examples. Shared with permission.", "text-white");
  });

  it("publishes the requested biographies and keeps Paula beside Pia in roster order", () => {
    const remaining = Object.fromEntries(
      additionalTeamMembers.map((member) => [member.name, member]),
    );
    for (const name of ["Devyn Pickett", "Natalie", "Ayano", "Ryan"]) {
      expect(remaining[name].role.length).toBeGreaterThan(0);
      expect(remaining[name].bio.join(" ").length).toBeGreaterThan(60);
    }

    const vacavilleGroup = teamRoleGroups.find((group) =>
      group.members.some((member) => member.name === "Pia Tiaoqui"),
    );
    expect(vacavilleGroup?.members.map((member) => member.name).slice(-2)).toEqual([
      "Pia Tiaoqui",
      "Paula",
    ]);
    const paula = vacavilleGroup?.members.find((member) => member.name === "Paula");
    expect(paula?.image).toBe("/images/team/paula.jpg");
    expect(paula?.bio.join(" ").length).toBeGreaterThan(60);
  });
});
