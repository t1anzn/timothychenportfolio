import { defineField, defineType } from "sanity";

export default defineType({
  name: "now",
  title: "Now",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "text", rows: 3 }],
      description: "One entry per paragraph shown in the 'now' section.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Now" };
    },
  },
});
