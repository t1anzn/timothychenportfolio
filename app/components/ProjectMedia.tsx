"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type MediaItem = {
  key: string;
  kind: "image" | "video";
  src: string; // what the grid shows (images) or plays (videos)
  full?: string; // the large version an image opens at
  alt: string;
  caption?: string;
};

// A project's screenshots and videos. Images sit in the page as fixed-size frames;
// clicking one opens it large in a viewer over the page, not on the image host. In the
// viewer, Escape, a click outside the image, or the close mark closes it, and the arrow
// keys (or the < > buttons) move between the project's images. Videos play in place.
export default function ProjectMedia({ items }: { items: MediaItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  // The images, in order, so the viewer steps through them and skips videos.
  const images = items.map((item, index) => ({ item, index })).filter((x) => x.item.kind === "image");
  const position = images.findIndex((x) => x.index === open);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus({ preventScroll: true });
  }, []);

  const step = useCallback(
    (by: number) => {
      if (position < 0 || images.length < 2) return;
      setOpen(images[(position + by + images.length) % images.length].index);
    },
    [position, images]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      } else if (e.key === "ArrowRight") {
        step(1);
      } else if (e.key === "ArrowLeft") {
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    // The page behind does not scroll while the viewer is open.
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previous;
    };
  }, [open, close, step]);

  const current = open !== null ? items[open] : null;
  const host = typeof document !== "undefined" ? document.querySelector(".void") ?? document.body : null;

  return (
    <>
      <section className="doc-media" aria-label="Screenshots and media">
        {items.map((item, index) => (
          <figure key={item.key}>
            {item.kind === "video" ? (
              <div className="doc-shot">
                <video controls preload="metadata">
                  <source src={item.src} />
                  {item.alt}
                </video>
              </div>
            ) : (
              <button
                type="button"
                className="doc-shot"
                aria-label={`Open larger: ${item.alt}`}
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setOpen(index);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt="" loading="lazy" />
              </button>
            )}
            {item.caption ? <figcaption className="void-mono">{item.caption}</figcaption> : null}
          </figure>
        ))}
      </section>

      {current && host
        ? createPortal(
            <div className="lightbox" role="dialog" aria-modal="true" aria-label={current.alt} onClick={close}>
              <button
                type="button"
                ref={closeButton}
                className="void-close"
                aria-label="Close image"
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
              >
                <span className="void-close-art" aria-hidden="true">
                  <span className="void-close-dots">. . . . . </span>
                  <span className="void-close-core" />
                  <span className="void-close-dots">. . . . . </span>
                </span>
              </button>

              <figure onClick={(e) => e.stopPropagation()}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={current.full ?? current.src} alt={current.alt} decoding="async" />
                {current.caption ? <figcaption className="void-mono">{current.caption}</figcaption> : null}
              </figure>

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="lightbox-nav lightbox-prev"
                    aria-label="Previous image"
                    onClick={(e) => {
                      e.stopPropagation();
                      step(-1);
                    }}
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    className="lightbox-nav lightbox-next"
                    aria-label="Next image"
                    onClick={(e) => {
                      e.stopPropagation();
                      step(1);
                    }}
                  >
                    &gt;
                  </button>
                  <p className="lightbox-count void-mono" aria-live="polite">
                    {position + 1} / {images.length}
                  </p>
                </>
              ) : null}
            </div>,
            host
          )
        : null}
    </>
  );
}
