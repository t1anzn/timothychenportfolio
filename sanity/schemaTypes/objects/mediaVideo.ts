import { defineField, defineType } from "sanity";

export default defineType({
  name: "mediaVideo",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "videoPath",
      title: "Video path",
      type: "string",
      description:
        "Path to a video file already in /public (e.g. /cinemind-demo.mp4). Large video files are not uploaded to Sanity — add the file to /public in the repo, then reference its path here.",
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
    select: { title: "caption", subtitle: "videoPath" },
    prepare({ title, subtitle }) {
      return { title: title || subtitle || "Video" };
    },
  },
});
