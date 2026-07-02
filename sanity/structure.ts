import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings")
        ),
      S.listItem()
        .title("Now")
        .id("now")
        .child(
          S.document().schemaType("now").documentId("now").title("Now")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["siteSettings", "now"].includes(item.getId() ?? "")
      ),
    ]);
