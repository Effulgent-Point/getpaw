"use client";

// The interactive player for one track: page state, keyboard navigation,
// section sidebar, progress, deep-linkable ?p=, and a completion panel.
// Mirrors engine.py's Navigator + render_footer + render_finish_screen.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { TRACK_IDS, getTrack, type Track } from "@/lib/tutorial/data";
import { recordVisit } from "@/lib/tutorial/progress";
import { ThemeToggle } from "./ThemeToggle";
import { TutorialPageView } from "./TutorialPageView";
import { TutorialSearch } from "./TutorialSearch";
import { TutorialSidebar } from "./TutorialSidebar";

export function TutorialPlayer({ track }: { track: Track }) {
  const router = useRouter();
  const total = track.pages.length;

  const [page, setPage] = useState(0);
  const [finished, setFinished] = useState(false);
  const visited = useRef<Set<number>>(new Set());
  const navigated = useRef(false); // true once the reader moves pages (client-side)
  const mainRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const sectionStarts = useMemo(() => {
    const map: Record<string, number> = {};
    track.pages.forEach((p, i) => {
      if (!(p.section in map)) map[p.section] = i;
    });
    return map;
  }, [track]);

  const current = track.pages[page];
  // Only animate the title when the reader navigates to a first-visit page.
  // The SSR / deep-linked landing page always shows its full title.
  const animateTitle = navigated.current && !visited.current.has(page);

  // Deep link: honor ?p= on mount (start at 0 for clean hydration, then jump).
  useEffect(() => {
    try {
      const raw = new URLSearchParams(window.location.search).get("p");
      if (raw !== null) {
        const n = Number.parseInt(raw, 10);
        if (Number.isInteger(n) && n >= 0 && n < total) setPage(n);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id]);

  // Record progress, sync the URL, mark visited, scroll into view on change.
  useEffect(() => {
    visited.current.add(page);
    recordVisit(track.id, page, total);
    try {
      const url = page > 0 ? `?p=${page}` : window.location.pathname;
      window.history.replaceState(null, "", url);
    } catch {
      /* ignore */
    }
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page, track.id, total]);

  function goNext() {
    if (finished) return;
    navigated.current = true;
    if (page < total - 1) setPage(page + 1);
    else setFinished(true);
  }
  function goPrev() {
    navigated.current = true;
    if (finished) {
      setFinished(false);
      return;
    }
    if (page > 0) setPage(page - 1);
  }
  function jumpTo(p: number) {
    navigated.current = true;
    setFinished(false);
    setPage(Math.max(0, Math.min(total - 1, p)));
  }
  function skipSection() {
    navigated.current = true;
    const idx = track.sections.indexOf(current.section);
    if (idx >= 0 && idx < track.sections.length - 1) {
      jumpTo(sectionStarts[track.sections[idx + 1]]);
    } else {
      setFinished(true);
    }
  }

  // Keyboard navigation (stands down while the search modal or an input is focused).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.body.dataset.tutModal === "open") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

      if (e.key === "Escape") {
        e.preventDefault();
        router.push("/tutorial");
        return;
      }
      if (finished) {
        if (e.key === "ArrowLeft" || e.key === "p") {
          e.preventDefault();
          goPrev();
        }
        return;
      }
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "n":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "p":
          e.preventDefault();
          goPrev();
          break;
        case "s":
          e.preventDefault();
          skipSection();
          break;
        case "Home":
          e.preventDefault();
          jumpTo(0);
          break;
        case "End":
          e.preventDefault();
          jumpTo(total - 1);
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const pct = finished ? 100 : Math.round(((page + 1) / total) * 100);
  const nextIdx = TRACK_IDS.indexOf(track.id) + 1;
  const nextTrack = nextIdx < TRACK_IDS.length ? getTrack(TRACK_IDS[nextIdx]) : undefined;

  return (
    <div className="wrap py-8 lg:py-12">
      {/* top bar */}
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/tutorial"
          className="inline-flex items-center gap-1.5 text-[13px] no-underline transition-colors hover:opacity-80"
          style={{ color: "var(--tut-dim)" }}
        >
          <span aria-hidden="true">←</span> All tracks
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <TutorialSearch />
          <ThemeToggle />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[196px_minmax(0,1fr)] lg:gap-10">
        {/* sidebar */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-lg" aria-hidden="true">
              {track.icon}
            </span>
            <h1 className="font-display text-[19px] font-extrabold leading-tight" style={{ color: "var(--tut-fg)" }}>
              {track.title}
            </h1>
          </div>
          <p className="tut-eyebrow mb-4">
            {finished ? "Complete" : `Page ${page + 1} of ${total}`} · {track.time}
          </p>
          <div className="mb-5 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--tut-line)" }}>
            <div
              className="h-full rounded-full transition-[width] duration-300"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg,#3b528b,#21908c,#5dc863)",
              }}
            />
          </div>
          <TutorialSidebar
            sections={track.sections}
            sectionStarts={sectionStarts}
            currentSection={current.section}
            currentPage={page}
            onJump={jumpTo}
          />
        </aside>

        {/* content */}
        <div ref={mainRef} className="min-w-0 scroll-mt-6">
          {finished ? (
            <FinishPanel track={track} nextTrack={nextTrack} onReview={() => jumpTo(total - 1)} />
          ) : (
            <TutorialPageView key={page} page={current} track={track} animateTitle={animateTitle} />
          )}

          {/* footer nav */}
          <div className="mt-8 flex items-center gap-3 border-t pt-5" style={{ borderColor: "var(--tut-line)" }}>
            <button
              type="button"
              onClick={goPrev}
              disabled={!finished && page === 0}
              className="inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-[14px] transition-colors enabled:hover:bg-[var(--tut-elev)] disabled:opacity-40"
              style={{ borderColor: "var(--tut-line)", color: "var(--tut-fg)" }}
            >
              <span aria-hidden="true">←</span> Back
            </button>

            <p className="mx-auto font-mono text-[12px]" style={{ color: "var(--tut-dim)" }}>
              {finished ? `${total} / ${total}` : `${page + 1} / ${total}`}
            </p>

            {finished ? (
              <Link
                href="/tutorial"
                className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-[14px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
                style={{ background: "var(--tut-c1)" }}
              >
                All tracks <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--tut-c1)" }}
              >
                {page === total - 1 ? "Finish" : "Next"} <span aria-hidden="true">→</span>
              </button>
            )}
          </div>

          <p className="mt-4 text-center font-mono text-[11px]" style={{ color: "var(--tut-dim)" }}>
            Arrow keys to move · <kbd>s</kbd> skip section · <kbd>/</kbd> search · <kbd>Esc</kbd> tracks
          </p>
        </div>
      </div>
    </div>
  );
}

