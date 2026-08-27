#!/usr/bin/env node
// ---------------------------------------------------------------------------
// gen-tutorial.mjs  --  the anti-drift core of the getpaw tutorial.
//
// The paw TUI tutorial's SINGLE SOURCE OF TRUTH is:
//   <paw>/tutorial_engine/content.py   (TRACKS + ALL_TRACKS: SECTIONS + PAGES)
//
// This script asks python3 to faithfully load that module (no relative
// imports, pure data, side-effect free) and dump it as JSON, then validates
// the shape against a strict key allowlist and emits a typed, camelCased TS
// mirror at lib/tutorial/data.ts.
//
// Because the render layer is a pure function of this generated data, the web
// tutorial cannot drift from the CLI. Re-run after any content.py change:
//   npm run gen         (writes lib/tutorial/data.ts)
//   npm run gen:check   (fails if the committed file is stale)
//
// The hand-authored tutorial.html is NOT a source: it has already drifted
// (dark theme, tables, rewritten prose). Do not port it.
//
// Config: PAW_REPO env var, or first CLI arg, else the local default below.
// python3 runs ONLY here (local/CI), never on Vercel: data.ts is committed.
// ---------------------------------------------------------------------------

import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const PAW_REPO = resolve(
  process.argv[2] || process.env.PAW_REPO || "/Users/zofrus/Development/paw",
);
const CONTENT_PY = join(PAW_REPO, "tutorial_engine", "content.py");
const PYPROJECT = join(PAW_REPO, "pyproject.toml");
const OUT_FILE = join(REPO_ROOT, "lib", "tutorial", "data.ts");
const SUMMARY_FILE = join(REPO_ROOT, "lib", "tutorial", "summaries.ts");
const SEARCH_FILE = join(REPO_ROOT, "lib", "tutorial", "search-index.ts");

// Every key a page dict is allowed to carry. An unknown key is a hard error:
// it means content.py changed shape and the renderer contract must be reviewed
// before we silently ship something we do not render.
const ALLOWED_PAGE_KEYS = new Set([
  "title",
  "section",
  "body",
  "art",
  "art_color",
  "art_row_colors",
  "highlight",
  "typewriter_title",
]);

const fail = (msg) => {
  console.error(`\n[gen-tutorial] ERROR: ${msg}\n`);
  process.exit(1);
};

if (!existsSync(CONTENT_PY)) {
  fail(
    `cannot find content.py at ${CONTENT_PY}\n` +
      `  set PAW_REPO or pass the paw repo path as the first argument, e.g.:\n` +
      `  PAW_REPO=/path/to/paw node scripts/gen-tutorial.mjs`,
  );
}

// python program: faithfully load the module and dump JSON. content.py has no
// imports and no side effects, so exec_module is safe.
const PY = `
import sys, json, importlib.util, re
content_path, pyproject_path = sys.argv[1], sys.argv[2]
spec = importlib.util.spec_from_file_location("paw_content", content_path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
tracks = mod.TRACKS
all_tracks = mod.ALL_TRACKS
ver = None
try:
    txt = open(pyproject_path, encoding="utf-8").read()
    m = re.search(r'(?m)^version\\s*=\\s*"([^"]+)"', txt)
    if m:
        ver = m.group(1)
except Exception:
    pass
out = {
    "version": ver,
    "tracks": tracks,
    "all": {k: {"sections": v[0], "pages": v[1]} for k, v in all_tracks.items()},
}
sys.stdout.write(json.dumps(out, ensure_ascii=False))
`;

let raw;
try {
  raw = execFileSync("python3", ["-c", PY, CONTENT_PY, PYPROJECT], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
} catch (err) {
  fail(`python3 failed to load content.py\n${err.stderr || err.message}`);
}

let parsed;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  fail(`could not parse python output as JSON: ${err.message}`);
}

