"use client";

import { useEffect, useRef } from "react";

const CARET_PX = 32; // size of the ^ (the glyph is small within its box)
const AT_PX = 18; // size of the @ it becomes over something clickable
const TILT = -0.5; // radians the ^ is tipped, so its point leans up and to the left like a pointer
const LEAN_IN = 14; // how quickly it changes to @ over something clickable (per second)

// An ASCII cursor that replaces the system pointer on the landing and document
// pages. It is a single character: a ^ tipped to point up and left, the way a pointer
// does, which becomes an @ over anything clickable (the same @ the sky line uses for
// the open section) and shrinks a little while pressed. Nothing else: no trail, no
// orbit, no click effect.
//
// The tip of the ^ is the hotspot, so it follows the pointer exactly, with no easing.
// It only appears for pointers that can hover, so touch screens keep their normal
// behaviour.
export default function AsciiCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const root = document.querySelector<HTMLElement>(".void");
    if (!canvas || !ctx || !root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    root.classList.add("has-cursor");

    const pointer = { x: -9999, y: -9999, seen: false, inside: true };
    let hot = 0; // how much it is over something clickable (eased 0 to 1)
    let hotTarget = 0;
    let down = 0; // pressed (eased 0 to 1)
    let downTarget = 0;
    let last = performance.now();
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textAlign = "center";
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.seen = true;
      pointer.inside = true;
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      hotTarget = target?.closest("a, button, input") ? 1 : 0;
    };
    const onDown = () => {
      downTarget = 1;
    };
    const onUp = () => {
      downTarget = 0;
    };
    const onLeave = () => {
      pointer.inside = false;
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (!pointer.seen || !pointer.inside) return;

      const { x, y } = pointer;
      hot += (hotTarget - hot) * (1 - Math.exp(-dt * LEAN_IN));
      down += (downTarget - down) * (1 - Math.exp(-dt * 22));
      const family = getComputedStyle(canvas).fontFamily;

      ctx.save();
      ctx.translate(x, y);
      const scale = 1 - 0.16 * down;
      ctx.scale(scale, scale);
      ctx.fillStyle = "#f2f2f2";
      // A dark halo keeps it readable over bright text.
      ctx.shadowColor = "#060606";
      ctx.shadowBlur = 5;

      if (hot < 0.5) {
        // The ^, drawn so its point sits at the hotspot and tipped about that point.
        ctx.rotate(TILT);
        ctx.font = `600 ${CARET_PX}px ${family}`;
        ctx.textBaseline = "top";
        ctx.fillText("^", 0, -5);
      } else {
        // The @, with its top left near the hotspot.
        ctx.font = `600 ${AT_PX}px ${family}`;
        ctx.textBaseline = "middle";
        ctx.fillText("@", 4, 6);
      }
      ctx.restore();
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="void-cursor" aria-hidden="true" />;
}
