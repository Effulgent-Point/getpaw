// ---------------------------------------------------------------------------
// progress.ts -- persistent tutorial progress (localStorage).
//
// Tracks, per track id: furthest page reached and whether it was completed.
// SSR-safe (returns empty on the server) and never throws on quota/parse.
// ---------------------------------------------------------------------------

const KEY = "getpaw:tutorial:progress:v1";

/** Fires (same tab) whenever progress is written, so views can refresh. */
export const PROGRESS_EVENT = "getpaw:progress";

export interface TrackProgress {
  /** Furthest 0-based page index reached. */
  max: number;
  /** Reached the final page at least once. */
  done: boolean;
  /** Total pages in the track (for percent complete). */
  total: number;
}

export type ProgressMap = Record<string, TrackProgress>;

function read(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

function write(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
  } catch {
    /* private mode / quota: progress is best-effort */
  }
}

export function readProgress(): ProgressMap {
  return read();
}

/** Percent complete for a track (0..100), based on furthest page reached. */
export function percentComplete(p: TrackProgress | undefined): number {
  if (!p || p.total <= 1) return p?.done ? 100 : 0;
  if (p.done) return 100;
  // Clamp: a shrunk track (content regenerated) can otherwise yield >100%.
  return Math.max(0, Math.min(100, Math.round((p.max / (p.total - 1)) * 100)));
}

export function recordVisit(
  trackId: string,
  pageIndex: number,
  total: number,
): ProgressMap {
  const map = read();
  const prev = map[trackId];
  // Only carry forward the stored max when the track shape is unchanged. If
  // `total` differs (content.py was edited and data.ts regenerated), the old
  // max may be out of range for the new page count, so discard it.
  const prevMax = prev && prev.total === total ? prev.max : 0;
  map[trackId] = {
    max: Math.max(prevMax, pageIndex),
    done: (prev?.total === total && prev.done) || pageIndex >= total - 1,
    total,
  };
  write(map);
  return map;
}

export function resetAll(): void {
  write({});
}
