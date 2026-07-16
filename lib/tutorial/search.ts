// ---------------------------------------------------------------------------
// search.ts -- in-tutorial search over the generated content.
//
// A tiny in-memory index built once from TRACKS (54 pages, no network, no API).
// Matches on title / section / track / body, ranked title-first.
// ---------------------------------------------------------------------------

import { TRACKS } from "@/lib/tutorial/data";

export interface SearchResult {
  trackId: string;
  trackTitle: string;
  trackIcon: string;
  pageIndex: number;
  section: string;
  title: string;
  snippet: string;
}

interface IndexEntry extends Omit<SearchResult, "snippet"> {
  text: string;
  haystack: string;
}

const INDEX: IndexEntry[] = TRACKS.flatMap((track) =>
  track.pages.map((page, pageIndex) => {
    const text = page.body.join(" ").replace(/\s+/g, " ").trim();
    return {
      trackId: track.id,
      trackTitle: track.title,
      trackIcon: track.icon,
      pageIndex,
      section: page.section,
      title: page.title,
      text,
      haystack: `${track.title} ${page.section} ${page.title} ${text}`.toLowerCase(),
    };
  }),
);

function makeSnippet(text: string, q: string): string {
  if (!text) return "";
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return text.slice(0, 96).trim();
  const start = Math.max(0, i - 32);
  const end = Math.min(text.length, i + q.length + 64);
  return (
    (start > 0 ? "…" : "") +
    text.slice(start, end).trim() +
    (end < text.length ? "…" : "")
  );
}

export function searchTutorials(query: string, limit = 24): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const scored: { entry: IndexEntry; score: number }[] = [];
  for (const entry of INDEX) {
    let score = 0;
    if (entry.title.toLowerCase().includes(q)) score += 10;
    if (entry.section.toLowerCase().includes(q)) score += 4;
    if (entry.trackTitle.toLowerCase().includes(q)) score += 3;
    if (entry.text.toLowerCase().includes(q)) score += 1;
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score || a.entry.pageIndex - b.entry.pageIndex);

  return scored.slice(0, limit).map(({ entry }) => ({
    trackId: entry.trackId,
    trackTitle: entry.trackTitle,
    trackIcon: entry.trackIcon,
    pageIndex: entry.pageIndex,
    section: entry.section,
    title: entry.title,
    snippet: makeSnippet(entry.text, q),
  }));
}
