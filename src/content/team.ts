export const leadershipMember = {
  name: "Dr. Zachary Wagner",
  credentials: "DO",
  role: "Founder & Owner",
  focus: "Medical Weight-Loss Physician",
  image: "/images/dr-zachary-wagner.jpg",
} as const;

export const teamRoleGroups = [
  {
    title: "Nursing",
    members: [
      { name: "Anna Johnson", role: "Lead Nurse, RN" },
      { name: "Marisa Avalos", role: "Aesthetic RN" },
    ],
  },
  {
    title: "Advanced Practice",
    members: [{ name: "Warda Harchaoui", role: "PA-C" }],
  },
  {
    title: "Esthetics & Medical Assisting",
    members: [
      { name: "Michaela", role: "Esthetician & MA" },
      { name: "Sandra Maldonado", role: "MA" },
      { name: "Pia Tiaoqui", role: "MA" },
    ],
  },
  {
    title: "Weight Loss & Body Contouring",
    members: [
      { name: "Hailey Butler", role: "Weight Loss & Body Contouring" },
    ],
  },
] as const;

// The Aug. 9 handoff confirms these names as team members, but does not
// confirm public roles or bios. Keep this list name-only until owner review.
export const additionalTeamMembers = [
  "Devyn",
  "Paula",
  "Ayano",
  "Natalie",
  "Ryan",
] as const;
