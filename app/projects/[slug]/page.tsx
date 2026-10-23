import { notFound } from "next/navigation";

import { DocClose } from "../../components/DocShell";
import ProjectMedia, { type MediaItem } from "../../components/ProjectMedia";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { allProjectSlugsQuery, projectBySlugQuery } from "@/sanity/lib/queries";
import type { ProjectDetail } from "@/sanity/lib/types";

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allProjectSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await client.fetch<ProjectDetail | null>(projectBySlugQuery, { slug });
  return { title: project ? `${project.title} | Timothy Chen` : "Project | Timothy Chen" };
}

// One project, on the same black sky as the rest of the site. The title and the
// summary lead; the story (description, key points, challenges) is the main column,
// and what it was made with and where to find it sits beside it.
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await client.fetch<ProjectDetail | null>(
    projectBySlugQuery,
    { slug },
    { next: { revalidate: 45 } }
  );

  if (!project) {
    notFound();
  }

  const meta = [project.year, project.status, project.category].filter(Boolean);
  const hasLinks = project.githubUrl || project.demoUrl;

  // What the media gallery needs, prepared here: a modest picture for the grid and a
  // large one for the viewer.
  const media: MediaItem[] = (project.media ?? []).map((m) =>
    m._type === "mediaVideo"
      ? { key: m._key, kind: "video", src: m.videoPath, alt: m.alt, caption: m.caption }
      : {
          key: m._key,
          kind: "image",
          src: urlFor(m.asset).width(1000).auto("format").url(),
          full: urlFor(m.asset).width(2800).auto("format").url(),
          alt: m.alt,
          caption: m.caption,
        }
  );

  return (
    <>
      <DocClose href="/#work" label="Back to work" />

      <main className="doc doc-body">
        <header>
          <p className="doc-meta-line void-mono">
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </p>
          <h1 className="doc-title doc-title-project">{project.title}</h1>
          {project.summary ? <p className="doc-lede">{project.summary}</p> : null}
        </header>

        <div className="doc-cols">
          <div className="doc-main">
            {project.description ? (
              <section>
                <h2 className="doc-h void-mono">Description</h2>
                <p className="doc-text doc-long">{project.description}</p>
              </section>
            ) : null}

            {project.features?.length ? (
              <section>
                <h2 className="doc-h void-mono">Key points</h2>
                <ul className="doc-points">
                  {project.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {project.challenges ? (
              <section>
                <h2 className="doc-h void-mono">Challenges</h2>
                <p className="doc-text doc-long">{project.challenges}</p>
              </section>
            ) : null}
          </div>

          <aside className="doc-aside">
            {project.skills?.length ? (
              <section>
                <h2 className="doc-h void-mono">Made with</h2>
                <ul className="doc-stack">
                  {project.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {hasLinks ? (
              <section>
                <h2 className="doc-h void-mono">Find it</h2>
                <ul className="doc-links void-mono">
                  {project.githubUrl ? (
                    <li>
                      <a href={project.githubUrl} target="_blank" rel="noreferrer">
                        {project.githubUrl.includes("github.com") ? "GitHub repo" : "Source"}
                      </a>
                    </li>
                  ) : null}
                  {project.demoUrl ? (
                    <li>
                      <a href={project.demoUrl} target="_blank" rel="noreferrer">
                        Live demo
                      </a>
                    </li>
                  ) : null}
                </ul>
              </section>
            ) : null}
          </aside>
        </div>

        {media.length ? <ProjectMedia items={media} /> : null}
      </main>
    </>
  );
}
