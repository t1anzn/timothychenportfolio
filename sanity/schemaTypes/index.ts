import { type SchemaTypeDefinition } from "sanity";

import project from "./project";
import siteSettings from "./siteSettings";
import now from "./now";
import mediaImage from "./objects/mediaImage";
import mediaVideo from "./objects/mediaVideo";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, siteSettings, now, mediaImage, mediaVideo],
};