function FinishPanel({
  track,
  nextTrack,
  onReview,
}: {
  track: Track;
  nextTrack: Track | undefined;
  onReview: () => void;
}) {
  return (
    <article className="tut-fade">
      <div className="tut-eyebrow mb-3 flex items-center gap-2.5">
        <span className="tut-rule" style={{ width: 22 }} />
        {track.title} complete
      </div>
      <h2 className="font-display text-[clamp(24px,4vw,36px)] font-extrabold leading-[1.08] tracking-tight" style={{ color: "var(--tut-fg)" }}>
        You&apos;re ready.
      </h2>
      <span className="tut-rule mb-6 mt-3.5" style={{ width: 92 }} />

      <div className="tut-term overflow-hidden">
        <div className="border-b px-4 py-2.5" style={{ borderColor: "var(--tut-line)" }}>
          <span className="tut-eyebrow">What to do right now</span>
        </div>
        <div className="space-y-4 px-5 py-5 text-[14.5px] leading-relaxed" style={{ color: "var(--tut-fg)" }}>
          <p>If you ran ./paw setup, your hooks are already installed. Open Claude Code (or Cursor, or Codex CLI) and try:</p>
          <ol className="space-y-3">
            <li>
              <span className="tc2 tbold font-mono">1. Test the hooks.</span>{" "}
              Type <code className="tc3 font-mono">git rebase main</code>. It gets blocked with an explanation.
            </li>
            <li>
              <span className="tc2 tbold font-mono">2. Run a review agent.</span>{" "}
              Ask for the <code className="tc3 font-mono">code-reviewer</code> agent on your current diff.
            </li>
            <li>
              <span className="tc2 tbold font-mono">3. Stack reviewers.</span>{" "}
              Run <code className="tc3 font-mono">paw check</code> for code, bugs, and security at once.
            </li>
          </ol>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {nextTrack && (
          <Link
            href={`/tutorial/${nextTrack.id}`}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-[14px] font-semibold text-white no-underline transition-opacity hover:opacity-90"
            style={{ background: "var(--tut-c1)" }}
          >
            <span aria-hidden="true">{nextTrack.icon}</span> Next: {nextTrack.title}
          </Link>
        )}
        <button
          type="button"
          onClick={onReview}
          className="inline-flex items-center gap-1.5 rounded-md border px-4 py-2.5 text-[14px] transition-colors hover:bg-[var(--tut-elev)]"
          style={{ borderColor: "var(--tut-line)", color: "var(--tut-fg)" }}
        >
          Review last page
        </button>
        <a
          href="https://github.com/Effulgent-Point/paw"
          className="inline-flex items-center gap-1.5 rounded-md border px-4 py-2.5 text-[14px] no-underline transition-colors hover:bg-[var(--tut-elev)]"
          style={{ borderColor: "var(--tut-line)", color: "var(--tut-fg)" }}
        >
          paw on GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
