// Section navigation. Vertical rail on large screens, horizontally scrollable
// chips on mobile. Markers mirror engine.py draw_sidebar: current, done, todo.

export function TutorialSidebar({
  sections,
  sectionStarts,
  currentSection,
  currentPage,
  onJump,
}: {
  sections: string[];
  sectionStarts: Record<string, number>;
  currentSection: string;
  currentPage: number;
  onJump: (page: number) => void;
}) {
  return (
    <nav
      aria-label="Tutorial sections"
      className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:pb-0"
    >
      {sections.map((section) => {
        const start = sectionStarts[section] ?? 0;
        const isCurrent = section === currentSection;
        const isDone = !isCurrent && currentPage > start;
        const marker = isCurrent ? "▸" : isDone ? "✓" : "·";

        return (
          <button
            key={section}
            type="button"
            onClick={() => onJump(start)}
            aria-current={isCurrent ? "step" : undefined}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-left text-[13px] transition-colors"
            style={{
              background: isCurrent ? "var(--tut-elev)" : "transparent",
              color: isCurrent
                ? "var(--tut-c1)"
                : isDone
                  ? "var(--tut-fg)"
                  : "var(--tut-dim)",
              fontWeight: isCurrent ? 700 : 400,
            }}
          >
            <span
              aria-hidden="true"
              className="w-3 text-center font-mono"
              style={{ color: isDone ? "var(--tut-c2)" : "inherit" }}
            >
              {marker}
            </span>
            {section}
            {isDone && <span className="sr-only"> (completed)</span>}
          </button>
        );
      })}
    </nav>
  );
}
