"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { asciiTransition, type AsciiTransition } from "./asciiTransition";

const GIVE_UP_MS = 4000; // lift the cover if a navigation never lands

// An ASCII wipe over the whole viewport between routes (see asciiTransition.ts). A
// click on an internal link starts it, the route changes once the page is covered,
// and it burns off when the new path arrives. The sky and the top bar remount on
// every route, so this also hides that flicker. Back/forward and anything else
// that changes the path skip the wipe.
export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const pending = useRef<AsciiTransition | null>(null);
  const giveUp = useRef(0);

  useEffect(() => {
    if (!pending.current) return;
    window.clearTimeout(giveUp.current);
    pending.current.reveal();
    pending.current = null;
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as Element | null)?.closest("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // same page: hash or section

      const href = url.pathname + url.search + url.hash;
      const t = asciiTransition({
        box: () => ({ left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }),
        swap: () => router.push(href),
      });
      if (!t) return; // reduced motion, or already running: let the link work as usual
      e.preventDefault();
      pending.current = t;
      giveUp.current = window.setTimeout(() => {
        pending.current?.reveal();
        pending.current = null;
      }, GIVE_UP_MS);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
