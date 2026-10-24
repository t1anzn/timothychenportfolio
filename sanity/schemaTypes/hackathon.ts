import { defineField, defineType } from "sanity";

export default defineType({
  name: "hackathon",
  title: "Hackathon",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "placement",
      title: "Placement",
      type: "string",
      description: 'Optional, e.g. "Top 3" or "Winner". Leave empty if there was none.',
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "placement" },
  },
});
