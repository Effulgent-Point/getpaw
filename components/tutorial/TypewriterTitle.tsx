"use client";

// Types the title out once (first visit only, honoring reduced-motion),
// mirroring engine.py's typewriter effect for pages flagged typewriter_title.

import { useEffect, useState } from "react";

export function TypewriterTitle({
  text,
  active,
}: {
  text: string;
  active: boolean;
}) {
  const [count, setCount] = useState(active ? 0 : text.length);

  useEffect(() => {
    if (!active) {
      setCount(text.length);
      return;
    }
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(id);
    }, 34);
    return () => window.clearInterval(id);
  }, [text, active]);

  const typing = count < text.length;
  return (
    <span aria-label={text}>
      <span aria-hidden={typing || undefined}>{text.slice(0, count)}</span>
      {typing && (
        <span className="tut-caret" aria-hidden="true">
          &#9614;
        </span>
      )}
    </span>
  );
}
