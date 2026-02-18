"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const projects = [
  {
    title: "Full-Stack Movie Database",
    year: "2025",
    status: "Completed",
    slug: "movie-database",
    thumb: "/cinemindthumb.png",
    summary:
      "full-stack web app for browsing/searching films with a structured backend + database.",
    skills: ["react", "python", "sql", "api", "ai"],
  },
  {
    title: "Compute Energy Analytics System (CEAS)",
    year: "2026",
    status: "Work in Progress",
    thumb: "/placeholder.svg",
    summary:
      "visual + comparative analysis of AI workload energy consumption using the university’s existing zigbee telemetry infrastructure.",
    skills: ["iot", "data", "ai"],
  },
  {
    title: "AI Study Companion App",
    year: "2025",
    status: "In Progress",
    slug: "ai-study-companion",
    thumb: "/clarifyiphone.png",
    summary:
      "mobile study companion concept with ai-assisted features and a firebase-backed workflow.",
    skills: ["react-native", "typescript", "firebase", "ai"],
  },
  {
    title: "Smart IoT Watering System",
    year: "2024",
    status: "Completed",
    slug: "smart-watering-system",
    thumb: "/smartwateringmockup.png",
    summary:
      "iot plant watering prototype with sensor data, automation rules, and a companion interface.",
    skills: ["iot", "react-native", "firebase"],
  },
  {
    title: "Machine Learning Topic Classifier",
    year: "2025",
    status: "Completed",
    slug: "topic-classifier",
    thumb: "/topic-classifier-preview.png",
    summary:
      "ml text classification project focused on dataset prep, training, and evaluation.",
    skills: ["ml", "python"],
  },
  {
    title: "Mandarin Powerpoint Generator",
    year: "2025",
    status: "Completed",
    slug: "mandarin-ppt-generator",
    thumb: "/mandarin-ppt-gui.png",
    summary:
      "python tool to generate mandarin learning slides programmatically.",
    skills: ["python"],
  },
];

type SkillKey =
  | "react"
  | "nextjs"
  | "typescript"
  | "python"
  | "sql"
  | "firebase"
  | "react-native"
  | "ai"
  | "ml"
  | "iot"
  | "api"
  | "data";

function Footnote({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <span className="fn">
      <a className="fn-ref" href={`#${id}`} aria-describedby={id}>
        [{id.replace("fn-", "")}]
      </a>
      <span className="fn-pop muted" role="note" id={id}>
        {children}
      </span>
    </span>
  );
}

const sections = [
  { id: "about", label: "about" },
  { id: "experience", label: "work experience" },
  { id: "projects", label: "projects" },
  { id: "contacts", label: "contacts" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>(sections[0]?.id);

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
              onClick={() => {
                setActiveTab(t.id);
                window.history.replaceState(null, "", `#${t.id}`);
              }}
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
            <h2>what i'm up to now</h2>
            <p className="muted">feb 2026</p>
            <div className="now-list">
              <div className="now-item">
                <p className="muted">
                  second year bsc (hons) computer science at ual cci, studying
                  software engineering, critical interfaces (hci), and global
                  perspectives on computer science.
                </p>
              </div>

              <div className="now-item">
                <p className="muted">
                  working towards the aws cloud practitioner certificate,
                  focusing on core services + fundamentals (iam, vpc, ec2, s3),
                  security best practices, and pricing.
                </p>
              </div>

              <div className="now-item">
                <p className="muted">
                  building on jasper shuoyang zheng’s work in a certpg project
                  exploring genai coding tools in creative coding curriculums —
                  experimenting with scaffolded copilot chat modes and ways to
                  embed ai literacy + reflection into teaching.
                </p>
                <p className="muted">
                  <a
                    href="https://jaspersz.myblog.arts.ac.uk/2026/02/01/reflections-on-genai-coding-tools-in-creative-coding-curriculums/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    blog post
                  </a>{" "}
                  /{" "}
                  <a
                    href="https://git.arts.ac.uk/zshuoyang/MathematicsStatistics_Fall2025/blob/main/.github/chatmodes/rubber-duck.chatmode.md"
                    target="_blank"
                    rel="noreferrer"
                  >
                    chat mode
                  </a>
                </p>
              </div>
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
                <strong>
                  Research Assistant — Animating Minds (UAL, UKRI funded)
                </strong>
                <span className="muted"> — Oct 2025 – Present</span>
                <Footnote id="fn-1">UKRI funded research programme.</Footnote>
              </p>
              <ul>
                <li>
                  Working alongside an interdisciplinary team to explore the
                  impact of animated media and visual storytelling on children’s
                  cognitive and emotional growth.
                </li>
                <li>
                  Supporting research on children’s interpretations of
                  fantastical events in animated content, using machine learning
                  and vision-language models to analyze narrative and visual
                  characteristics.
                  <Footnote id="fn-2">
                    Used ML/VLM tooling to help analyse narrative + visual
                    features.
                  </Footnote>
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

          <hr className="no-print" />
          <section className="no-print" aria-label="Footnotes">
            <h2>Footnotes</h2>
            <ol className="muted">
              <li id="fn-1">UKRI funded research programme.</li>
              <li id="fn-2">Used ML/VLM tooling to support analysis.</li>
            </ol>
          </section>
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
                      {p.slug ? (
                        <Link href={`/projects/${p.slug}`}>{p.title}</Link>
                      ) : (
                        <span className="project-title-plain">{p.title}</span>
                      )}
                    </div>
                    <div className="muted projects-summary">{p.summary}</div>
                    <div className="muted projects-meta">{p.year} — {p.status}</div>
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
