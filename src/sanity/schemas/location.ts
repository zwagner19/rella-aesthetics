import { defineField, defineType } from "sanity";

export const location = defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Location Name",
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
      name: "address",
      title: "Street Address",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      initialValue: "CA",
    }),
    defineField({
      name: "zip",
      title: "ZIP Code",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "mapEmbed",
      title: "Google Maps Embed URL",
      type: "url",
    }),
    defineField({
      name: "image",
      title: "Location Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "services",
      title: "Services Available",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "address" },
  },
});
