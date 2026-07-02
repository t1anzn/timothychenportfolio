import Link from "next/link";
import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { allProjectSlugsQuery, projectBySlugQuery } from "@/sanity/lib/queries";
import type { ProjectDetail } from "@/sanity/lib/types";

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allProjectSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

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

  return (
    <main className="cv cv-standalone">
      <header>
        <p className="muted">
          <Link href="/">Home</Link> / <Link href="/#projects">Projects</Link> /{" "}
          <span>{project.title}</span>
        </p>
        <h1>{project.title}</h1>
        <div className="meta muted">
          <span>{project.year}</span>
          <span>{project.status}</span>
          <span>{project.category}</span>
        </div>
      </header>

      <hr />

      {project.description ? (
        <section>
          <h2>Description</h2>
          <p>{project.description}</p>
        </section>
      ) : null}

      {project.skills?.length ? (
        <section>
          <h2>Tech</h2>
          <p className="muted">{project.skills.join(", ")}</p>
        </section>
      ) : null}

      {project.features?.length ? (
        <section>
          <h2>Key Points</h2>
          <ul>
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.challenges ? (
        <section>
          <h2>Challenges</h2>
          <p>{project.challenges}</p>
        </section>
      ) : null}

      {(project.githubUrl || project.demoUrl) && (
        <section>
          <h2>Links</h2>
          <ul>
            {project.githubUrl ? (
              <li>
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  {project.githubUrl.includes("github.com")
                    ? "GitHub repo"
                    : "Source"}
                </a>
              </li>
            ) : null}
            {project.demoUrl ? (
              <li>
                <a href={project.demoUrl} target="_blank" rel="noreferrer">
                  Live Demo
                </a>
              </li>
            ) : null}
          </ul>
        </section>
      )}

      {project.media?.length ? (
        <section>
          <h2>Media</h2>
          <div className="media-list">
            {project.media.map((media) => (
              <figure className="media-item" key={media._key}>
                {media._type === "mediaVideo" ? (
                  <video controls preload="metadata">
                    <source src={media.videoPath} />
                    {media.alt}
                  </video>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFor(media.asset).width(1600).auto("format").url()}
                    alt={media.alt}
                  />
                )}
                {media.caption ? (
                  <figcaption className="muted">{media.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
