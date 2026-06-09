"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";


const sections = [
  { id: "about", label: "about" },
  { id: "experience", label: "work experience" },
  { id: "projects", label: "projects" },
  { id: "contacts", label: "contacts" },
];

interface NowData {
  date: string;
  items: string[];
}

interface Project {
  title: string;
  year: string;
  status: string;
  slug?: string;
  hidden: boolean;
  thumb: string;
  summary: string;
  skills: string[];
}

export default function HomeClient({
  nowData,
  projects,
}: {
  nowData: NowData;
  projects: Project[];
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
                <a href="mailto:timothy.chen188@gmail.com">
                  timothy.chen188@gmail.com
                </a>
                <div>+44 7863 472 097</div>
                <div className="contact-icons" aria-label="Social links">
                  <a
                    className="contact-icon-link"
                    href="https://www.linkedin.com/in/timothychenldn/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <Linkedin size={18} aria-hidden="true" />
                  </a>
                  <a
                    className="contact-icon-link"
                    href="https://github.com/t1anzn"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    title="GitHub"
                  >
                    <Github size={18} aria-hidden="true" />
                  </a>
                  <a
                    className="contact-icon-link"
                    href="https://x.com/timtianye"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Twitter / X"
                    title="Twitter / X"
                  >
                    <Twitter size={18} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </details>

          <div className="mobile-nav-title">
            <div className="cv-name">Timothy Chen</div>
            <div className="muted">London, UK</div>
          </div>
        </div>
      </header>

      <aside className="cv-sidebar no-print" aria-label="Sections">
        <div className="cv-sidebar-header">
          <div className="cv-name">Timothy Chen</div>
          <div className="muted">London, UK</div>
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
          <a href="mailto:timothy.chen188@gmail.com">
            timothy.chen188@gmail.com
          </a>
          <div>+44 7863 472 097</div>
          <div className="contact-icons" aria-label="Social links">
            <a
              className="contact-icon-link"
              href="https://www.linkedin.com/in/timothychenldn/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin size={18} aria-hidden="true" />
            </a>
            <a
              className="contact-icon-link"
              href="https://github.com/t1anzn"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
            >
              <Github size={18} aria-hidden="true" />
            </a>
            <a
              className="contact-icon-link"
              href="https://x.com/timtianye"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter / X"
              title="Twitter / X"
            >
              <Twitter size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </aside>

      <main className="cv cv-main" aria-label="Content">
        <header className="print-only">
          <div className="cv-portrait-print" aria-hidden="true">
            <Image
              src="/IMG_2832.jpg"
              alt="Portrait"
              width={160}
              height={160}
              className="cv-portrait-img"
            />
          </div>
          <h1>Timothy Chen</h1>
          <div className="meta muted">
            <span>Software Engineering / Computer Science Student</span>
            <span>London, UK</span>
            <span>+44 7863 472 097</span>
            <span>timothy.chen188@gmail.com</span>
            <span>github.com/t1anzn</span>
          </div>
          <hr />
        </header>

        <section
          className={activeTab === "about" ? "tabpanel" : "tabpanel hidden"}
        >
          <div className="about-hero">
            <div className="cv-portrait-about" aria-hidden="true">
              <Image
                src="/IMG_2832.jpg"
                alt="Portrait"
                width={320}
                height={320}
                className="cv-portrait-img"
                priority
              />
            </div>

            <div className="about-hero-text">
              <h1>Hi, I&apos;m Timothy Chen.</h1>
              <p className="muted">
                computer science student / ai engineer in london.
              </p>

              <section>
                <h2>summary</h2>
                <p>
                  computer science student with experience building complete
                  applications, integrating AI solutions and solving system
                  design challenges.
                </p>
              </section>
            </div>
          </div>

          <section>
            <h2>skills</h2>
            <div className="skills-groups">
              <div className="skill-group">
                <div className="skill-group-title">frontend</div>
                <p className="muted">
                  React, Next.js, TypeScript, Tailwind CSS
                </p>
              </div>
              <div className="skill-group">
                <div className="skill-group-title">backend</div>
                <p className="muted">Python, Flask, SQLAlchemy</p>
              </div>
              <div className="skill-group">
                <div className="skill-group-title">mobile</div>
                <p className="muted">React Native</p>
              </div>
              <div className="skill-group">
                <div className="skill-group-title">cloud / devops</div>
                <p className="muted">AWS, Docker, Firebase</p>
              </div>
              <div className="skill-group">
                <div className="skill-group-title">data</div>
                <p className="muted">SQL</p>
              </div>
            </div>
          </section>

          <section>
            <h2>education</h2>
            <div className="edu-list">
              <div className="edu-item">
                <div className="row">
                  <strong>BSc (Hons) Computer Science — UAL</strong>
                  <span className="muted right">Sep 2024 – 2027</span>
                </div>
              </div>
              <div className="edu-item">
                <div className="row">
                  <strong>
                    CertHE Creative Computing — Goldsmiths, University of London
                  </strong>
                  <span className="muted right">Sep 2021 – Jun 2023</span>
                </div>
              </div>
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
            <div className="timeline-item">
              <p className="timeline-title">
                <strong>Founding Growth Intern — Selah</strong>
                <span className="muted"> — May 2026 – Present</span>
              </p>
              <ul>
                <li>
                  First hire at an early-stage email-first Bible reading startup,
                  owning growth across content, partnerships, and community.
                </li>
                <li>
                  Running growth experiments across social media and outreach
                  channels, and building AI tooling to automate repeatable tasks.
                </li>
              </ul>
            </div>

            <div className="timeline-item">
              <p className="timeline-title">
                <strong>Barista — Costa Coffee</strong>
                <span className="muted"> — Oct 2025 – Present</span>
              </p>
              <ul>
                <li>
                  Delivered customer-first service while preparing coffee and
                  beverages to standard, maintaining speed and accuracy during
                  busy periods.
                </li>
                <li>
                  Maintained cleanliness across the store for dine-in service,
                  including tables and front-of-house.
                </li>
                <li>
                  Followed SOPs for drink prep, food handling, and
                  closing/opening procedures.
                </li>
                <li>
                  Completed ongoing online Costa learning and training modules
                  to stay aligned with store standards.
                </li>
              </ul>
            </div>

            <div className="timeline-item">
              <p className="timeline-title">
                <strong>Barista — Chatime</strong>
                <span className="muted"> — Jul 2024 – Jan 2025</span>
              </p>
              <ul>
                <li>
                  Prepared drinks to standard while maintaining speed and
                  accuracy during busy periods.
                </li>
                <li>
                  Managed stock levels and ensured ingredient availability.
                </li>
                <li>Delivered friendly, efficient customer service.</li>
              </ul>
            </div>

            <div className="timeline-item">
              <p className="timeline-title">
                <strong>3D Visual Artist — Self-Employed</strong>
                <span className="muted"> — Jan 2016 – 2024</span>
              </p>
              <ul>
                <li>
                  Produced 3D visual assets using Cinema4D and Adobe Photoshop.
                </li>
                <li>
                  Optimised rendering times through post-processing and workflow
                  improvements.
                </li>
                <li>
                  Managed end-to-end project delivery: requirements, feedback
                  cycles, and deadlines.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          className={activeTab === "projects" ? "tabpanel" : "tabpanel hidden"}
        >
          <h1 className="visually-hidden">Projects</h1>
          <h2>Selected Projects</h2>
          <div className="projects-list">
            {projects.map((p) => (
              <div
                className="projects-item"
                key={p.slug ?? `${p.title}-${p.year}`}
              >
                <div className="projects-left">
                  <div className="projects-thumb">
                    <Image
                      src={p.thumb}
                      alt={`${p.title} thumbnail`}
                      width={150}
                      height={150}
                      className="projects-thumb-img"
                    />
                  </div>
                  <div className="projects-text">
                    <div className="projects-title">
                      {p.slug && !p.hidden ? (
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
            Email:{" "}
            <a href="mailto:timothy.chen188@gmail.com">
              timothy.chen188@gmail.com
            </a>
            <br />
            Phone: +44 7863 472 097
            <br />
            Location: London, UK
          </p>

          <h2>Links</h2>
          <ul>
            <li>
              <a
                href="https://www.linkedin.com/in/timothychenldn/"
                target="_blank"
                rel="noreferrer"
              >
                <span className="inline-icon" aria-hidden="true">
                  <Linkedin size={16} />
                </span>
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com/t1anzn"
                target="_blank"
                rel="noreferrer"
              >
                <span className="inline-icon" aria-hidden="true">
                  <Github size={16} />
                </span>
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://x.com/timtianye"
                target="_blank"
                rel="noreferrer"
              >
                <span className="inline-icon" aria-hidden="true">
                  <Twitter size={16} />
                </span>
                X
              </a>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
