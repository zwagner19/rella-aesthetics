import { existsSync, readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  additionalTeamMembers,
  teamRoleGroups,
} from "@/content/team";
import TeamPage from "./page";

const teamHtml = renderToStaticMarkup(<TeamPage />);
const teamSource = readFileSync("src/app/(site)/team/page.tsx", "utf8");

type RosterMember = {
  readonly name: string;
  readonly role: string;
  readonly image: string;
  readonly bio: readonly string[];
};

const groupedMembers = teamRoleGroups.reduce<RosterMember[]>(
  (members, group) =>
    members.concat(group.members as unknown as readonly RosterMember[]),
  [],
);
const rosterMembers: readonly RosterMember[] = [
  ...groupedMembers,
  ...(additionalTeamMembers as unknown as readonly RosterMember[]),
];

function memberByName(name: string) {
  return rosterMembers.find((member) => member.name === name);
}

describe("approved team content and placement", () => {
  it("keeps Hailey's approved supervised clinical-support role and portrait", () => {
    const hailey = memberByName("Hailey Butler");

    expect(hailey?.role).toBe("Medical Assistant");
    expect(hailey?.image).toBe("/images/team/hailey-butler.jpg");
    expect(hailey?.bio.join(" ")).toContain(
      "directly under Dr. Zachary Wagner's supervision",
    );
    expect(hailey?.bio.join(" ")).toContain("administer injections");
    expect(hailey?.bio.join(" ")).toContain("perform lab draws");
    expect(hailey?.bio.join(" ")).toContain("3D body scans");
    expect(hailey?.bio.join(" ")).toContain(
      "Dr. Wagner directs medical decisions, dosing, and individualized care plans",
    );
    expect(hailey?.bio.join(" ")).not.toMatch(
      /Hailey (?:directs|customizes|creates) .*care plans/i,
    );
    expect(existsSync("public/images/team/hailey-butler.jpg")).toBe(true);
  });

  it("keeps Paula beside Pia and includes the approved Ayano and Paula quotes", () => {
    const patientServicesGroup = teamRoleGroups.find(
      (group) => group.title === "Esthetics, Medical Assisting & Patient Services",
    );
    const names = patientServicesGroup?.members.map((member) => member.name);

    expect(names).toEqual([
      "Michaela",
      "Sandra Maldonado",
      "Pia Tiaoqui",
      "Paula",
    ]);
    expect(memberByName("Ayano")?.bio.at(-1)).toBe(
      "I love working at Rella because I get to talk to different people and hear different stories. I have met incredible people through Rella and I love the support I get from both clients and my coworkers.",
    );
    expect(memberByName("Paula")?.bio.at(-1)).toBe(
      "My favorite thing about being a part of the Rella team is the people! I love getting to know our regulars and seeing familiar faces walk through the door. Our patients make every day fun, and I love being part of a team that feels like family.",
    );
  });

  it("shows each roster card once and keeps Ryan's biography beside his photo on large screens", () => {
    for (const member of rosterMembers) {
      expect(teamHtml.match(new RegExp(`>${member.name}<`, "g"))).toHaveLength(1);
      expect(existsSync(`public${member.image}`)).toBe(true);
    }

    expect(teamSource).toContain(
      "lg:grid-cols-[minmax(180px,0.8fr)_minmax(0,1.2fr)]",
    );
    expect(teamHtml).not.toMatch(
      /Director of Ops|Weight Loss &amp; Body Contouring|placeholder portrait/i,
    );
  });
});
