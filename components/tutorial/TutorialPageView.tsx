// Renders one tutorial page (title + spectral rule + terminal card) from the
// generated page dict, mirroring engine.py render_content. Pure and keyed by
// the parent so it remounts per page (drives the fade + one-time typewriter).

import type { Track, TutorialPage } from "@/lib/tutorial/data";
import {
  copyText,
  isCopyable,
  renderArt,
  renderBodyLine,
  type Segment,
} from "@/lib/tutorial/render";
import { CopyButton } from "./CopyButton";
import { Pre } from "./Pre";
import { TypewriterTitle } from "./TypewriterTitle";

export function TutorialPageView({
  page,
  track,
  animateTitle,
}: {
  page: TutorialPage;
  track: Track;
  animateTitle: boolean;
}) {
  const artRows: Segment[][] = renderArt(page).map((a) => [
    { text: a.text, cls: a.cls },
  ]);
  const bodyRows: Segment[][] = page.body.map((line) =>
    renderBodyLine(line, page.highlight),
  );
  const copyable = isCopyable(page);

  return (
    <article className="tut-fade">
      <div className="tut-eyebrow mb-3 flex items-center gap-2.5">
        <span className="tut-rule" style={{ width: 22 }} />
        {page.section}
      </div>

      <h2
        className="font-display text-[clamp(23px,4vw,34px)] font-extrabold leading-[1.08] tracking-tight"
        style={{ color: "var(--tut-fg)" }}
      >
        {page.typewriterTitle ? (
          <TypewriterTitle text={page.title} active={animateTitle} />
        ) : (
          page.title
        )}
      </h2>

      <span className="tut-rule mb-6 mt-3.5" style={{ width: 92 }} />

      <div className="tut-term mt-1 overflow-hidden">
        <div
          className="flex items-center gap-2 border-b px-4 py-2.5"
          style={{ borderColor: "var(--tut-line)" }}
        >
          <span className="flex items-center gap-1.5" aria-hidden="true">
            {["#c8534b", "#d6a441", "#4fae63"].map((c) => (
              <span
                key={c}
                className="inline-block h-[10px] w-[10px] rounded-full opacity-70"
                style={{ background: c }}
              />
            ))}
          </span>
          <span className="tut-eyebrow ml-1.5 truncate">
            paw {track.icon} {track.title}
          </span>
          {copyable && (
            <span className="ml-auto shrink-0">
              <CopyButton text={copyText(page)} />
            </span>
          )}
        </div>

        <div className="overflow-x-auto px-4 py-4 sm:px-5">
          {artRows.length > 0 && <Pre rows={artRows} className="mb-1" />}
          {bodyRows.length > 0 && <Pre rows={bodyRows} />}
        </div>
      </div>
    </article>
  );
}
