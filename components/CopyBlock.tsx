"use client";

import { useRef, useState } from "react";

// Copyable command block styled in the light-only Optical Bench palette (the
// tutorial's CopyButton is scoped to the tutorial's own --tut-* tokens, so it
// cannot be reused on the sibling pages). Pass `prose` for multi-line prose
// (e.g. a paste-able prompt) so long lines wrap instead of scrolling sideways.
export function CopyBlock({ code, prose = false }: { code: string; prose?: boolean }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(code);
      ok = true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(ta);
    }
    // Only confirm when the copy actually succeeded, so the button never lies.
    if (!ok) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="relative rounded-lg border border-line bg-card">
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        className="absolute right-2 top-2 rounded border border-line bg-paper px-2.5 py-1 font-mono text-[11px] text-mut transition-colors hover:text-ink"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      {prose ? (
        <p className="whitespace-pre-wrap break-words p-4 pr-20 text-[14.5px] leading-relaxed text-ink">
          {code}
        </p>
      ) : (
        <pre className="overflow-x-auto p-4 pr-20 font-mono text-[13px] leading-relaxed text-ink">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