// ---- upstream leak sanitizer -----------------------------------------------
// The upstream content.py in the paw repo still contains references to
// a specific downstream pipeline product by name. The public getpaw.dev
// site is intentionally generic — "the pipeline," "the harness" — so
// every reference has to be rewritten here on regen, otherwise the next
// `npm run gen` reintroduces the leak that PR #2 scrubbed in place.
//
// Ordered map: longer / more specific replacements first so they don't
// get partially consumed by later rules. Case-sensitive by design so
// title case ("Forge") vs word ("forge") can be rewritten independently.
const SANITIZE_MAP = [
  ["paw to forge", "paw to a full pipeline"],
  [
    "Graduate to forge when you're ready",
    "Graduate to a full pipeline when you're ready",
  ],
  ["│forge │", "│ pipe │"], // preserves the ascii box width
  ["forge is", "the full pipeline is"],
  ["forge does", "a full pipeline does"],
  ["forge:", "the pipeline:"],
  ["Forge ", "The pipeline "], // sentence-initial; trailing space avoids "Forget"
  [" forge ", " the pipeline "],
  [" forge.", " the pipeline."],
  [" forge,", " the pipeline,"],
];

// Final belt-and-suspenders pass: any remaining word-boundary occurrence
// of the specific tool name (case-insensitive) gets rewritten to a generic
// term. This catches the tail cases the ordered map above can miss —
// end-of-line "forge" in ASCII art, search-index keyword strings, etc.
// The word "forget" (five letters, "forge" + "t") does NOT trigger this
// because \b requires a word boundary AFTER the match.
const FALLBACK_WORD_RE = /\bforge\b/gi;
function fallbackWordReplace(s) {
  return s.replace(FALLBACK_WORD_RE, (match) =>
    match[0] === match[0].toUpperCase() ? "Pipeline" : "pipeline",
  );
}

function sanitize(value) {
  if (typeof value === "string") {
    let out = value;
    for (const [from, to] of SANITIZE_MAP) {
      if (out.includes(from)) out = out.split(from).join(to);
    }
    out = fallbackWordReplace(out);
    return out;
  }
  if (Array.isArray(value)) return value.map(sanitize);
  if (value && typeof value === "object") {
    const next = {};
    for (const [k, v] of Object.entries(value)) next[k] = sanitize(v);
    return next;
  }
  return value;
}

parsed = sanitize(parsed);

const { version, tracks, all } = parsed;
if (!Array.isArray(tracks) || tracks.length === 0) fail("TRACKS is empty");
if (!all || typeof all !== "object") fail("ALL_TRACKS is missing");

// ---- validation + transform -------------------------------------------------

const isStrArray = (v) =>
  Array.isArray(v) && v.every((x) => typeof x === "string");
const isColor = (v) => Number.isInteger(v) && v >= 1 && v <= 5;
// Per-row art colors additionally allow 0, the "no override, fall back to the
// block color" sentinel that engine.py and lib/tutorial/render.ts both honor.
const isRowColor = (v) => v === 0 || isColor(v);

// House style: no em/en dashes in copy. Normalize to ASCII "--" / "-" (a pure,
// deterministic punctuation transform, meaning preserved). ASCII art uses box
// characters (U+2500 etc.), never U+2014, so art is left untouched.
let dashFixes = 0;
const EM_DASH = String.fromCharCode(0x2014);
const EN_DASH = String.fromCharCode(0x2013);
const deDash = (s) => {
  if (typeof s !== "string") return s;
  const out = s.split(EM_DASH).join("--").split(EN_DASH).join("-");
  if (out !== s) dashFixes += 1;
  return out;
};

const outTracks = [];
let totalPages = 0;

