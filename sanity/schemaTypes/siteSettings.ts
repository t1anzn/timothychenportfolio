import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "heroTagline",
      title: "Hero tagline",
      type: "string",
      description: 'e.g. "computer science student / ai engineer in london."',
    }),
    defineField({
      name: "summary",
      title: "About summary",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "portrait",
      title: "Portrait photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "skillGroups",
      title: "Skill groups",
      type: "array",
      of: [
        {
          type: "object",
          name: "skillGroup",
          fields: [
            defineField({ name: "groupName", title: "Group name", type: "string" }),
            defineField({
              name: "skills",
              title: "Skills",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            }),
          ],
          preview: {
            select: { title: "groupName", subtitle: "skills" },
            prepare({ title, subtitle }) {
              return { title, subtitle: Array.isArray(subtitle) ? subtitle.join(", ") : subtitle };
            },
          },
        },
      ],
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      of: [
        {
          type: "object",
          name: "educationItem",
          fields: [
            defineField({ name: "institution", title: "Institution / degree", type: "string" }),
            defineField({ name: "dateRange", title: "Date range", type: "string" }),
          ],
          preview: {
            select: { title: "institution", subtitle: "dateRange" },
          },
        },
      ],
    }),
    defineField({
      name: "experience",
      title: "Work experience",
      type: "array",
      of: [
        {
          type: "object",
          name: "experienceItem",
          fields: [
            defineField({ name: "role", title: "Role — company", type: "string" }),
            defineField({ name: "dateRange", title: "Date range", type: "string" }),
            defineField({
              name: "bullets",
              title: "Bullet points",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
          preview: {
            select: { title: "role", subtitle: "dateRange" },
          },
        },
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      fields: [
        defineField({ name: "linkedin", title: "LinkedIn URL", type: "url" }),
        defineField({ name: "github", title: "GitHub URL", type: "url" }),
        defineField({ name: "twitter", title: "Twitter / X URL", type: "url" }),
      ],
    }),
    defineField({
      name: "cvUrl",
      title: "CV file path",
      type: "string",
      description:
        "Path to the CV file in /public (e.g. /TimothyChenCV.pdf). Kept as a static file rather than a Sanity asset since it rarely changes.",
    }),
    defineField({
      name: "siteTitle",
      title: "Site title (browser tab)",
      type: "string",
    }),
    defineField({
      name: "projectsPageTitle",
      title: "Projects page title (browser tab)",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
