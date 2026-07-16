"use client";

// The tutorial landing page: nine track cards with live localStorage progress,
// search, and the light/dark toggle. Built to read as a product page.

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { TRACK_SUMMARIES } from "@/lib/tutorial/summaries";
import {
  PROGRESS_EVENT,
  percentComplete,
  readProgress,
  resetAll,
  type ProgressMap,
} from "@/lib/tutorial/progress";
import { ThemeToggle } from "./ThemeToggle";
import { TutorialSearch } from "./TutorialSearch";

// Parse the first integer in a time string ("~5 min" -> 5). Taking the first
// match (not stripping every non-digit) keeps a future range like "10-15 min"
// from collapsing into "1015".
const TOTAL_MIN = TRACK_SUMMARIES.reduce(
  (sum, t) => sum + (Number.parseInt(t.time.match(/\d+/)?.[0] ?? "0", 10) || 0),
  0,
);
const TOTAL_PAGES = TRACK_SUMMARIES.reduce((n, t) => n + t.pageCount, 0);

export function TrackSelector() {
  const [progress, setProgress] = useState<ProgressMap>({});

  const refresh = useCallback(() => setProgress(readProgress()), []);

  useEffect(() => {
    refresh();
    const onVisible = () => document.visibilityState === "visible" && refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const completed = TRACK_SUMMARIES.filter((t) => progress[t.id]?.done).length;

  return (
    <div className="wrap py-10 lg:py-16">
      {/* header */}
      <div className="mb-10 flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="tut-eyebrow mb-4 flex items-center gap-2.5">
            <span className="tut-rule" style={{ width: 26 }} />
            paw tutorial library
          </p>
          <h1
            className="font-display text-[clamp(30px,5.5vw,52px)] font-extrabold leading-[0.98] tracking-tight"
            style={{ color: "var(--tut-fg)" }}
          >
            Learn paw by doing.
          </h1>
          <p className="mt-5 max-w-xl text-[17px]" style={{ color: "var(--tut-dim)" }}>
            Nine hands-on tracks, from first install to writing your own agents.
            Every page is generated straight from the paw CLI tutorial, so what
            you read here never drifts from the tool.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TutorialSearch />
          <ThemeToggle />
        </div>
      </div>

      {/* stats strip */}
      <div
        className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y py-3 font-mono text-[12px]"
        style={{ borderColor: "var(--tut-line)", color: "var(--tut-dim)" }}
      >
        <span>{TRACK_SUMMARIES.length} tracks</span>
        <span>{TOTAL_PAGES} pages</span>
        <span>about {TOTAL_MIN} min end to end</span>
        <span className="ml-auto" style={{ color: completed > 0 ? "var(--tut-c2)" : "inherit" }}>
          {completed} of {TRACK_SUMMARIES.length} complete
        </span>
      </div>

      {/* grid */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TRACK_SUMMARIES.map((track, i) => {
          const p = progress[track.id];
          const pct = percentComplete(p);
          const done = !!p?.done;
          const started = !!p && p.max > 0 && !done;
          const href =
            started && p ? `/tutorial/${track.id}?p=${p.max}` : `/tutorial/${track.id}`;
          const status = done ? "Completed" : started ? "Continue" : "Start";

          return (
            <li key={track.id}>
              <Link
                href={href}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border p-5 no-underline transition-transform duration-150 hover:-translate-y-0.5"
                style={{ background: "var(--tut-term-bg)", borderColor: "var(--tut-line)" }}
              >
                {/* spectral hover accent */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(90deg,#440154,#3b528b,#21908c,#5dc863,#fde725)",
                  }}
                />

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-2xl" aria-hidden="true">
                    {track.icon}
                  </span>
                  <span
                    className="font-mono text-[10.5px] uppercase tracking-[0.16em]"
                    style={{ color: "var(--tut-dim)" }}
                  >
                    {String(i + 1).padStart(2, "0")} · {track.time}
                  </span>
                </div>

                <h2
                  className="font-display text-[19px] font-bold leading-tight"
                  style={{ color: "var(--tut-fg)" }}
                >
                  {track.title}
                </h2>
                <p className="mt-1.5 flex-1 text-[14px] leading-snug" style={{ color: "var(--tut-dim)" }}>
                  {track.desc}
                </p>

                <div className="mt-4">
                  <div className="mb-2 h-1 overflow-hidden rounded-full" style={{ background: "var(--tut-line)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: done
                          ? "var(--tut-c2)"
                          : "linear-gradient(90deg,#3b528b,#21908c,#5dc863)",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ color: done ? "var(--tut-c2)" : "var(--tut-c1)" }}
                    >
                      {done && <span aria-hidden="true">✓</span>}
                      {status}
                    </span>
                    <span
                      className="translate-x-0 opacity-70 transition-transform duration-150 group-hover:translate-x-0.5"
                      style={{ color: "var(--tut-dim)" }}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {completed > 0 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              resetAll();
              setProgress({});
            }}
            className="font-mono text-[11px] underline-offset-2 hover:underline"
            style={{ color: "var(--tut-dim)" }}
          >
            Reset my progress
          </button>
        </div>
      )}
    </div>
  );
}
