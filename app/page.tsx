import fs from "fs";
import path from "path";
import HomeClient from "./components/HomeClient";

function parseNow(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  const stat = fs.statSync(filePath);

  const items = raw
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const date = stat.mtime
    .toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    .toLowerCase();

  return { date, items };
}

function parseProjects(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");

  return raw
    .split(/\n---\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n");
      const title = lines[0].replace(/^##\s*/, "").trim();
      const meta: Record<string, string> = {};

      for (const line of lines.slice(1)) {
        const colon = line.indexOf(": ");
        if (colon !== -1) {
          const key = line.slice(0, colon).trim();
          const value = line.slice(colon + 2).trim();
          meta[key] = value;
        }
      }

      return {
        title,
        year: meta.year ?? "",
        status: meta.status ?? "",
        slug: meta.slug,
        hidden: meta.hidden === "true",
        thumb: meta.thumb ?? "/placeholder.svg",
        summary: meta.summary ?? "",
        skills: meta.skills ? meta.skills.split(",").map((s) => s.trim()) : [],
      };
    });
}

export default function Page() {
  const nowData = parseNow(path.join(process.cwd(), "content", "now.md"));
  const projects = parseProjects(path.join(process.cwd(), "content", "projects.md"));
  return <HomeClient nowData={nowData} projects={projects} />;
}
