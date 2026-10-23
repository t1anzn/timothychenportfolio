"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; tw: number };

const STAR_COUNT = 170;
const CELL_W = 7;
const CELL_H = 11; // same grid as the glyph, so the sky and the glyph align
const GLYPHS = [".", ".", ":", "+", "*"]; // far to near

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// ASCII star field on the page's character grid. Stars drift upward by depth
// (z) and twinkle. When a section opens (--p), the sky eases a short way along
// a diagonal, with near stars travelling further than far ones.
export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.querySelector<HTMLElement>(".void");
    const readP = () =>
      reduce || !root ? 0 : parseFloat(root.style.getPropertyValue("--p")) || 0;

    let cols = 0;
    let rows = 0;
    let raf = 0;
    let last = performance.now();

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random() ** 1.6,
      tw: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CELL_H - 1}px ${getComputedStyle(canvas).fontFamily}`;
      ctx.textBaseline = "top";
      ctx.fillStyle = "#f2f2f2";
      cols = Math.floor(w / CELL_W);
      rows = Math.floor(h / CELL_H);
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // While a section is open the sky eases a short way along a diagonal.
      const pan = clamp01(readP());

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const st of stars) {
        if (!reduce) {
          st.y -= dt * 0.012 * (0.3 + st.z);
          if (st.y < 0) st.y += 1;
          st.tw += dt * (0.5 + st.z);
        }
        const depth = 0.1 + st.z * 0.9;
        const offX = pan * 0.18 * cols * depth;
        const offY = pan * 0.12 * rows * depth;

        const c = (((st.x * cols - offX) % cols) + cols) % cols;
        const r = (((st.y * rows - offY) % rows) + rows) % rows;

        if (c < 0 || c >= cols || r < 0 || r >= rows) continue;

        const pulse = reduce ? 1 : 0.6 + 0.4 * Math.sin(st.tw);
        const tier = Math.min(
          GLYPHS.length - 1,
          Math.floor(st.z * GLYPHS.length + (pulse > 0.95 ? 1 : 0))
        );
        const glyph = GLYPHS[tier];
        ctx.globalAlpha = (0.18 + st.z * 0.5) * pulse;
        ctx.fillText(glyph, Math.floor(c) * CELL_W, Math.floor(r) * CELL_H);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      resize();
      if (reduce) draw(performance.now());
    };

    resize();
    if (reduce) {
      // Wait for the mono font before the single static frame.
      document.fonts.ready.then(() => {
        resize();
        draw(performance.now());
      });
    } else {
      raf = requestAnimationFrame(draw);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="void-stars" aria-hidden="true" />;
}
