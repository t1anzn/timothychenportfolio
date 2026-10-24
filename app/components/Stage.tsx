"use client";

import Link from "next/link";

import AsciiThumb from "./AsciiThumb";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  CONTACT,
  FACTS,
  INTERESTS,
  INTRO,
  LOCATION,
  NOW,
  SECTIONS,
  STACK,
  type SectionId,
  type WorkProject,
} from "./landing-data";

const LEADER = ". ".repeat(48); // clipped to whatever width the gap leaves
const CLOSE_DOTS = ". . . . . ";

const isSection = (v: string): v is SectionId => SECTIONS.some((s) => s.id === v);

// The interactive centre of the page. A fixed "sky line" of four stars sits at
// the bottom and never moves: the glyph stays above it, and a section opens
// between the two. Choosing a star dissolves the ASCII glyph (by easing --p on
// the page root, which AsciiGlyph reads); choosing it again, or Esc, closes it.
// Switching between sections is an instant swap.
export default function Stage({ projects, portrait }: { projects: WorkProject[]; portrait?: string }) {
  const [open, setOpen] = useState<SectionId | null>(null);
  const reduce = useRef(false);

  // Open a section straight from the URL hash, so a link can point at one.
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fromHash = window.location.hash.slice(1);
    if (isSection(fromHash)) setOpen(fromHash);
  }, []);

  // Ease the glyph's dissolve toward open (1) or closed (0).
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".void");
    if (!root) return;
    const target = open ? 1 : 0;
    // Under reduced motion the glyph never dissolves, so just dim it instead.
    root.style.setProperty("--g", reduce.current && open ? "0.08" : "1");
    if (reduce.current) return;

    let p = parseFloat(root.style.getPropertyValue("--p")) || 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      p += (target - p) * (1 - Math.exp(-dt * 3.2));
      if (Math.abs(target - p) < 0.002) p = target;
      root.style.setProperty("--p", p.toFixed(4));
      if (p !== target) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const select = useCallback((id: SectionId | null) => {
    setOpen(id);
    window.history.replaceState(null, "", id ? `#${id}` : window.location.pathname);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") select(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, select]);

  const activeIdx = SECTIONS.findIndex((s) => s.id === open);

  return (
    <div className={open ? "void-ui is-open" : "void-ui"}>
      {open ? (
        <div className="void-stack">
          <section className="void-panel" aria-label={open}>
            <div className="void-panel-body">
              <SectionBody id={open} projects={projects} portrait={portrait} />
            </div>
          </section>
        </div>
      ) : null}

      {open ? (
        <button
          type="button"
          className="void-close"
          aria-label="Close section"
          onClick={() => select(null)}
        >
          <span className="void-close-art" aria-hidden="true">
            <span className="void-close-dots">{CLOSE_DOTS}</span>
            <span className="void-close-core" />
            <span className="void-close-dots">{CLOSE_DOTS}</span>
          </span>
        </button>
      ) : null}

      <nav className="void-dock" aria-label="Sections">
        <ul>
          {SECTIONS.map((s, i) => (
            <Fragment key={s.id}>
              {i > 0 ? (
                <li className="dock-leader" aria-hidden="true" data-lit={activeIdx >= i}>
                  {LEADER}
                </li>
              ) : null}
              <li>
                <button
                  type="button"
                  aria-pressed={open === s.id}
                  onClick={() => select(open === s.id ? null : s.id)}
                >
                  <span className="dock-star" aria-hidden="true" data-on={open === s.id} />
                  <span className="dock-label void-mono">{s.label}</span>
                </button>
              </li>
            </Fragment>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function SectionBody({ id, projects, portrait }: { id: SectionId; projects: WorkProject[]; portrait?: string }) {
  if (id === "about") return <About portrait={portrait} />;
  if (id === "now") return <Now />;
  if (id === "work") return <Work projects={projects} />;
  return <Contact />;
}

function About({ portrait }: { portrait?: string }) {
  const content = (
    <>
      <p className="p-big">{INTRO}</p>
      <p className="p-where void-mono">{LOCATION}</p>

      <span className="void-mono p-stack-title">Technical skills</span>
      <dl className="p-stack">
        {STACK.map((group) => (
          <div key={group.label}>
            <dt className="void-mono">{group.label}</dt>
            <dd>
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      <div className="p-cols">
        <div>
          <span className="void-mono">Interested in</span>
          <ul className="p-focus">
            {INTERESTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="void-mono">Fun facts</span>
          <ul className="p-facts">
            {FACTS.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );

  // With a portrait it is the main element of the section: a tall picture down the left
  // that stays in view while the rest scrolls beside it.
  if (!portrait) return content;
  return (
    <div className="p-about">
      <AsciiThumb src={portrait} alt="Timothy Chen" className="p-thumb-portrait" />
      <div className="p-about-main">{content}</div>
    </div>
  );
}

function Now() {
  return (
    <dl className="p-now">
      {NOW.map((item) => (
        <div key={item.label}>
          <dt className="void-mono">{item.label}</dt>
          <dd>{item.text}</dd>
        </div>
      ))}
    </dl>
  );
}

// "Work in progress" and "In progress" are the same thing to someone filtering.
const statusKey = (status: string) => status.trim().toLowerCase().replace(/^work in progress$/, "in progress");
const sentence = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

function Work({ projects }: { projects: WorkProject[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  // The statuses that occur among the projects, in the order they first appear.
  const statuses = useMemo(() => {
    const seen: string[] = [];
    for (const p of projects) {
      const key = statusKey(p.status);
      if (key && !seen.includes(key)) seen.push(key);
    }
    return seen;
  }, [projects]);

  // Every word typed has to appear somewhere in the project; a status narrows it further.
  const shown = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return projects.filter((p) => {
      if (status && statusKey(p.status) !== status) return false;
      const haystack = `${p.title} ${p.summary} ${p.skills.join(" ")} ${p.year} ${p.status}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }, [projects, query, status]);

  const filtered = query !== "" || status !== null;
  const clear = () => {
    setQuery("");
    setStatus(null);
  };

  return (
    <>
      <div className="p-tools" role="search">
        <div className="p-tools-top">
          <label className="p-search">
            <span className="void-mono">Search</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                // Escape clears what was typed first; only an empty box lets it close the section.
                if (e.key === "Escape" && query) {
                  setQuery("");
                  e.stopPropagation();
                }
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <p className="p-count void-mono" aria-live="polite">
            {shown.length} of {projects.length}
            {filtered ? (
              <button type="button" onClick={clear}>
                Clear
              </button>
            ) : null}
          </p>
        </div>

        <div className="p-chips void-mono">
          <span>Status</span>
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              aria-pressed={status === st}
              onClick={() => setStatus(status === st ? null : st)}
            >
              {sentence(st)}
            </button>
          ))}
        </div>
      </div>

      {shown.length ? (
        <ul className="p-work">
          {shown.map((p) => (
            <li key={p.slug ?? p.title}>
              <AsciiThumb src={p.thumb} alt={p.title} />
              <div className="p-card">
                <h3>
                  {p.slug ? (
                    <Link href={`/projects/${p.slug}`}>
                      <span className="p-title">{p.title}</span>
                    </Link>
                  ) : (
                    p.title
                  )}
                </h3>
                <p className="void-mono p-meta">
                  {p.year} {p.status}
                </p>
                <p className="p-text">{p.summary}</p>
                {p.skills.length ? <p className="void-mono p-meta">{p.skills.join(", ")}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-empty">
          Nothing matches that.{" "}
          <button type="button" onClick={clear}>
            Clear the filters
          </button>
        </p>
      )}
    </>
  );
}

function Contact() {
  return (
    <div className="p-contact">
      <span className="void-mono p-contact-label">Get in touch</span>
      <a className="p-email" href={`mailto:${CONTACT.email}`}>
        {CONTACT.email}
      </a>

      <ul className="p-reach">
        {CONTACT.links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noreferrer">
              <span className="void-mono">{l.label}</span>
              <span className="p-reach-handle">{l.handle}</span>
              <span className="p-reach-go void-mono" aria-hidden="true" />
            </a>
          </li>
        ))}
        <li className="p-reach-static">
          <span className="void-mono">Based in</span>
          <span className="p-reach-handle">London, UK</span>
        </li>
      </ul>
    </div>
  );
}
