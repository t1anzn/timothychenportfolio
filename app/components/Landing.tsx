import Link from "next/link";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import AsciiBlast from "./AsciiBlast";
import AsciiCursor from "./AsciiCursor";
import AsciiGlyph from "./AsciiGlyph";
import Stage from "./Stage";
import StarField from "./StarField";
import type { WorkProject } from "./landing-data";
import "../landing.css";

// One screen, no scrolling. The ASCII 天 and the star field sit behind a menu
// in the middle of the page; choosing an item dissolves the glyph and opens
// that section in its place (see Stage.tsx).
export default function Landing({ projects }: { projects: WorkProject[] }) {
  return (
    <div className={`void ${GeistSans.variable} ${GeistMono.variable}`}>
      <StarField />
      <AsciiGlyph />

      <header className="void-nav void-mono">
        <span className="void-name">Timothy Chen</span>
        <Link className="void-cv" href="/cv">
          CV
        </Link>
      </header>

      <h1 className="void-sr">Timothy Chen. 天, tian, sky.</h1>
      <Stage projects={projects} />
      <AsciiBlast />
      <AsciiCursor />
    </div>
  );
}
