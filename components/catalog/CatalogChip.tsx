import type { ReactNode } from "react";

// A small mono meta-chip: tier, phase, model, event, matcher, group, category.
export function CatalogChip({
  children,
  dot,
  title,
  strong = false,
}: {
  children: ReactNode;
  /** CSS color for a leading status dot. */
  dot?: string;
  /** Native tooltip text. */
  title?: string;
  /** Emphasized fill for the most important chip on a card (e.g. tier). */
  strong?: boolean;
}) {
  return (
    <span
      title={title}
      className={[
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded border px-2 py-[3px]",
        "font-mono text-[10.5px] uppercase tracking-[0.12em]",
        strong
          ? "border-hair bg-paper text-ink"
          : "border-line text-mut",
      ].join(" ")}
    >
      {dot ? (
        <span
          aria-hidden
          className="h-[7px] w-[7px] flex-none rounded-full"
          style={{ background: dot }}
        />
      ) : null}
      {children}
    </span>
  );
}
