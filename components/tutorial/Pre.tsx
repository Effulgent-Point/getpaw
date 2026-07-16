// Renders rows of styled segments inside a <pre>. Every segment is an escaped
// React text node (no dangerouslySetInnerHTML), so ASCII art and body copy from
// content.py can never inject markup. Whitespace is preserved by .tut-pre.

import type { Segment } from "@/lib/tutorial/render";

export function Pre({
  rows,
  className = "",
}: {
  rows: Segment[][];
  className?: string;
}) {
  return (
    <pre className={`tut-pre ${className}`.trim()}>
      {rows.map((segments, i) => (
        <span key={i}>
          {segments.map((seg, j) =>
            seg.cls ? (
              <span key={j} className={seg.cls}>
                {seg.text}
              </span>
            ) : (
              <span key={j}>{seg.text}</span>
            ),
          )}
          {i < rows.length - 1 ? "\n" : ""}
        </span>
      ))}
    </pre>
  );
}
