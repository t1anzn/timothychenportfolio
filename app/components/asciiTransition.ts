// An ASCII wipe laid over part of the page while its content changes underneath. A
// diagonal front sweeps across (the way the sky drifts): behind it the page is
// painted out and filled with dim static, and the front itself burns bright. Once
// everything is covered, swap() runs, and a second pass sweeps the same way and
// burns the cover away to show the new content. It draws on its own canvas, so it
// works for a route change (whole viewport) and for a section swap (just the panel).

const RAMP = " .:-=+*#%@";
const PAGE_BG = "#070707"; // the page colour plus its film grain, as in AsciiBlast
const BAND = 0.3; // width of the bright front, as a share of the sweep
const COVER_MS = 440;
const REVEAL_MS = 700;
const COARSE = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;
const CELL_W = COARSE ? 12 : 10;
const CELL_H = COARSE ? 19 : 16;

type Box = { left: number; top: number; width: number; height: number };

export type AsciiTransition = {
  // Lift the cover. Call once the new content is in place.
  reveal: () => void;
};

let active = false;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Cheap integer hash to [0, 1).
const hash = (a: number, b: number, c = 0) => {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Runs the cover pass over box() and then calls swap(). The cover stays until
// reveal() is called on the returned handle. Returns null when a transition is
// already running or motion is reduced; swap has then not been called.
export function asciiTransition(opts: {
  box: () => Box;
  swap: () => void;
}): AsciiTransition | null {
  if (active || prefersReducedMotion()) return null;
  active = true;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, {
    position: "fixed",
    pointerEvents: "none",
    zIndex: "4",
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    active = false;
    return null;
  }

  const box = opts.box();
  canvas.style.left = `${box.left}px`;
  canvas.style.top = `${box.top}px`;
  canvas.style.width = `${box.width}px`;
  canvas.style.height = `${box.height}px`;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.ceil(box.width * dpr);
  canvas.height = Math.ceil(box.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.font = `${CELL_H - 3}px ui-monospace, "Geist Mono", monospace`;
  ctx.textBaseline = "top";

  const cols = Math.ceil(box.width / CELL_W);
  const rows = Math.ceil(box.height / CELL_H);
  // When each cell is reached by the front (0 to 1): a diagonal, roughed up with noise.
  const reach = new Float32Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const diag = (c / cols) * 0.62 + (r / rows) * 0.38;
      reach[r * cols + c] = diag * 0.8 + hash(c, r) * 0.2;
    }
  }

  const SPAN = 1 + BAND;
  const t0 = performance.now();
  let phase: "cover" | "hold" | "reveal" = "cover";
  let revealAt = 0;
  let wantReveal = false;
  let raf = 0;

  const done = () => {
    cancelAnimationFrame(raf);
    canvas.remove();
    active = false;
  };

  const draw = (now: number) => {
    raf = requestAnimationFrame(draw);

    if (phase === "cover" && now - t0 >= COVER_MS) {
      phase = "hold";
      opts.swap();
    }
    if (phase === "hold" && wantReveal) {
      phase = "reveal";
      revealAt = now;
    }

    // p is how far the front has travelled through the grid: 0 to SPAN on each pass.
    let p: number;
    if (phase === "cover") p = easeInOut(Math.min(1, (now - t0) / COVER_MS)) * SPAN;
    else if (phase === "hold") p = SPAN;
    else {
      const u = (now - revealAt) / REVEAL_MS;
      if (u >= 1) return done();
      p = easeInOut(u) * SPAN;
    }
    const revealing = phase === "reveal";
    const frame = Math.floor(now / 70);

    ctx.clearRect(0, 0, box.width, box.height);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const th = reach[r * cols + c];
        // age: how long ago the front passed this cell (negative: not yet).
        const age = p - th;
        const x = c * CELL_W;
        const y = r * CELL_H;
        const flick = hash(c, r, frame);

        if (!revealing) {
          if (age < 0) continue;
          ctx.fillStyle = PAGE_BG;
          ctx.fillRect(x, y, CELL_W + 0.5, CELL_H + 0.5);
          const burn = age < BAND ? 1 - age / BAND : 0;
          const lvl = burn > 0 ? 3 + Math.round(burn * 6 * (0.6 + 0.4 * flick)) : flick > 0.55 ? 1 + Math.floor(flick * 3) : 0;
          if (!lvl) continue;
          ctx.fillStyle = "#f2f2f2";
          ctx.globalAlpha = burn > 0 ? 0.35 + 0.65 * burn : 0.28;
          ctx.fillText(RAMP[Math.min(9, lvl)], x, y);
          ctx.globalAlpha = 1;
        } else {
          // Reveal: cells the front has passed are clear, with a bright trail of
          // characters burning off; cells it has not reached are still covered.
          if (age < 0) {
            ctx.fillStyle = PAGE_BG;
            ctx.fillRect(x, y, CELL_W + 0.5, CELL_H + 0.5);
            if (flick > 0.55) {
              ctx.fillStyle = "#f2f2f2";
              ctx.globalAlpha = 0.28;
              ctx.fillText(RAMP[1 + Math.floor(flick * 3)], x, y);
              ctx.globalAlpha = 1;
            }
          } else if (age < BAND) {
            const burn = 1 - age / BAND;
            const lvl = 2 + Math.round(burn * 6 * (0.6 + 0.4 * flick));
            ctx.fillStyle = "#f2f2f2";
            ctx.globalAlpha = 0.2 + 0.7 * burn;
            ctx.fillText(RAMP[Math.min(9, lvl)], x, y);
            ctx.globalAlpha = 1;
          }
        }
      }
    }
  };
  raf = requestAnimationFrame(draw);

  return {
    reveal: () => {
      wantReveal = true;
    },
  };
}
