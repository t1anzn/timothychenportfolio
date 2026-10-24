import Landing from "./components/Landing";
import { HACKATHONS, PROJECTS, type Hackathon, type WorkProject } from "./components/landing-data";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { hackathonsQuery, projectsQuery, siteSettingsQuery } from "@/sanity/lib/queries";
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

// The hackathon count and list in About come from Sanity, so adding one there updates both.
async function loadHackathons(): Promise<Hackathon[]> {
  try {
    const rows = await client.fetch<Hackathon[]>(hackathonsQuery, {}, { next: { revalidate: 45 } });
    return rows.length ? rows : HACKATHONS;
  } catch {
    return HACKATHONS;
  }
}

export default async function Page() {
  const [projects, portrait, hackathons] = await Promise.all([
    loadProjects(),
    loadPortrait(),
    loadHackathons(),
  ]);
  return <Landing projects={projects} portrait={portrait} hackathons={hackathons} />;
}
