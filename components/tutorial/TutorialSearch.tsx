"use client";

// Self-contained search: a trigger button plus a modal dialog. Opens on the
// button, Cmd/Ctrl+K, or "/" (the "/" accelerator is active only while focus is
// inside the tutorial region, per WCAG 2.1.4). The search index is loaded
// lazily on first open so it never ships in the initial bundle. While open the
// dialog is rendered in a portal, the page chrome is made `inert`, and Tab is
// trapped inside the panel. Results deep-link to /tutorial/<id>?p=.

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/lib/tutorial/search";

export function TutorialSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchFn = useRef<((q: string) => SearchResult[]) | null>(null);
  const listboxId = useId();

  const expanded = query.trim().length >= 2 && results.length > 0;

  // Lazy-load the search module (and its index) the first time we need it, then
  // run the query. Keeps the corpus out of every tutorial page's bundle.
  const runSearch = useCallback(async (q: string) => {
    if (!searchFn.current) {
      const mod = await import("@/lib/tutorial/search");
      searchFn.current = mod.searchTutorials;
    }
    setResults(searchFn.current(q));
  }, []);

  // Recompute results as the query changes while open.
  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    void (async () => {
      if (!searchFn.current) {
        const mod = await import("@/lib/tutorial/search");
        searchFn.current = mod.searchTutorials;
      }
      if (!cancelled) setResults(searchFn.current(query));
    })();
    return () => {
      cancelled = true;
    };
  }, [open, query]);

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
        openModal();
      } else if (e.key === "/" && !typing && !open) {
        // Single-character accelerator: only active when focus is inside the
        // tutorial region, so a stray "/" elsewhere can't pop the dialog.
        const inRegion = document.activeElement?.closest(".tut-root");
        if (inRegion) {
          e.preventDefault();
          openModal();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function openModal() {
    setOpen(true);
    // Warm the index so the first keystroke is instant.
    void runSearch("");
  }

  // While open: mark the page chrome inert (out of tab order + AT tree) and
  // focus the input. On close, restore inert and return focus to the trigger.
  useEffect(() => {
    if (!open) return;
    document.body.dataset.tutModal = "open";
    const chrome = Array.from(
      document.querySelectorAll("header, main, footer"),
    ) as HTMLElement[];
    for (const el of chrome) el.setAttribute("inert", "");
    const t = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => {
      for (const el of chrome) el.removeAttribute("inert");
      delete document.body.dataset.tutModal;
      window.clearTimeout(t);
      // Restore inert first (above) so the trigger can take focus again.
      triggerRef.current?.focus();
    };
  }, [open]);

  function go(r: SearchResult) {
    setOpen(false);
    setQuery("");
    router.push(`/tutorial/${r.trackId}?p=${r.pageIndex}`);
  }

  function trapTab(e: React.KeyboardEvent) {
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const activeEl = document.activeElement;
    if (e.shiftKey) {
      if (activeEl === first || !panel.contains(activeEl)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function onModalKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      trapTab(e);
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

  const showResults = query.trim().length >= 2 && results.length > 0;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openModal}
        aria-label="Search the tutorial"
        aria-haspopup="dialog"
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

      {open &&
        typeof document !== "undefined" &&
        createPortal(
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
              ref={panelRef}
              className="tut-root relative w-full max-w-xl overflow-hidden rounded-xl border shadow-2xl"
              data-theme={
                document.querySelector(".tut-root")?.getAttribute("data-theme") ??
                "light"
              }
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
                  role="combobox"
                  aria-expanded={expanded}
                  aria-controls={listboxId}
                  aria-autocomplete="list"
                  aria-activedescendant={
                    showResults && results[active] ? `${listboxId}-opt-${active}` : undefined
                  }
                  aria-label="Search the tutorial"
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

              <div className="sr-only" role="status" aria-live="polite">
                {query.trim().length < 2
                  ? ""
                  : `${results.length} ${results.length === 1 ? "result" : "results"}`}
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
                  <ul id={listboxId} role="listbox" aria-label="Search results">
                    {results.map((r, i) => (
                      <li key={`${r.trackId}-${r.pageIndex}`}>
                        <button
                          type="button"
                          id={`${listboxId}-opt-${i}`}
                          role="option"
                          aria-selected={i === active}
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
          </div>,
          document.body,
        )}
    </>
  );
}
