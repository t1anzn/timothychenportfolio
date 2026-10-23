"use client";

import { useEffect, useRef } from "react";

const GLYPH = "天";
const RAMP = " .:-=+*#%@";
const LAYERS = 9; // extrusion slices, so the glyph reads as a slab when edge-on
const DEPTH = 0.22; // half-thickness in glyph units
const SAMPLE = 180; // offscreen sampling resolution
const CELL_W = 7;
const CELL_H = 11; // CELL_H / CELL_W compensates for tall monospace cells
const MAX_YAW = 1.25; // the furthest (radians) it will turn sideways to face the cursor
const MAX_PITCH = 0.85; // and up or down
const REST_YAW = -0.3; // the still pose (reduced motion)
const SPIN_SPEED = 0.45; // radians per second the glyph turns when nothing is near
const SPIN_PITCH = 0.14; // the slight tilt it keeps while spinning
const LOOK_RANGE = 170; // px beyond the glyph's own size within which it faces the cursor
const LOOK_BAND = 50; // px at the outer edge of that range over which it eases from spinning to facing
const LOOK_IN = 3.2; // how fast it turns to look at the cursor (per second)
const LOOK_OUT = 1.4; // how fast it lets go and resumes spinning (per second)
const GLYPH_BOX = 0.62; // glyph size as a share of the shorter viewport side
const GLYPH_MAX_PX = 832;
// Scatter: while the cursor is close to the glyph (but not on it), the glyph's own
// characters near it are pushed off their places, spreading out around the cursor
// and jittering as they go, and settle back into place when it moves away.
// Nothing is created: it is the same characters, displaced and returning. It works
// from any side. The cursor counts as on the glyph only when it is actually over
// its characters (within SCATTER_ON_GLYPH of one), and then nothing happens.
const SCATTER_ON_GLYPH = 12; // px from the nearest character within which the cursor is on the glyph
const SCATTER_OPEN = 14; // px over which the effect opens up once the cursor is off the glyph
const SCATTER_FULL = 50; // px from the glyph where the effect is at full strength
const SCATTER_END = 190; // px from the glyph beyond which there is no effect
const SCATTER_REACH = 190; // px around the cursor within which characters are displaced
const SCATTER_PULL = 7; // grid columns a character leans toward the cursor at full strength
const SCATTER_JITTER = 10; // grid columns of random wandering around that: how widely they spread
const SCATTER_DIM = 0.3; // how much displaced characters dim (0 to 1)
const SCATTER_OUT = 6; // how fast characters move out of place (per second)
const SCATTER_BACK = 2.2; // how fast they settle back (per second): slower, so it reads as reforming

