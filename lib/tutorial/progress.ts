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

export function getTrackProgress(id: string): TrackProgress | undefined {
  return read()[id];
}

/** Percent complete for a track (0..100), based on furthest page reached. */
export function percentComplete(p: TrackProgress | undefined): number {
  if (!p || p.total <= 1) return p?.done ? 100 : 0;
  if (p.done) return 100;
  return Math.round((p.max / (p.total - 1)) * 100);
}

export function recordVisit(
  trackId: string,
  pageIndex: number,
  total: number,
): ProgressMap {
  const map = read();
  const prev = map[trackId];
  map[trackId] = {
    max: Math.max(prev?.max ?? 0, pageIndex),
    done: (prev?.done ?? false) || pageIndex >= total - 1,
    total,
  };
  write(map);
  return map;
}

export function resetTrack(trackId: string): ProgressMap {
  const map = read();
  delete map[trackId];
  write(map);
  return map;
}

export function resetAll(): void {
  write({});
}
