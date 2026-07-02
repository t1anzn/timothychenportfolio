import HomeClient from "./components/HomeClient";
import { client } from "@/sanity/lib/client";
import { nowQuery, projectsQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import type { NowData, ProjectListItem, SiteSettings } from "@/sanity/lib/types";

function formatNowDate(isoDate: string) {
  return new Date(isoDate)
    .toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    .toLowerCase();
}

export default async function Page() {
  const [projects, siteSettings, now] = await Promise.all([
    client.fetch<ProjectListItem[]>(
      projectsQuery,
      {},
      { next: { revalidate: 45 } }
    ),
    client.fetch<SiteSettings>(
      siteSettingsQuery,
      {},
      { next: { revalidate: 45 } }
    ),
    client.fetch<{ items: string[]; updatedAt: string } | null>(
      nowQuery,
      {},
      { next: { revalidate: 45 } }
    ),
  ]);

  const nowData: NowData = {
    date: now?.updatedAt ? formatNowDate(now.updatedAt) : "",
    items: now?.items ?? [],
  };

  return (
    <HomeClient nowData={nowData} projects={projects} siteSettings={siteSettings} />
  );
}