// t: when this point lets go (top of the glyph first).
// lift and drift: how far it rises and wanders once released.
// ox, oy: how far (in grid cells) the cursor has displaced this point from its place.
// ang and amp: this point's own random direction and strength of wandering.
type Point = {
  x: number;
  y: number;
  z: number;
  t: number;
  lift: number;
  drift: number;
  ox: number;
  oy: number;
  ang: number;
  amp: number;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
// An angle brought into -PI to PI, so differences between angles take the short way round.
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

// Samples the glyph into a point cloud and extrudes it. It turns slowly around
// its vertical axis by default; as the cursor comes near it stops spinning and
// turns to look at the cursor, and when the cursor leaves it picks the spin up
// again. It is drawn as depth-shaded ASCII on a full-viewport canvas. When a section opens (--p goes 0 to 1) the cloud comes
// apart top-first: points rise, thin out to the dots the star field uses, and
// fade, so the glyph literally becomes sky. Closing runs it back.
//
// The cursor also scatters the glyph's own characters, a little, when it is close
// to the glyph but not on it. They are pushed off their places toward the cursor,
// jitter while it stays near, and spring back to exactly where they were when it
// moves away.
function sampleGlyph(): Point[] {
  const off = document.createElement("canvas");
  off.width = off.height = SAMPLE;
  const c = off.getContext("2d", { willReadFrequently: true });
  if (!c) return [];

  c.fillStyle = "#fff";
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.font = `600 ${SAMPLE * 0.92}px "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", "Noto Sans SC", sans-serif`;
  c.fillText(GLYPH, SAMPLE / 2, SAMPLE / 2 + SAMPLE * 0.04);

  const { data } = c.getImageData(0, 0, SAMPLE, SAMPLE);
  const pts: Point[] = [];
  for (let py = 0; py < SAMPLE; py += 2) {
    for (let px = 0; px < SAMPLE; px += 2) {
      if (data[(py * SAMPLE + px) * 4 + 3] < 128) continue;
      const x = (px / SAMPLE - 0.5) * 2;
      const y = (py / SAMPLE - 0.5) * 2;
      const t = 0.5 * Math.random() + 0.5 * (py / SAMPLE);
      for (let l = 0; l < LAYERS; l++) {
        pts.push({
          x,
          y,
          z: (l / (LAYERS - 1) - 0.5) * 2 * DEPTH,
          t,
          lift: 0.6 + Math.random() * 2.4,
          drift: Math.random() - 0.5,
          ox: 0,
          oy: 0,
          ang: Math.random() * Math.PI * 2,
          amp: 0.25 + Math.random() * 1.35,
        });
      }
    }
  }
  return pts;
}

export default function AsciiGlyph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const points = sampleGlyph();
    if (!points.length) return;

    // One fill style per brightness step, so draw calls don't rebuild strings.
    const shades = RAMP.length - 1;
    const styles = Array.from(
      { length: shades },
      (_, i) => `rgba(242, 242, 242, ${(0.28 + 0.72 * ((i + 1) / shades)).toFixed(2)})`
    );

    let cols = 0;
    let rows = 0;
    let zbuf = new Float32Array(0);
    let shade = new Uint8Array(0);
    let raf = 0;
    let last = performance.now();
    let dt = 0.016;
    let cleared = false;
    const root = document.querySelector<HTMLElement>(".void");
    const readProgress = () =>
      reduce || !root ? 0 : parseFloat(root.style.getPropertyValue("--p")) || 0;
    // Overall glyph brightness (--g), so it can be dimmed behind content.
    const readGlow = () => {
      const g = root ? parseFloat(root.style.getPropertyValue("--g")) : NaN;
      return Number.isNaN(g) ? 1 : g;
    };
    const pose = { yaw: REST_YAW, pitch: 0 };
    // Spinning: spin is the angle it has turned to, and look is how much it is
    // looking at the cursor instead (0 spinning freely, 1 facing the cursor).
    let spin = REST_YAW;
    let look = 0;
    // Where the glyph is on screen, in px, so the cursor's gaze is measured from its centre.
    const geom = { x: 0, y: 0, r: 1 };

    // The cursor, eased so the scatter follows it smoothly. gate is how strongly
    // the scatter may act: 0 while the cursor is on the glyph or far from it, up to
    // 1 in the band just outside the glyph. nearest is how far (px) the cursor was
    // from the closest character of the glyph on the previous frame, from whichever
    // side it is on.
    const cursor = { x: -9999, y: -9999, active: false, gate: 0 };
    const cursorRaw = { x: -9999, y: -9999 };
    let nearest = Infinity;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${CELL_H - 1}px ${getComputedStyle(canvas).fontFamily}`;
      ctx.textBaseline = "top";
      cols = Math.floor(w / CELL_W);
      rows = Math.floor(h / CELL_H);
      zbuf = new Float32Array(cols * rows);
      shade = new Uint8Array(cols * rows);
      cleared = false;
    };

    const render = (p: number) => {
      zbuf.fill(-Infinity);
      shade.fill(0);

      const cos = Math.cos(pose.yaw);
      const sin = Math.sin(pose.yaw);
      const ct = Math.cos(pose.pitch);
      const st = Math.sin(pose.pitch);
      const w = cols * CELL_W;
      const h = rows * CELL_H;
      const scale = Math.min(Math.min(w, h) * GLYPH_BOX, GLYPH_MAX_PX) * 0.5 * 0.92;
      const cx = cols / 2;
      const cy = rows / 2 - 1; // sits a little above centre, clear of the dock below
      geom.x = cx * CELL_W;
      geom.y = cy * CELL_H;
      geom.r = scale;

      const gate = cursor.gate;
      const now = performance.now() / 1000;
      // Characters move out of place briskly and settle back more slowly.
      const outRate = 1 - Math.exp(-dt * SCATTER_OUT);
      const backRate = 1 - Math.exp(-dt * SCATTER_BACK);
      let closest = Infinity;

      for (const pt of points) {
        // Release: 0 while held, 1 once fully dissolved.
        const u = Math.min(1, Math.max(0, (p - 0.04 - pt.t * 0.5) / 0.45));
        if (u >= 0.97) continue;

        // Rotate around Y, then tilt around X.
        const x1 = pt.x * cos + pt.z * sin;
        const z1 = -pt.x * sin + pt.z * cos;
        let y2 = pt.y * ct - z1 * st;
        const z2 = pt.y * st + z1 * ct;

        // Dissolve in screen space, so it always rises toward the top.
        const dx = x1 + pt.drift * u * 0.9;
        if (u > 0) y2 -= u ** 1.6 * pt.lift;

        const persp = 1 / (1 - z2 * 0.35);
        let fc = cx + (dx * scale * persp) / CELL_W;
        let fr = cy + (y2 * scale * persp) / CELL_H;

        // Where this character is relative to the cursor, in px.
        let tx = 0;
        let ty = 0;
        let dimmed = 0;
        if (cursor.active || pt.ox !== 0 || pt.oy !== 0) {
          const ox = cursor.x - fc * CELL_W;
          const oy = cursor.y - fr * CELL_H;
          const d = Math.sqrt(ox * ox + oy * oy) || 1;
          if (cursor.active && d < closest) closest = d;

          // Where the cursor wants this character: toward it, plus a wander of its
          // own that keeps turning while the cursor stays near, so the scatter is
          // alive and constant. Strongest next to the cursor, none at the edge of
          // its reach.
          if (cursor.active && gate > 0.001) {
            const f = gate * (1 - clamp(d / SCATTER_REACH, 0, 1)) ** 1.2;
            if (f > 0) {
              const a = pt.ang + now * (0.7 + pt.amp * 0.5);
              tx = f * ((ox / d) * SCATTER_PULL + Math.cos(a) * SCATTER_JITTER * pt.amp);
              ty = f * ((oy / d) * SCATTER_PULL * 0.6 + Math.sin(a) * SCATTER_JITTER * 0.6 * pt.amp);
              dimmed = f;
            }
          }
        }

        // Spring toward that place: briskly out, slowly back. Once the cursor has
        // gone the target is zero, so every character returns to where it was.
        const outward = Math.abs(tx) + Math.abs(ty) > Math.abs(pt.ox) + Math.abs(pt.oy);
        const rate = outward ? outRate : backRate;
        pt.ox += (tx - pt.ox) * rate;
        pt.oy += (ty - pt.oy) * rate;
        if (Math.abs(pt.ox) < 0.003 && Math.abs(pt.oy) < 0.003 && tx === 0 && ty === 0) {
          pt.ox = 0;
          pt.oy = 0;
        }
        fc += pt.ox;
        fr += pt.oy;

        const col = Math.floor(fc);
        const row = Math.floor(fr);
        if (col < 0 || col >= cols || row < 0 || row >= rows) continue;

        const i = row * cols + col;
        if (z2 <= zbuf[i]) continue;
        zbuf[i] = z2;

        // Nearer points are brighter, and faces turned toward the viewer
        // (|cos| near 1) are brighter than the slab edge. Dissolving points
        // dim toward the faint dots the star field uses; displaced ones dim a little.
        const b =
          (0.3 + 0.45 * (z2 * 0.5 + 0.5) + 0.25 * Math.abs(cos)) *
          (1 - u * 0.85) *
          (1 - SCATTER_DIM * dimmed);
        shade[i] = Math.max(1, Math.min(shades, Math.round(b * shades)));
      }
      nearest = closest;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = readGlow();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const s = shade[r * cols + c];
          if (!s) continue;
          ctx.fillStyle = styles[s - 1];
          ctx.fillText(RAMP[s], c * CELL_W, r * CELL_H);
        }
      }
    };

    const tick = (now: number) => {
      dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // The pose is worked out after the cursor has been eased, below.

      // Ease the cursor, and work out how strongly the scatter may act. It is
      // measured from the nearest character, so it is the same from every side of
      // the glyph. Over the glyph itself the gate is closed; just off it the gate
      // opens, is full by SCATTER_FULL, and fades out again by SCATTER_END.
      const follow = 1 - Math.exp(-dt * 18);
      cursor.x += (cursorRaw.x - cursor.x) * follow;
      cursor.y += (cursorRaw.y - cursor.y) * follow;
      let wantGate = 0;
      if (cursor.active && nearest < Infinity && nearest > SCATTER_ON_GLYPH) {
        const opening = clamp((nearest - SCATTER_ON_GLYPH) / SCATTER_OPEN, 0, 1);
        const closing = clamp(1 - (nearest - SCATTER_FULL) / (SCATTER_END - SCATTER_FULL), 0, 1);
        wantGate = opening * closing;
      }
      cursor.gate += (wantGate - cursor.gate) * (1 - Math.exp(-dt * 8));

      // Turning. With nothing near, the glyph spins. As the cursor comes closer it
      // slows to a stop and turns to face the cursor (judged from the glyph's own
      // centre, so it looks wherever the cursor is), and when the cursor leaves it
      // picks the spin up again from where it stopped.
      // Fully facing the cursor anywhere inside LOOK_RANGE of the glyph, easing in over
      // the outer LOOK_BAND so it does not snap from spinning to facing. The range is
      // measured from the glyph's centre and nominal size, not from its characters, so
      // it does not shrink when the glyph happens to be turned edge-on.
      const fromCentre = Math.hypot(cursor.x - geom.x, cursor.y - geom.y);
      const lookTarget = cursor.active
        ? clamp((geom.r + LOOK_RANGE - fromCentre) / LOOK_BAND, 0, 1)
        : 0;
      look += (lookTarget - look) * (1 - Math.exp(-dt * (lookTarget > look ? LOOK_IN : LOOK_OUT)));
      spin = wrapAngle(spin + dt * SPIN_SPEED * (1 - look));
      // Aim the front face at the cursor. The cursor is treated as sitting a little in
      // front of the glyph (gaze px away), so the glyph turns by the angle between
      // straight ahead and the direction from its centre to the cursor, sideways and
      // up or down. A turn to +yaw swings the front face to the right on screen, and
      // a turn to +pitch tips it upward, hence the minus sign on the vertical.
      const gaze = geom.r * 1.3;
      const lookYaw = clamp(Math.atan2(cursor.x - geom.x, gaze), -MAX_YAW, MAX_YAW);
      const lookPitch = clamp(-Math.atan2(cursor.y - geom.y, gaze), -MAX_PITCH, MAX_PITCH);
      // Blend by the shortest way round, so there is no swing when it hands over.
      pose.yaw = lookYaw + (1 - look) * wrapAngle(spin - lookYaw);
      pose.pitch = look * lookPitch + (1 - look) * SPIN_PITCH;

      // Once fully dissolved there is nothing left to draw.
      const p = readProgress();
      if (p < 0.995) {
        render(p);
        cleared = false;
      } else if (!cleared) {
        render(1);
        cleared = true;
      }
      raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      if (!cursor.active && cursor.x < -9000) {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
      }
      cursorRaw.x = e.clientX;
      cursorRaw.y = e.clientY;
      cursor.active = true;
    };

    const onLeave = () => {
      cursor.active = false;
    };

    const onResize = () => {
      resize();
      if (reduce) render(0);
    };

    resize();
    if (reduce) {
      pose.yaw = REST_YAW;
      document.fonts.ready.then(() => {
        resize();
        render(0);
      });
    } else {
      raf = requestAnimationFrame(tick);
      window.addEventListener("pointermove", onPointer);
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="void-ascii" aria-hidden="true" />;
}
