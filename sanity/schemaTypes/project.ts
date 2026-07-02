import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["Completed", "In Progress", "Work in Progress", "Live"],
      },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: 'e.g. "Full Stack Web Application"',
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 2,
      description: "Short summary shown on the homepage project grid.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 6,
      description: "Longer description shown on the project detail page.",
    }),
    defineField({
      name: "skills",
      title: "Skills / Tech",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "features",
      title: "Key features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "demoUrl",
      title: "Demo URL",
      type: "url",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "array",
      of: [{ type: "mediaImage" }, { type: "mediaVideo" }],
    }),
    defineField({
      name: "hidden",
      title: "Hidden from homepage grid",
      type: "boolean",
      initialValue: false,
      description:
        "Hides this project from the homepage projects grid. The detail page stays reachable at its direct URL.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Controls position in the homepage projects grid (lower first).",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "status", media: "thumbnail" },
  },
});
