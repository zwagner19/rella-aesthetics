/**
 * Sanity Content Seed Script
 *
 * Run after configuring your Sanity project:
 *   1. Create a project at https://www.sanity.io/manage
 *   2. Copy the project ID to .env.local as NEXT_PUBLIC_SANITY_PROJECT_ID
 *   3. Create an API token with write access
 *   4. Run: SANITY_WRITE_TOKEN=xxx npx tsx scripts/seed-sanity.ts
 *
 * This script imports all service data, locations, and categories
 * from the hardcoded data into Sanity.
 */

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function seed() {
  console.log("Seeding Sanity...\n");

  // 1. Create locations
  const vacaville = await client.createOrReplace({
    _id: "location-vacaville",
    _type: "location",
    name: "Vacaville",
    slug: { _type: "slug", current: "vacaville" },
    address: "542 Main St",
    city: "Vacaville",
    state: "CA",
    zip: "95688",
    phone: "707.358.2928",
    email: "hello@experiencerella.com",
    hours: ["Monday–Friday: 9am–5pm", "Saturday: 9am–1pm"],
  });
  console.log("✓ Location: Vacaville");

  const napa = await client.createOrReplace({
    _id: "location-napa",
    _type: "location",
    name: "Napa",
    slug: { _type: "slug", current: "napa" },
    address: "1541 3rd St",
    city: "Napa",
    state: "CA",
    zip: "94559",
    phone: "707.358.2928",
    email: "hello@experiencerella.com",
    hours: ["Monday–Friday: 9am–5pm", "Saturday: 9am–1pm"],
  });
  console.log("✓ Location: Napa");

  // 2. Create categories
  const categories = [
    { name: "Injectables", slug: "injectables" },
    { name: "Skin Care", slug: "skin-care" },
    { name: "Body & Wellness", slug: "body-wellness" },
    { name: "Weight Loss", slug: "weight-loss" },
    { name: "Lifestyle", slug: "lifestyle" },
  ];

  for (const cat of categories) {
    await client.createOrReplace({
      _id: `category-${cat.slug}`,
      _type: "category",
      name: cat.name,
      slug: { _type: "slug", current: cat.slug },
    });
    console.log(`✓ Category: ${cat.name}`);
  }

  // 3. Create services
  const services = [
    {
      id: "botox",
      name: "Botox & Dysport",
      category: "Injectables",
      shortDescription:
        "Reduce fine lines and prevent wrinkles with expertly administered neuromodulators.",
    },
    {
      id: "dermal-fillers",
      name: "Dermal Fillers",
      category: "Injectables",
      shortDescription:
        "Restore lost volume in cheeks, lips, and jawline with natural-looking results.",
    },
    {
      id: "chemical-peels",
      name: "Chemical Peels",
      category: "Skin Care",
      shortDescription:
        "Reveal smoother, brighter skin by removing damaged outer layers with medical-grade peels.",
    },
    {
      id: "facials",
      name: "Facials",
      category: "Skin Care",
      shortDescription:
        "Customized professional facials designed to target your unique skin concerns.",
    },
    {
      id: "hydrafacial",
      name: "HydraFacial",
      category: "Skin Care",
      shortDescription:
        "Deep cleansing, exfoliation, and hydration in one advanced treatment session.",
    },
    {
      id: "microneedling",
      name: "Microneedling",
      category: "Skin Care",
      shortDescription:
        "Stimulate collagen production to improve texture, tone, and overall skin quality.",
    },
    {
      id: "iv-hydration",
      name: "IV Hydration",
      category: "Body & Wellness",
      shortDescription:
        "Vitamin-infused IV therapy for energy, immunity, and recovery.",
    },
    {
      id: "laser-treatments",
      name: "Laser Treatments",
      category: "Body & Wellness",
      shortDescription:
        "IPL, spider vein removal, laser hair removal, and Erbium skin resurfacing.",
    },
    {
      id: "weight-loss",
      name: "Medical Weight Loss",
      category: "Body & Wellness",
      shortDescription:
        "Physician-supervised semaglutide program with weekly check-ins and personalized support.",
    },
  ];

  for (const svc of services) {
    await client.createOrReplace({
      _id: `service-${svc.id}`,
      _type: "service",
      name: svc.name,
      slug: { _type: "slug", current: svc.id },
      category: svc.category,
      shortDescription: svc.shortDescription,
      locations: [
        { _type: "reference", _ref: vacaville._id, _key: "vac" },
        { _type: "reference", _ref: napa._id, _key: "nap" },
      ],
    });
    console.log(`✓ Service: ${svc.name}`);
  }

  // 4. Create Dr. Sonia Dhillon team member
  await client.createOrReplace({
    _id: "team-dr-dhillon",
    _type: "teamMember",
    name: "Dr. Sonia Dhillon",
    role: "Medical Director & Founder",
    credentials: "MD",
    order: 1,
    locations: [
      { _type: "reference", _ref: vacaville._id, _key: "vac" },
      { _type: "reference", _ref: napa._id, _key: "nap" },
    ],
  });
  console.log("✓ Team: Dr. Sonia Dhillon");

  console.log("\n✅ Sanity seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
