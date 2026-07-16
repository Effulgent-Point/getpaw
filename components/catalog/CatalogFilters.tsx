import type { AgentPhase, AgentTier, CatalogKind } from "@/data/catalog";

export type ViewKind = "all" | CatalogKind;

export interface KindOption {
  key: ViewKind;
  label: string;
  count: number;
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "rounded border px-3 py-1.5 font-mono text-[12px] tracking-[0.06em] transition",
        active
          ? "border-ink bg-ink text-paper"
          : "border-line bg-card text-mut hover:text-ink",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function FacetRow<T extends string>({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: T[];
  active: T | "all";
  onChange: (value: T | "all") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-mut">
        {label}
      </span>
      <Toggle active={active === "all"} onClick={() => onChange("all")}>
        All
      </Toggle>
      {options.map((opt) => (
        <Toggle
          key={opt}
          active={active === opt}
          onClick={() => onChange(opt)}
        >
          {opt}
        </Toggle>
      ))}
    </div>
  );
}

export function CatalogFilters({
  kinds,
  activeKind,
  onKindChange,
  query,
  onQueryChange,
  showAgentFacets,
  phases,
  activePhase,
  onPhaseChange,
  tiers,
  activeTier,
  onTierChange,
}: {
  kinds: KindOption[];
  activeKind: ViewKind;
  onKindChange: (k: ViewKind) => void;
  query: string;
  onQueryChange: (q: string) => void;
  showAgentFacets: boolean;
  phases: AgentPhase[];
  activePhase: AgentPhase | "all";
  onPhaseChange: (p: AgentPhase | "all") => void;
  tiers: AgentTier[];
  activeTier: AgentTier | "all";
  onTierChange: (t: AgentTier | "all") => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {kinds.map((k) => (
            <Toggle
              key={k.key}
              active={activeKind === k.key}
              onClick={() => onKindChange(k.key)}
            >
              {k.label}
              <span className="ml-1.5 opacity-60">{k.count}</span>
            </Toggle>
          ))}
        </div>

        <label className="relative block sm:w-72">
          <span className="sr-only">Search the catalog</span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search the catalog"
            className="w-full rounded border border-line bg-card px-3 py-2 font-mono text-[13px] text-ink placeholder:text-mut focus:border-sp2 focus:outline-none"
          />
        </label>
      </div>

      {showAgentFacets ? (
        <div className="flex flex-col gap-3 border-t border-line pt-4">
          <FacetRow
            label="Phase"
            options={phases}
            active={activePhase}
            onChange={onPhaseChange}
          />
          <FacetRow
            label="Tier"
            options={tiers}
            active={activeTier}
            onChange={onTierChange}
          />
        </div>
      ) : null}
    </div>
  );
}
