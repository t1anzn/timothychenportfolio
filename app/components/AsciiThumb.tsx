"use client";

import { useEffect, useRef, useState } from "react";

const CELL_W = 4;
const CELL_H = 6; // tall cells, like the rest of the site's grid
const RAMP = " .:-=+*#%@";

// A project's thumbnail, shown as ASCII at rest: the image is shrunk to a grid, each
// cell is given a character by how bright it is, and the result is drawn in white on
// the black. Hovering the card (the CSS in landing.css does this) fades the real image
// in over it. If the image cannot be read (the image host does not allow this site to
// read its pixels, as on a preview URL it has not been told about), the image is shown
// in greyscale instead. With no image at all it is an empty frame with the glyph in it.
//
// The <img> shown to the visitor is a plain image request, which needs no permission, so
// it always loads. Only the separate request used to build the ASCII asks for the pixels,
// and that is the one that can be refused.
export default function AsciiThumb({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [plain, setPlain] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!src || !canvas) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onerror = () => setPlain(true);
    img.onload = () => {
      try {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const cols = Math.max(1, Math.floor(w / CELL_W));
        const rows = Math.max(1, Math.floor(h / CELL_H));

        // Shrink the image to one pixel per cell and read the brightness back.
        const small = document.createElement("canvas");
        small.width = cols;
        small.height = rows;
        const sctx = small.getContext("2d", { willReadFrequently: true });
        if (!sctx) throw new Error("no 2d context");
        sctx.drawImage(img, 0, 0, cols, rows);
        const { data } = sctx.getImageData(0, 0, cols, rows);

        const lum: number[] = [];
        for (let i = 0; i < data.length; i += 4) {
          lum.push((0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255);
        }
        // Stretch the range so a dim or flat image still uses the whole ramp.
        const sorted = [...lum].sort((a, b) => a - b);
        const lo = sorted[Math.floor(sorted.length * 0.03)];
        const hi = sorted[Math.floor(sorted.length * 0.97)];
        const span = Math.max(hi - lo, 0.05);

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no 2d context");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.font = `${CELL_H}px ${getComputedStyle(canvas).fontFamily}`;
        ctx.textBaseline = "top";
        ctx.fillStyle = "#f2f2f2";
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const v = Math.min(1, Math.max(0, (lum[r * cols + c] - lo) / span)) ** 0.9;
            const level = Math.round(v * (RAMP.length - 1));
            if (!level) continue;
            ctx.globalAlpha = 0.35 + 0.65 * v;
            ctx.fillText(RAMP[level], c * CELL_W, r * CELL_H);
          }
        }
      } catch {
        setPlain(true);
      }
    };
    img.src = src;
  }, [src]);

  if (!src) {
    return (
      <div className="p-thumb p-thumb-empty" aria-hidden="true">
        <span lang="zh-Hans">天</span>
      </div>
    );
  }

  return (
    <div className={className ? `p-thumb ${className}` : "p-thumb"} data-plain={plain}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
