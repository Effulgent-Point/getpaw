# getpaw — launch notes

Built 2026-07-16 by a forge-style multi-agent pipeline (architect, foundation, three parallel builders, integrate) plus five forge quality gates (a11y, bugs, perf, code, product-intent) and a fix pass.

## Live
- **getpaw.dev** — canonical open-source site. Live, HTTPS, on Vercel (project `getpaw`).
- **paw.effulgentpoint.com** — the same app in the Effulgent Point shell. Attached to the project but **not resolving yet**: effulgentpoint.com's DNS is on Cloudflare, so it needs a record only you can add (below).

## What is on the site
- **Home** — hero, an animated `paw check` terminal, live agent/skill/hook/CLI counts, a copy-paste install block, and the "what is in the kit" pillars.
- **/tutorial** — the 9 tracks (learn, start, cli, advanced, practice, hooks, recipes, try, contribute), each generated from `paw/tutorial_engine/content.py` so the web tutorial can never drift from the TUI. Sidebar, progress, search, keyboard nav, light/dark toggle.
- **/catalog** — browsable, filterable cards for the 18 agents, 7 skills, 4 hooks, and CLI, sourced from the paw repo.
- **/install** — quickstart.
- **/bamboohr** — the co-branded Tech Forge training hub: "Welcome, Bambooligans" in BambooHR leaf-green, a "your AI principles, in code" panel mapping their three AI principles to what paw does, a branded quickstart, and a native slide viewer (keyboard nav, fullscreen present mode).
- **Polish** — branded OG social image, a console easter egg, a live GitHub star count, `llms.txt`, and SoftwareApplication JSON-LD. Host-aware chrome: standalone shell on getpaw.dev, Effulgent Point shell on paw.effulgentpoint.com. Canonical always points to getpaw.dev.

## Needs you
1. **Turn on paw.effulgentpoint.com.** In Cloudflare (effulgentpoint.com's DNS), add: `A  paw  76.76.21.21` (DNS-only, not proxied). It verifies + provisions SSL automatically, then serves the EP-shell version.
2. **The training deck.** Export your slides to a PDF or PNGs (or send a Google Slides link) and I will wire them into the /bamboohr slide viewer, which currently shows a branded placeholder deck.

## Fixed from the quality gates
Contrast fails (leaf-green used as text, the tutorial's dim token), keyboard shortcuts hijacking Space/scroll on the slide viewer and tutorial, the search modal's missing focus ring + focus return, a host-match that a spoofed subdomain could game, the GitHub star fetch (missing User-Agent), a stale-state remount bug on track navigation, and the "14 of 18 read-only" copy (it is 14 restricted, 10 read-only).

## Deferred (non-blocking, noted for a follow-up)
- Host detection in the root layout opts routes out of static generation. Moving it into middleware would restore static delivery.
- `/tutorial` ships the full tutorial data to the client via TrackSelector; a lightweight TRACK_META would shrink the bundle.
- `next lint` was removed in Next 16, so `npm run lint` needs an ESLint flat-config migration.
- Search dialog could use the full combobox/listbox ARIA pattern and a Tab focus-trap.
