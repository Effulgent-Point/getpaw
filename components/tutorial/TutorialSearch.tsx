"use client";

// Self-contained search: a trigger button plus a modal. Opens on the button,
// Cmd/Ctrl+K, or "/". While open it sets document.body.dataset.tutModal so the
// player's keyboard handler stands down. Results deep-link to /tutorial/<id>?p=.

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchTutorials, type SearchResult } from "@/lib/tutorial/search";

export function TutorialSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const results = useMemo<SearchResult[]>(
    () => (open ? searchTutorials(query) : []),
    [open, query],
  );

  // Reset highlight when the result set changes.
  useEffect(() => {
    setActive(0);
  }, [query]);

  // Global open shortcuts.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Body flag + focus management while open.
  useEffect(() => {
    if (!open) return;
    document.body.dataset.tutModal = "open";
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      delete document.body.dataset.tutModal;
      window.clearTimeout(t);
      // Return focus to the trigger so keyboard users keep their place.
      triggerRef.current?.focus();
    };
  }, [open]);

  function go(r: SearchResult) {
    setOpen(false);
    setQuery("");
    router.push(`/tutorial/${r.trackId}?p=${r.pageIndex}`);
  }

  function onModalKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the tutorial"
        className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-[13px] transition-colors hover:bg-[var(--tut-elev)]"
        style={{ borderColor: "var(--tut-line)", color: "var(--tut-dim)" }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border px-1.5 font-mono text-[10px] sm:inline" style={{ borderColor: "var(--tut-line)" }}>
          /
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search the tutorial"
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          onKeyDown={onModalKey}
        >
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 cursor-default"
            style={{ background: "rgba(8,10,12,0.55)" }}
            onClick={() => setOpen(false)}
            tabIndex={-1}
          />
          <div
            className="relative w-full max-w-xl overflow-hidden rounded-xl border shadow-2xl"
            style={{ background: "var(--tut-term-bg)", borderColor: "var(--tut-line)" }}
          >
            <div className="flex items-center gap-2 border-b px-4 py-3" style={{ borderColor: "var(--tut-line)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "var(--tut-dim)" }}>
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="m20 20-3.6-3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tracks, sections, commands..."
                className="w-full rounded bg-transparent text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--tut-c1)]"
                style={{ color: "var(--tut-fg)" }}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded border px-2 py-0.5 font-mono text-[10px]"
                style={{ borderColor: "var(--tut-line)", color: "var(--tut-dim)" }}
              >
                esc
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto">
              {query.trim().length < 2 ? (
                <p className="px-4 py-6 text-[13px]" style={{ color: "var(--tut-dim)" }}>
                  Type at least two characters. Try &quot;rebase&quot;, &quot;paw check&quot;, or &quot;hook&quot;.
                </p>
              ) : results.length === 0 ? (
                <p className="px-4 py-6 text-[13px]" style={{ color: "var(--tut-dim)" }}>
                  No matches for &quot;{query}&quot;.
                </p>
              ) : (
                <ul>
                  {results.map((r, i) => (
                    <li key={`${r.trackId}-${r.pageIndex}`}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(r)}
                        className="flex w-full flex-col gap-0.5 px-4 py-2.5 text-left"
                        style={{ background: i === active ? "var(--tut-elev)" : "transparent" }}
                      >
                        <span className="flex items-center gap-2 text-[14px]" style={{ color: "var(--tut-fg)" }}>
                          <span aria-hidden="true">{r.trackIcon}</span>
                          <span className="font-semibold">{r.title}</span>
                          <span className="tut-eyebrow ml-auto shrink-0">{r.trackTitle}</span>
                        </span>
                        {r.snippet && (
                          <span className="line-clamp-1 font-mono text-[11.5px]" style={{ color: "var(--tut-dim)" }}>
                            {r.snippet}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
