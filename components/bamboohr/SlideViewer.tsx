"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Slide = {
  kicker?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  img?: string;
};

/**
 * A native, dependency-free slide viewer for the live training. Keyboard driven
 * (arrows / space / f for fullscreen / Escape to exit), with a real fullscreen
 * present mode. Slides are plain data, so a placeholder deck works today and
 * Jason can swap in exported PNGs (the img field) later, no external embed to
 * fail in the room.
 */
export function SlideViewer({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [fs, setFs] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);
  const n = slides.length;

  const go = useCallback(
    (d: number) => setI((x) => Math.max(0, Math.min(n - 1, x + d))),
    [n]
  );

  const toggleFs = useCallback(() => {
    const el = deckRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Only react when the deck has focus or is presenting fullscreen, so we
      // never hijack Space-to-scroll or a stray "f" elsewhere on the page.
      const deck = deckRef.current;
      const active =
        deck?.contains(document.activeElement) ||
        document.fullscreenElement === deck;
      if (!active) return;
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (["ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFs();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, toggleFs]);

  useEffect(() => {
    function onFs() {
      setFs(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const s = slides[i];

  return (
    <div
      className="deck"
      ref={deckRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Training slides. Focus here, then use the arrow keys."
    >
      <div className="deck-stage" aria-live="polite">
        {s.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.img} alt={s.title} />
        ) : (
          <div className="deck-text">
            {s.kicker && <p className="deck-kicker">{s.kicker}</p>}
            <h3 className="deck-title">{s.title}</h3>
            {s.subtitle && <p className="deck-sub">{s.subtitle}</p>}
            {s.bullets && s.bullets.length > 0 && (
              <ul className="deck-bullets">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="deck-bar">
        <button onClick={() => go(-1)} disabled={i === 0} aria-label="Previous slide">
          Prev
        </button>
        <span>
          Slide {i + 1} of {n}
          <span className="deck-hint" aria-hidden="true">
            {" "}
            · arrows to move, F to present
          </span>
        </span>
        <span className="deck-actions">
          <button
            onClick={toggleFs}
            aria-label={
              fs ? "Exit fullscreen present mode" : "Enter fullscreen present mode"
            }
          >
            {fs ? "Exit" : "Present"}
          </button>
          <button onClick={() => go(1)} disabled={i === n - 1} aria-label="Next slide">
            Next
          </button>
        </span>
      </div>
    </div>
  );
}
