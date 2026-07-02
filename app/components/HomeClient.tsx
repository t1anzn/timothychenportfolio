"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { urlFor } from "@/sanity/lib/image";
import type { NowData, ProjectListItem, SiteSettings } from "@/sanity/lib/types";

const PLACEHOLDER_IMG = "/placeholder.svg";

const sections = [
  { id: "about", label: "about" },
  { id: "experience", label: "work experience" },
  { id: "projects", label: "projects" },
  { id: "contacts", label: "contacts" },
];

function thumbUrl(thumbnail: ProjectListItem["thumbnail"], size = 150) {
  return thumbnail
    ? urlFor(thumbnail).width(size).height(size).fit("crop").url()
    : PLACEHOLDER_IMG;
}

function portraitUrl(portrait: SiteSettings["portrait"], size: number) {
  return portrait
    ? urlFor(portrait).width(size).height(size).fit("crop").url()
    : PLACEHOLDER_IMG;
}

export default function HomeClient({
  nowData,
  projects,
  siteSettings,
}: {
  nowData: NowData;
  projects: ProjectListItem[];
  siteSettings: SiteSettings;
}) {
  const [activeTab, setActiveTab] = useState<string>(sections[0]?.id);
  const mobileMenuRef = useRef<HTMLDetailsElement | null>(null);

  const selectTab = (id: string) => {
    setActiveTab(id);
    window.history.replaceState(null, "", `#${id}`);
    mobileMenuRef.current?.removeAttribute("open");
  };

  useEffect(() => {
    const syncTabFromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id && sections.some((s) => s.id === id)) {
        setActiveTab(id);
      }
    };

    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  const { socialLinks } = siteSettings;

  const contactIcons = (
    <div className="contact-icons" aria-label="Social links">
      {socialLinks?.linkedin ? (
        <a
          className="contact-icon-link"
          href={socialLinks.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <Linkedin size={18} aria-hidden="true" />
        </a>
      ) : null}
      {socialLinks?.github ? (
        <a
          className="contact-icon-link"
          href={socialLinks.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <Github size={18} aria-hidden="true" />
        </a>
      ) : null}
      {socialLinks?.twitter ? (
        <a
          className="contact-icon-link"
          href={socialLinks.twitter}
          target="_blank"
          rel="noreferrer"
          aria-label="Twitter / X"
          title="Twitter / X"
        >
          <Twitter size={18} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );

  return (
    <div className="cv-shell">
      <header className="mobile-nav no-print" aria-label="Mobile menu">
        <div className="mobile-nav-row">
          <details className="mobile-menu" ref={mobileMenuRef}>
            <summary className="mobile-menu-summary" aria-label="Open menu">
              <span className="hamburger" aria-hidden="true">
                <span className="hamburger-line" />
                <span className="hamburger-line" />
                <span className="hamburger-line" />
              </span>
            </summary>
            <div className="mobile-menu-panel">
              <nav className="mobile-menu-tabs" aria-label="Sections">
                {sections.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={activeTab === t.id ? "tab tab-active" : "tab"}
                    aria-pressed={activeTab === t.id}
                    onClick={() => selectTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </nav>
              <div className="mobile-menu-footer muted" aria-label="Contacts">
                <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
                <div>{siteSettings.phone}</div>
                {contactIcons}
              </div>
            </div>
          </details>

          <div className="mobile-nav-title">
            <div className="cv-name">{siteSettings.name}</div>
            <div className="muted">{siteSettings.location}</div>
          </div>
        </div>
      </header>

      <aside className="cv-sidebar no-print" aria-label="Sections">
        <div className="cv-sidebar-header">
          <div className="cv-name">{siteSettings.name}</div>
          <div className="muted">{siteSettings.location}</div>
        </div>

        <nav className="cv-tabs" aria-label="Tabs">
          {sections.map((t) => (
            <button
              key={t.id}
              type="button"
              className={activeTab === t.id ? "tab tab-active" : "tab"}
              aria-pressed={activeTab === t.id}
              onClick={() => selectTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="cv-sidebar-footer muted">
          <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
          <div>{siteSettings.phone}</div>
          {contactIcons}
        </div>
      </aside>

      <main className="cv cv-main" aria-label="Content">
        <header className="print-only">
          <div className="cv-portrait-print" aria-hidden="true">
            <Image
              src={portraitUrl(siteSettings.portrait, 160)}
              alt="Portrait"
              width={160}
              height={160}
              className="cv-portrait-img"
            />
          </div>
          <h1>{siteSettings.name}</h1>
          <div className="meta muted">
            <span>Software Engineering / Computer Science Student</span>
            <span>{siteSettings.location}</span>
            <span>{siteSettings.phone}</span>
            <span>{siteSettings.email}</span>
            {socialLinks?.github ? (
              <span>{socialLinks.github.replace(/^https?:\/\//, "")}</span>
            ) : null}
          </div>
          <hr />
        </header>

        <section
          className={activeTab === "about" ? "tabpanel" : "tabpanel hidden"}
        >
          <div className="about-hero">
            <div className="cv-portrait-about" aria-hidden="true">
              <Image
                src={portraitUrl(siteSettings.portrait, 320)}
                alt="Portrait"
                width={320}
                height={320}
                className="cv-portrait-img"
                priority
              />
            </div>

            <div className="about-hero-text">
              <h1>Hi, I&apos;m {siteSettings.name}.</h1>
              <p className="muted">{siteSettings.heroTagline}</p>

              <section>
                <h2>summary</h2>
                <p>{siteSettings.summary}</p>
              </section>
            </div>
          </div>

          <section>
            <h2>skills</h2>
            <div className="skills-groups">
              {siteSettings.skillGroups?.map((group) => (
                <div className="skill-group" key={group.groupName}>
                  <div className="skill-group-title">{group.groupName}</div>
                  <p className="muted">{group.skills?.join(", ")}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>education</h2>
            <div className="edu-list">
              {siteSettings.education?.map((item) => (
                <div className="edu-item" key={item.institution}>
                  <div className="row">
                    <strong>{item.institution}</strong>
                    <span className="muted right">{item.dateRange}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>what i&apos;m up to now</h2>
            <p className="muted">{nowData.date}</p>
            <div className="now-list">
              {nowData.items.map((item, i) => (
                <div className="now-item" key={i}>
                  <p className="muted">{item}</p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section
          className={
            activeTab === "experience" ? "tabpanel" : "tabpanel hidden"
          }
        >
          <h1 className="visually-hidden">Work Experience</h1>
          <h2>Work Experience</h2>

          <div className="timeline" aria-label="Work experience timeline">
            {siteSettings.experience?.map((job) => (
              <div className="timeline-item" key={`${job.role}-${job.dateRange}`}>
                <p className="timeline-title">
                  <strong>{job.role}</strong>
                  <span className="muted"> — {job.dateRange}</span>
                </p>
                <ul>
                  {job.bullets?.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section
          className={activeTab === "projects" ? "tabpanel" : "tabpanel hidden"}
        >
          <h1 className="visually-hidden">Projects</h1>
          <h2>Selected Projects</h2>
          <div className="projects-list">
            {projects
              .filter((p) => !p.hidden)
              .map((p) => (
                <div className="projects-item" key={p.slug}>
                  <div className="projects-left">
                    <div className="projects-thumb">
                      <Image
                        src={thumbUrl(p.thumbnail)}
                        alt={`${p.title} thumbnail`}
                        width={150}
                        height={150}
                        className="projects-thumb-img"
                      />
                    </div>
                    <div className="projects-text">
                      <div className="projects-title">
                        {p.slug ? (
                          <Link href={`/projects/${p.slug}`}>{p.title}</Link>
                        ) : (
                          <span className="project-title-plain">{p.title}</span>
                        )}
                      </div>
                      <div className="muted projects-summary">{p.summary}</div>
                      <div className="muted projects-meta">
                        {p.year} — {p.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section
          className={activeTab === "contacts" ? "tabpanel" : "tabpanel hidden"}
        >
          <h1 className="visually-hidden">Contacts</h1>
          <h2>Contact</h2>
          <p>
            Email: <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
            <br />
            Phone: {siteSettings.phone}
            <br />
            Location: {siteSettings.location}
          </p>

          <h2>Links</h2>
          <ul>
            {socialLinks?.linkedin ? (
              <li>
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
                  <span className="inline-icon" aria-hidden="true">
                    <Linkedin size={16} />
                  </span>
                  LinkedIn
                </a>
              </li>
            ) : null}
            {socialLinks?.github ? (
              <li>
                <a href={socialLinks.github} target="_blank" rel="noreferrer">
                  <span className="inline-icon" aria-hidden="true">
                    <Github size={16} />
                  </span>
                  GitHub
                </a>
              </li>
            ) : null}
            {socialLinks?.twitter ? (
              <li>
                <a href={socialLinks.twitter} target="_blank" rel="noreferrer">
                  <span className="inline-icon" aria-hidden="true">
                    <Twitter size={16} />
                  </span>
                  X
                </a>
              </li>
            ) : null}
          </ul>
        </section>
      </main>
    </div>
  );
}
