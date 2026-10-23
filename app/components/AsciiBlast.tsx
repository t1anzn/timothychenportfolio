"use client";

import { useEffect, useRef } from "react";

const CELL_W = 7;
const CELL_H = 11; // same grid as the glyph and the stars
const RAMP = " .:-=+*#%@";
const RADIUS = 34; // px, the blast radius
const NEAR = 16; // how close the pointer must be to text to set it off
const REINDEX_MS = 300; // how often letter positions are re-read while hovering
const PAGE_BG = "#070707"; // what a letter is painted out with: the page colour plus its film grain

// One letter on the page: its box, how heavy its type is, and (for real text)
// the character and font so its actual shape can be sampled. cells is filled in
// lazily, only for letters the pointer gets near.
type Cell = { c: number; r: number; cov: number };
type Glyph = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  level: number;
  ch?: string;
  font?: string;
  cells?: Cell[];
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Hover blast: an invisible radius follows the pointer, and any letter whose
// centre falls inside it becomes ASCII. Whole letters switch at a time, so there
// is no circular cut through a letter and nothing is drawn for the radius itself:
// the only thing that shows it is the text changing. A switched letter is painted
// out with the page colour and drawn as characters over the cells its strokes
// cover (each letter is rasterised, so the ASCII follows its shape, not its box).
// Move away and the radius shrinks back and the letters return. It reads real letter
// positions, so it works on any text on the page.
export default function AsciiBlast() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const root = document.querySelector<HTMLElement>(".void");
    if (!canvas || !ctx || !root) return;
    // Hover needs a pointer that can hover, and motion needs to be allowed.
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pointer = { x: -9999, y: -9999, active: false };
    let glyphs: Glyph[] = [];
    let cols = 0;
    let rows = 0;
    let radius = 0;
    let drawn = false;
    let lastIndex = -Infinity;
    let raf = 0;
    let last = performance.now();

    // Only the body text reacts: the open section on the landing, or the content of
    // a document page. Buttons, links, the sky line, the top bar, the close mark and
    // the glyph are left alone.
    const bodies = () => Array.from(root.querySelectorAll<HTMLElement>(".void-panel-body, .doc-body"));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CELL_H - 1}px ${getComputedStyle(canvas).fontFamily}`;
      ctx.textBaseline = "top";
      ctx.fillStyle = "#f2f2f2";
      cols = Math.ceil(w / CELL_W);
      rows = Math.ceil(h / CELL_H);
      lastIndex = -Infinity;
    };

    // Read where every letter currently is on screen.
    const index = () => {
      const out: Glyph[] = [];
      const range = document.createRange();
      for (const host of bodies()) {
        const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const text = node.textContent ?? "";
          const parent = node.parentElement;
          if (!parent || !text.trim()) continue;
          if (parent.closest("a, button")) continue;
          const style = getComputedStyle(parent);
          if (style.visibility === "hidden" || style.display === "none") continue;
          const level = clamp(Math.round((parseFloat(style.fontSize) || 16) / 6), 2, 9);
          const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          const upper = style.textTransform === "uppercase";
          // Text scrolled out of its panel is clipped, so it is not on screen.
          const clip = host.getBoundingClientRect();
          for (let i = 0; i < text.length; i++) {
            if (/\s/.test(text[i])) continue;
            range.setStart(node, i);
            range.setEnd(node, i + 1);
            const rect = range.getBoundingClientRect();
            if (!rect.width || rect.bottom < 0 || rect.top > window.innerHeight) continue;
            if (clip && (rect.bottom < clip.top || rect.top > clip.bottom)) continue;
            out.push({
              x0: rect.left,
              x1: rect.right,
              y0: rect.top,
              y1: rect.bottom,
              level,
              ch: upper ? text[i].toUpperCase() : text[i],
              font,
            });
          }
        }
      }
      glyphs = out;
    };

    // Which cells a letter's strokes actually cover. The letter is drawn to a
    // small scratch canvas in its own font and each grid cell it overlaps is
    // scored by how much of it is ink. Marks without text count as solid.
    const scratch = document.createElement("canvas");
    const sctx = scratch.getContext("2d", { willReadFrequently: true });
    const cellsFor = (g: Glyph): Cell[] => {
      if (g.cells) return g.cells;
      const cells: Cell[] = [];
      const w = Math.max(1, Math.ceil(g.x1 - g.x0));
      const h = Math.max(1, Math.ceil(g.y1 - g.y0));
      let data: Uint8ClampedArray | null = null;
      if (g.ch && g.font && sctx) {
        scratch.width = w;
        scratch.height = h;
        sctx.clearRect(0, 0, w, h);
        sctx.font = g.font;
        sctx.textBaseline = "middle";
        sctx.fillStyle = "#fff";
        sctx.fillText(g.ch, 0, h / 2);
        data = sctx.getImageData(0, 0, w, h).data;
      }
      for (let c = Math.floor(g.x0 / CELL_W); c <= Math.floor((g.x1 - 0.01) / CELL_W); c++) {
        for (let r = Math.floor(g.y0 / CELL_H); r <= Math.floor((g.y1 - 0.01) / CELL_H); r++) {
          if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
          let cov = 1;
          if (data) {
            // Average ink over the part of this cell that lies inside the letter box.
            const px0 = Math.max(0, Math.floor(c * CELL_W - g.x0));
            const px1 = Math.min(w, Math.ceil((c + 1) * CELL_W - g.x0));
            const py0 = Math.max(0, Math.floor(r * CELL_H - g.y0));
            const py1 = Math.min(h, Math.ceil((r + 1) * CELL_H - g.y0));
            let sum = 0;
            let n = 0;
            for (let y = py0; y < py1; y++) {
              for (let x = px0; x < px1; x++) {
                sum += data[(y * w + x) * 4 + 3];
                n++;
              }
            }
            cov = n ? sum / (n * 255) : 0;
            if (cov < 0.12) continue;
          }
          cells.push({ c, r, cov: Math.min(1, cov * 1.8) });
        }
      }
      g.cells = cells;
      return cells;
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!pointer.active) {
        radius += (0 - radius) * (1 - Math.exp(-dt * 10));
      }

      if (pointer.active) {
        if (now - lastIndex > REINDEX_MS) {
          index();
          lastIndex = now;
        }
        let near = false;
        for (const g of glyphs) {
          const dx = Math.max(g.x0 - pointer.x, 0, pointer.x - g.x1);
          const dy = Math.max(g.y0 - pointer.y, 0, pointer.y - g.y1);
          if (dx * dx + dy * dy < NEAR * NEAR) {
            near = true;
            break;
          }
        }
        radius += ((near ? RADIUS : 0) - radius) * (1 - Math.exp(-dt * 12));
      }

      if (radius < 0.5) {
        if (drawn) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          drawn = false;
        }
        return;
      }
      drawn = true;

      // Every letter whose centre is inside the radius switches to ASCII.
      const hit: Glyph[] = [];
      for (const g of glyphs) {
        const cx = (g.x0 + g.x1) / 2;
        const cy = (g.y0 + g.y1) / 2;
        if (Math.hypot(cx - pointer.x, cy - pointer.y) <= radius) hit.push(g);
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Paint the real letters out with the page colour (a little over-sized to
      // cover their anti-aliased edges).
      ctx.globalAlpha = 1;
      ctx.fillStyle = PAGE_BG;
      for (const g of hit) ctx.fillRect(g.x0 - 1, g.y0, g.x1 - g.x0 + 2, g.y1 - g.y0);

      // Draw ASCII on the cells their strokes covered.
      const ink = new Map<number, { level: number; cov: number }>();
      for (const g of hit) {
        for (const cell of cellsFor(g)) {
          const key = cell.r * cols + cell.c;
          const prev = ink.get(key);
          if (!prev || cell.cov > prev.cov) ink.set(key, { level: g.level, cov: cell.cov });
        }
      }

      ctx.fillStyle = "#f2f2f2";
      const frame = Math.floor(now / 80);
      ink.forEach(({ level, cov }, key) => {
        const c = key % cols;
        const r = Math.floor(key / cols);
        const noise = ((c * 73856093) ^ (r * 19349663) ^ (frame * 83492791)) >>> 0;
        const flicker = noise % 10 > 7 ? 1 : noise % 10 < 2 ? -1 : 0;
        const lvl = clamp(Math.round(level * (0.6 + 0.7 * cov) + flicker), 1, 9);
        ctx.globalAlpha = 0.45 + 0.55 * cov;
        ctx.fillText(RAMP[lvl], c * CELL_W, r * CELL_H);
      });
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDirty = () => {
      lastIndex = -Infinity;
    };

    // Letter positions change when the content does.
    const ui = root.querySelector(".void-ui");
    const observer = new MutationObserver(onDirty);
    if (ui) observer.observe(ui, { childList: true, subtree: true, characterData: true });

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="void-blast" aria-hidden="true" />;
}