for (const meta of tracks) {
  for (const k of ["id", "title", "desc", "time", "icon"]) {
    if (typeof meta[k] !== "string")
      fail(`track meta missing string "${k}": ${JSON.stringify(meta)}`);
  }
  const entry = all[meta.id];
  if (!entry) fail(`track "${meta.id}" is in TRACKS but not in ALL_TRACKS`);

  if (!isStrArray(entry.sections))
    fail(`track "${meta.id}" sections must be string[]`);
  if (!Array.isArray(entry.pages))
    fail(`track "${meta.id}" pages must be an array`);

  const sections = entry.sections.map(deDash);
  const pages = entry.pages;
  const sectionSet = new Set(sections);
  const outPages = pages.map((page, i) => {
    const where = `${meta.id}[#${i} "${page.title ?? "?"}"]`;

    // strict key allowlist: guards against upstream shape changes
    for (const key of Object.keys(page)) {
      if (!ALLOWED_PAGE_KEYS.has(key)) {
        fail(
          `unknown page key "${key}" in ${where}. content.py changed shape; review the renderer contract before regenerating.`,
        );
      }
    }

    if (typeof page.title !== "string")
      fail(`${where}: title must be a string`);
    if (typeof page.section !== "string")
      fail(`${where}: section must be a string`);
    const section = deDash(page.section);
    if (!sectionSet.has(section)) {
      fail(
        `${where}: section "${section}" is not in track sections [${sections.join(", ")}]`,
      );
    }

    const rawBody = page.body ?? [];
    if (!isStrArray(rawBody)) fail(`${where}: body must be string[]`);
    const body = rawBody.map(deDash);

    const out = { title: deDash(page.title), section, body };

    if (page.art !== undefined) {
      if (!isStrArray(page.art)) fail(`${where}: art must be string[]`);
      out.art = page.art;
    }
    if (page.art_color !== undefined && page.art_color !== 0) {
      if (!isColor(page.art_color)) fail(`${where}: art_color must be 1..5`);
      out.artColor = page.art_color;
    }
    if (page.art_row_colors !== undefined) {
      if (
        !Array.isArray(page.art_row_colors) ||
        !page.art_row_colors.every(isRowColor)
      ) {
        fail(`${where}: art_row_colors must be (0..5)[]`);
      }
      out.artRowColors = page.art_row_colors;
    }
    if (page.highlight !== undefined) {
      const h = page.highlight;
      if (!h || typeof h !== "object" || Array.isArray(h))
        fail(`${where}: highlight must be an object`);
      for (const [prefix, color] of Object.entries(h)) {
        if (typeof prefix !== "string" || !isColor(color))
          fail(`${where}: highlight entries must be string -> 1..5`);
      }
      out.highlight = h;
    }
    if (page.typewriter_title === true) out.typewriterTitle = true;

    return out;
  });

  totalPages += outPages.length;
  outTracks.push({
    id: meta.id,
    title: deDash(meta.title),
    desc: deDash(meta.desc),
    time: deDash(meta.time),
    icon: meta.icon,
    sections,
    pages: outPages,
  });
}

// orphan check: no ALL_TRACKS entry without a TRACKS meta
const metaIds = new Set(tracks.map((t) => t.id));
for (const id of Object.keys(all)) {
  if (!metaIds.has(id)) fail(`ALL_TRACKS has "${id}" with no entry in TRACKS`);
}

// ---- emit -------------------------------------------------------------------

const banner = `// ---------------------------------------------------------------------------
// AUTO-GENERATED by scripts/gen-tutorial.mjs -- DO NOT EDIT BY HAND.
//
// Faithful 1:1 mirror of the paw TUI tutorial content:
//   <paw>/tutorial_engine/content.py  (TRACKS + ALL_TRACKS)
//
// Regenerate:  npm run gen        Verify fresh:  npm run gen:check
// Keys are camelCased. Copy is verbatim except em/en dashes, normalized to
// ASCII "--" / "-" for house style (art is untouched).
// The render layer (lib/tutorial/render.ts) maps these to colored terminal
// output, mirroring tutorial_engine/engine.py render_content.
// ---------------------------------------------------------------------------
`;

