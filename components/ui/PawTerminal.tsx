"use client";

import { useEffect, useState } from "react";

type Kind = "cmd" | "dim" | "ok" | "warn" | "bold";
const LINES: { t: string; c: Kind }[] = [
  { t: "$ paw check", c: "cmd" },
  { t: "quality gate: code-reviewer, bug-auditor, security-reviewer", c: "dim" },
  { t: "  code-reviewer       clean", c: "ok" },
  { t: "  bug-auditor         1 finding: unguarded null in parse()", c: "warn" },
  { t: "  security-reviewer   clean", c: "ok" },
  { t: "", c: "dim" },
  { t: "gate: REVIEW  (fix 1 finding before you merge)", c: "bold" },
];

const A11Y =
  "A paw check run: three reviewers report, one finding, gate result REVIEW.";

export function PawTerminal() {
  const [n, setN] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }, []);

  useEffect(() => {
    if (reduce) {
      setN(LINES.length);
      return;
    }
    if (n >= LINES.length) return;
    const id = setTimeout(() => setN((x) => x + 1), n === 0 ? 350 : 520);
    return () => clearTimeout(id);
  }, [n, reduce]);

  return (
    <div className="pawterm" role="img" aria-label={A11Y}>
      <div className="pawterm-bar" aria-hidden="true">
        <span className="pawterm-dot" />
        <span className="pawterm-dot" />
        <span className="pawterm-dot" />
        <span className="pawterm-title">paw</span>
      </div>
      <pre className="pawterm-body" aria-hidden="true">
        {LINES.slice(0, n).map((l, i) => (
          <div key={i} className={`pt-line pt-${l.c}`}>
            {l.t || " "}
            {i === n - 1 && !reduce && n < LINES.length && (
              <span className="pt-caret">▊</span>
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}
