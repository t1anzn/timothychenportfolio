import { defineField, defineType } from "sanity";

export default defineType({
  name: "mediaImage",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "asset",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "alt", media: "asset" },
    prepare({ title, subtitle, media }) {
      return { title: title || subtitle || "Image", media };
    },
  },
});