const types = `
/** curses color-pair codes from engine.py: 1 CYAN 2 GREEN 3 YELLOW 4 MAGENTA 5 BOLD_WHITE */
export type TutorialColor = 1 | 2 | 3 | 4 | 5;

export interface TutorialPage {
  /** Page heading. */
  title: string;
  /** Section this page belongs to (always one of Track.sections). */
  section: string;
  /** Terminal body lines; "" is a blank line. */
  body: string[];
  /** Optional ASCII-art block, rendered in a <pre>. */
  art?: string[];
  /** Color for the whole art block when artRowColors is absent. */
  artColor?: TutorialColor;
  /** Per-row art colors (index-aligned with art); 0 means "use the block color". */
  artRowColors?: (TutorialColor | 0)[];
  /** Prefix -> color: a body line whose trimStart() startsWith(prefix) is colored + bold. */
  highlight?: Record<string, TutorialColor>;
  /** When true, the title types out once on first visit. */
  typewriterTitle?: boolean;
}

export interface Track {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: string;
  sections: string[];
  pages: TutorialPage[];
}
`;

const body = `
/** paw version this content was generated from (pyproject.toml). */
export const PAW_VERSION = ${JSON.stringify(version ?? "unknown")};

/** All tracks, in TRACKS order. */
export const TRACKS: Track[] = ${JSON.stringify(outTracks, null, 2)};

/** Track ids, in order. */
export const TRACK_IDS: string[] = TRACKS.map((t) => t.id);

/** Look up a track by id. */
export function getTrack(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}
`;

writeFileSync(
  OUT_FILE,
  banner + types + body.replace(/^\n/, "") + "\n",
  "utf8",
);

// ---- slim client-side derivatives ------------------------------------------
// TrackSelector (landing page) and the search modal only need summary/index
// fields, never the full page body/art. Emitting them as standalone literals
// (not `TRACKS.map(...)`) means importing them does NOT pull the whole tutorial
// corpus into the client bundle, which importing TRACKS would.

const genBanner = `// ---------------------------------------------------------------------------
// AUTO-GENERATED by scripts/gen-tutorial.mjs -- DO NOT EDIT BY HAND.
// Regenerate:  npm run gen        Verify fresh:  npm run gen:check
// ---------------------------------------------------------------------------
`;

const summaries = outTracks.map((t) => ({
  id: t.id,
  title: t.title,
  desc: t.desc,
  time: t.time,
  icon: t.icon,
  pageCount: t.pages.length,
}));

const summaryOut = `${genBanner}
/** Lightweight track metadata for the tutorial landing grid (no page bodies). */
export interface TrackSummary {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: string;
  pageCount: number;
}

export const TRACK_SUMMARIES: TrackSummary[] = ${JSON.stringify(summaries, null, 2)};
`;
writeFileSync(SUMMARY_FILE, summaryOut, "utf8");

const searchEntries = outTracks.flatMap((t) =>
  t.pages.map((page, pageIndex) => ({
    trackId: t.id,
    trackTitle: t.title,
    trackIcon: t.icon,
    pageIndex,
    section: page.section,
    title: page.title,
    text: page.body.join(" ").replace(/\s+/g, " ").trim(),
  })),
);

const searchOut = `${genBanner}
/** One searchable page: summary + flattened body text, nothing heavier. */
export interface SearchIndexEntry {
  trackId: string;
  trackTitle: string;
  trackIcon: string;
  pageIndex: number;
  section: string;
  title: string;
  text: string;
}

export const SEARCH_INDEX: SearchIndexEntry[] = ${JSON.stringify(searchEntries, null, 2)};
`;
writeFileSync(SEARCH_FILE, searchOut, "utf8");

// ---- summary ----------------------------------------------------------------

console.error(`[gen-tutorial] paw ${version ?? "?"}  ${PAW_REPO}`);
for (const t of outTracks) {
  console.error(
    `  ${t.id.padEnd(11)} ${String(t.pages.length).padStart(2)} pages  ${t.sections.length} sections`,
  );
}
console.error(
  `[gen-tutorial] ${outTracks.length} tracks, ${totalPages} pages, ${dashFixes} dash-normalized -> ${OUT_FILE}`,
);
