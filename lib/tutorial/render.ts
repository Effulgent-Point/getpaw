// ---------------------------------------------------------------------------
// render.ts -- pure render contract for the tutorial.
//
// This mirrors tutorial_engine/engine.py render_content: it turns a page's raw
// body/art lines (from the generated data.ts) into styled segments. Components
// render those segments as ESCAPED React text nodes (never dangerouslySet-
// InnerHTML), so ASCII art or body copy can never inject markup.
//
// Color classes (tc1..tc5, tdim, tbold) are plain CSS in app/globals.css, so
// they theme (light/dark) and do not depend on Tailwind's content scan.
// ---------------------------------------------------------------------------

import type { TutorialColor, TutorialPage } from "@/lib/tutorial/data";

/** curses color-pair code (engine.py) -> tutorial CSS class. */
export const COLOR_CLASS: Record<TutorialColor, string> = {
  1: "tc1", // CYAN        -> teal accent
  2: "tc2", // GREEN       -> good
  3: "tc3", // YELLOW      -> warn / command
  4: "tc4", // MAGENTA     -> special
  5: "tc5", // BOLD_WHITE  -> strong (ink)
};

export interface Segment {
  text: string;
  cls?: string;
}

export interface ArtLine {
  text: string;
  cls?: string;
}

/**
 * Art coloring, mirroring engine.render_content: each row uses artRowColors[i]
 * when present, otherwise the block artColor; no color falls back to the
 * terminal foreground.
 */
export function renderArt(page: TutorialPage): ArtLine[] {
  const art = page.art ?? [];
  const rowColors = page.artRowColors;
  const blockCls = page.artColor ? COLOR_CLASS[page.artColor] : undefined;
  return art.map((text, i) => {
    const rc = rowColors && i < rowColors.length ? rowColors[i] : page.artColor;
    const cls = rc ? COLOR_CLASS[rc] : blockCls;
    return { text, cls };
  });
}

/**
 * One body line -> styled segments.
 *  - highlight: if line.trimStart() startsWith a prefix, the whole line takes
 *    that color + bold (first match wins, preserving dict order) -- exactly
 *    engine.render_content's prefix test.
 *  - otherwise, a trailing "#" comment (or a whole "#"/"##" line) is dimmed.
 *    This is presentation only; the source data is never changed.
 */
export function renderBodyLine(
  line: string,
  highlight?: Record<string, TutorialColor>,
): Segment[] {
  if (highlight) {
    const trimmed = line.trimStart();
    for (const prefix of Object.keys(highlight)) {
      if (prefix.length > 0 && trimmed.startsWith(prefix)) {
        return [{ text: line, cls: `${COLOR_CLASS[highlight[prefix]]} tbold` }];
      }
    }
  }
  return dimComment(line);
}

function dimComment(line: string): Segment[] {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("#")) {
    return [{ text: line, cls: "tdim" }];
  }
  const m = line.match(/\s#/);
  if (m && m.index !== undefined) {
    const idx = m.index + 1; // index of the '#'
    return [{ text: line.slice(0, idx) }, { text: line.slice(idx), cls: "tdim" }];
  }
  return [{ text: line }];
}

// --- copy-to-clipboard -------------------------------------------------------

const COMMAND_RE =
  /^(\$ |> |git |paw |\.\/paw|\.\/setup|python3|ruff|cd |echo |curl |npm |ls |cat )/;

/** A page's body is copyable when it contains at least one command-like line. */
export function isCopyable(page: TutorialPage): boolean {
  return page.body.some((l) => COMMAND_RE.test(l.trimStart()));
}

/**
 * Clipboard text for a copyable page: outer blank lines trimmed, dedented to
 * the common indent, and leading "$ " / "> " prompts stripped so the commands
 * paste cleanly. Multi-line commands are preserved verbatim.
 */
export function copyText(page: TutorialPage): string {
  const body = page.body;
  let start = 0;
  let end = body.length;
  while (start < end && body[start].trim() === "") start++;
  while (end > start && body[end - 1].trim() === "") end--;
  const lines = body.slice(start, end);
  if (lines.length === 0) return "";

  const indents = lines
    .filter((l) => l.trim() !== "")
    .map((l) => l.length - l.trimStart().length);
  const minIndent = indents.length ? Math.min(...indents) : 0;

  return lines
    .map((l) => l.slice(minIndent).replace(/^(\$ |> )/, ""))
    .join("\n");
}
