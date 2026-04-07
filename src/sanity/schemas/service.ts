import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Service Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Injectables", value: "Injectables" },
          { title: "Skin Care", value: "Skin Care" },
          { title: "Body & Wellness", value: "Body & Wellness" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      description: "One-liner for cards (max 160 chars)",
      type: "text",
      rows: 2,
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "whatItIs",
      title: "What It Is",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", title: "Heading" }),
        defineField({ name: "body", type: "text", title: "Body", rows: 5 }),
      ],
    }),
    defineField({
      name: "whoItsFor",
      title: "Who It's For",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", title: "Heading" }),
        defineField({ name: "body", type: "text", title: "Body", rows: 3 }),
        defineField({
          name: "bullets",
          type: "array",
          title: "Bullet Points",
          of: [{ type: "string" }],
        }),
      ],
    }),
    defineField({
      name: "whatToExpect",
      title: "What to Expect",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", title: "Heading" }),
        defineField({ name: "body", type: "text", title: "Body", rows: 3 }),
        defineField({
          name: "steps",
          type: "array",
          title: "Steps",
          of: [{ type: "string" }],
        }),
      ],
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", title: "Heading" }),
        defineField({ name: "body", type: "text", title: "Body", rows: 2 }),
        defineField({ name: "note", type: "string", title: "Note (optional)" }),
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", type: "string", title: "Question" }),
            defineField({ name: "answer", type: "text", title: "Answer", rows: 3 }),
          ],
        },
      ],
    }),
    defineField({
      name: "locations",
      title: "Available At",
      type: "array",
      of: [{ type: "reference", to: [{ type: "location" }] }],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: (r) => r.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      validation: (r) => r.max(160),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category" },
  },
});
