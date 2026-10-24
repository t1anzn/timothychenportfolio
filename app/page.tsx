import Landing from "./components/Landing";
import { PROJECTS, type WorkProject } from "./components/landing-data";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { projectsQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import type { ProjectListItem, SiteSettings } from "@/sanity/lib/types";

// The Work section is the site's list of projects: it reads them from Sanity, in the
// order set there, hides the ones marked hidden, and links each to its own page.
// If Sanity cannot be reached it falls back to a built-in list rather than showing
// nothing.
async function loadProjects(): Promise<WorkProject[]> {
  try {
    const all = await client.fetch<ProjectListItem[]>(
      projectsQuery,
      {},
      { next: { revalidate: 45 } }
    );
    const visible = all.filter((p) => !p.hidden && p.slug);
    if (!visible.length) return PROJECTS;
    return visible.map((p) => ({
      title: p.title,
      slug: p.slug,
      year: p.year ?? "",
      status: p.status ?? "",
      skills: p.skills ?? [],
      summary: p.summary ?? "",
      // Cropped to 16:10 whatever the original shape, so every card's picture lines up.
      thumb: p.thumbnail
        ? urlFor(p.thumbnail).width(800).height(500).fit("crop").auto("format").url()
        : undefined,
    }));
  } catch {
    return PROJECTS;
  }
}

// The portrait shown in About comes from the site settings in Sanity. Without one the
// About section simply has no picture.
async function loadPortrait(): Promise<string | undefined> {
  try {
    const settings = await client.fetch<SiteSettings | null>(
      siteSettingsQuery,
      {},
      { next: { revalidate: 45 } }
    );
    return settings?.portrait
      ? urlFor(settings.portrait).width(640).height(800).fit("crop").auto("format").url()
      : undefined;
  } catch {
    return undefined;
  }
}

export default async function Page() {
  const [projects, portrait] = await Promise.all([loadProjects(), loadPortrait()]);
  return <Landing projects={projects} portrait={portrait} />;
}
