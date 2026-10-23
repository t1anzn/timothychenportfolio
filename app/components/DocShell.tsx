import Link from "next/link";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import AsciiBlast from "./AsciiBlast";
import AsciiCursor from "./AsciiCursor";
import StarField from "./StarField";
import "../landing.css";

// The frame for pages that are documents rather than the one-screen landing (the
// projects index and each project): the same black sky of ASCII stars, the same
// top bar, the same ASCII cursor and hover effect, but the page scrolls normally.
export default function DocShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`void void-doc ${GeistSans.variable} ${GeistMono.variable}`}>
      <StarField />

      <header className="void-nav void-mono">
        <Link className="void-home" href="/">
          Home
        </Link>
        <span className="void-name">Timothy Chen</span>
        <Link className="void-cv" href="/cv">
          CV
        </Link>
      </header>

      {children}

      <AsciiBlast />
      <AsciiCursor />
    </div>
  );
}

// The same dotted close mark the landing uses, as a link back up a level. It stays
// pinned under the name, in the same place on every page.
export function DocClose({ href, label }: { href: string; label: string }) {
  return (
    <Link className="void-close" href={href} aria-label={label}>
      <span className="void-close-art" aria-hidden="true">
        <span className="void-close-dots">. . . . . </span>
        <span className="void-close-core" />
        <span className="void-close-dots">. . . . . </span>
      </span>
    </Link>
  );
}
