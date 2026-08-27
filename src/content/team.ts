export const leadershipMember = {
  name: "Dr. Zachary Wagner",
  credentials: "DO",
  role: "Founder & Owner",
  focus: "Medical Weight-Loss Physician",
  image: "/images/dr-zachary-wagner.jpg",
  locations: ["napa", "vacaville"],
  bio: [
    "An American Board of Obesity Medicine diplomate, Dr. Wagner leads Rella's medical weight-loss care. He works directly with patients to understand their history, goals, previous efforts, and safety considerations before recommending a next step.",
    "He founded Rella around a simple idea: people should feel heard before they are asked to make a decision. His approach is clear and individualized—explain the options plainly, recommend only what makes sense, and build a plan that can be supported over time. Dr. Wagner does not perform aesthetic treatments or injections; those services are provided by Rella's aesthetics team.",
  ],
} as const;

export const teamLocations = [
  {
    id: "napa",
    name: "Napa",
    href: "/locations/napa",
    description: "Meet the Rella team based at our Napa location.",
  },
  {
    id: "vacaville",
    name: "Vacaville",
    href: "/locations/vacaville",
    description: "Meet the Rella team based at our Vacaville location.",
  },
] as const;

export const teamRoleGroups = [
  {
    title: "Nursing",
    members: [
      {
        name: "Anna Johnson",
        role: "Lead Nurse, RN",
        image: "/images/team/anna-johnson.jpg",
        primaryLocation: "vacaville",
        alsoServes: null,
        bio: [
          "I'm the lead nurse at Rella, specializing in advanced aesthetic treatments including laser therapies, CO₂ laser, advanced resurfacing, microneedling, neurotoxin injections (Botox and Dysport), and dermal fillers. I have a passion for full facial balancing and love combining treatments like injectables with CO₂ laser to create natural, refreshed results.",
          "My favorite part of working at Rella is the people. I'm grateful to work alongside an incredible team, and I truly value the relationships I've built with my patients, many of whom have become friends. Helping them feel confident and beautiful is the most rewarding part of what I do.",
        ],
      },
      {
        name: "Marisa Avalos",
        role: "Aesthetic RN",
        image: "/images/team/marisa-avalos.jpg",
        primaryLocation: "napa",
        alsoServes: null,
        bio: [
          "I'm an aesthetic RN specializing in injectables and skin rejuvenation treatments. My favorites would be microneedling and neurotoxins because I love helping patients see real, confidence-boosting results. My favorite part about working at Rella is building relationships with clients and being part of a team that's focused on helping people feel their best!",
        ],
      },
    ],
  },
  {
    title: "Advanced Practice",
    members: [
      {
        name: "Warda Harchaoui",
        role: "PA-C",
        image: "/images/team/warda-harchaoui.jpg",
        primaryLocation: "vacaville",
        alsoServes: "napa",
        bio: [
          "Warda is passionate about wellness and personalized patient care, specializing in IV therapy, vitamin injections, peptide consultations, hormone optimization, and testosterone replacement therapy. She loves creating individualized treatment plans that help patients feel their best from the inside out.",
          "Her favorite part of working at Rella is helping patients feel confident, supported, and empowered on their wellness journey.",
        ],
      },
    ],
  },
  {
    title: "Esthetics & Medical Assisting",
    members: [
      {
        name: "Michaela",
        role: "Esthetician & MA",
        image: "/images/team/michaela.jpg",
        primaryLocation: "vacaville",
        alsoServes: null,
        bio: [
          "I offer a combination of results-driven skincare and supportive wellness care to help you look and feel your best!",
          "From customized facials, HydraFacials, and chemical peels to help you achieve healthy, glowing skin to guiding and supporting clients on their weight-loss journey and providing vitamin injections for overall wellness.",
          "My goal is to not only treat your skin, but to educate you and support you every step of the way—inside and out.",
        ],
      },
      {
        name: "Sandra Maldonado",
        role: "MA",
        image: "/images/team/sandra-maldonado.jpg",
        primaryLocation: "vacaville",
        alsoServes: null,
        bio: [
          "Sandra Maldonado is a dedicated Medical Assistant who has been with Rella for over a year and a half. She specializes in supporting patients throughout their weight-loss journeys, providing guidance, encouragement, and personalized care every step of the way.",
          "Sandra is passionate about helping individuals achieve their health goals and takes pride in building meaningful connections with each patient she meets. She finds great fulfillment in witnessing not only physical transformations, but also the boost in confidence that comes with successful weight loss.",
          "Her commitment to patient care and her positive, supportive approach make her a valued member of the Rella team.",
        ],
      },
      {
        name: "Pia Tiaoqui",
        role: "MA",
        image: "/images/team/pia-tiaoqui.jpg",
        primaryLocation: "vacaville",
        alsoServes: null,
        bio: [
          "Hi! I'm a medical assistant at Rella. I assist with treatments and help providers during patient care to help create a smooth, personalized experience for each patient. I also work closely with my own patients, supporting them through weight loss and vitamin injections for overall wellness. My favorite thing about working at Rella is the supportive environment and the level of care we put into every patient experience.",
        ],
      },
    ],
  },
  {
    title: "Medical Assisting",
    members: [
      {
        name: "Hailey Butler",
        role: "Medical Assistant",
        image: null,
        primaryLocation: "napa",
        alsoServes: null,
        bio: [
          "Hailey supports Rella's medical weight-loss patients directly under Dr. Zachary Wagner's supervision. She helps administer injections, perform lab draws, and complete 3D body scans during patient visits.",
          "Dr. Wagner directs medical decisions, dosing, and individualized care plans; Hailey helps carry out the clinical support work that keeps each visit organized and consistent.",
        ],
      },
    ],
  },
] as const;

// These team members have approved portraits and owner-confirmed care-area
// groupings on the Team page, but no approved individual biographies yet.
export const additionalTeamMembers = [
  {
    name: "Devyn Pickett",
    image: "/images/team/devyn.jpg",
    primaryLocation: "napa",
    alsoServes: "vacaville",
  },
  {
    name: "Paula",
    image: "/images/team/paula.jpg",
    primaryLocation: "vacaville",
    alsoServes: null,
  },
  {
    name: "Ayano",
    image: "/images/team/ayano.jpg",
    primaryLocation: "napa",
    alsoServes: null,
  },
  {
    name: "Natalie",
    image: "/images/team/natalie.jpg",
    primaryLocation: "napa",
    alsoServes: null,
  },
  {
    name: "Ryan",
    image: "/images/team/ryan.jpg",
    primaryLocation: "both",
    alsoServes: null,
  },
] as const;
