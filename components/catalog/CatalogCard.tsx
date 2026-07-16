import type {
  Agent,
  AgentPhase,
  AgentTier,
  Skill,
  Hook,
  CliCommand,
} from "@/data/catalog";
import { CLI_GROUP_LABELS, TIER_MEANING } from "@/data/catalog";
import { CatalogChip } from "./CatalogChip";

// A normalized entry so the grid can hold every kind in one list.
export type CatalogEntry =
  | { kind: "agent"; data: Agent }
  | { kind: "skill"; data: Skill }
  | { kind: "hook"; data: Hook }
  | { kind: "cli"; data: CliCommand };

// Decorative dot colors. Legible viridis variants, not the raw --sp* values,
// so nothing depends on a light yellow/green dot to carry meaning.
const PHASE_DOT: Record<AgentPhase, string> = {
  Plan: "#3B528B",
  Build: "#21908C",
  Review: "#2E7D46",
  Respond: "#440154",
  Document: "#9A5B00",
};

const TIER_DOT: Record<AgentTier, string> = {
  "Read-only": "#21908C",
  "Read + Bash": "#3B528B",
  "Read + Write": "#9A5B00",
  Full: "#440154",
};

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md border border-line bg-card p-6">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg,#440154,#3B528B,#21908C,#5DC863,#FDE725)",
        }}
      />
      {children}
    </article>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-mut">
      {children}
    </p>
  );
}

function AgentCard({ data }: { data: Agent }) {
  return (
    <Shell>
      <Kicker>Agent · {data.model}</Kicker>
      <h3 className="font-display text-[20px] font-bold leading-tight">
        {data.name}
      </h3>
      <p className="mt-2 flex-1 text-[15px] text-mut">{data.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <CatalogChip dot={PHASE_DOT[data.phase]}>{data.phase}</CatalogChip>
        <CatalogChip dot={TIER_DOT[data.tier]} strong title={TIER_MEANING[data.tier]}>
          {data.tier}
        </CatalogChip>
      </div>
      <p className="mt-3 font-mono text-[11px] text-mut">
        {data.tools.join(" · ")}
      </p>
    </Shell>
  );
}

function SkillCard({ data }: { data: Skill }) {
  return (
    <Shell>
      <Kicker>Skill · {data.category}</Kicker>
      <h3 className="font-display text-[20px] font-bold leading-tight">
        {data.name}
      </h3>
      <p className="mt-2 flex-1 text-[15px] text-mut">{data.triggersWhen}</p>
      <p className="mt-4 font-mono text-[11px] text-mut">{data.sourcePath}</p>
    </Shell>
  );
}

function HookCard({ data }: { data: Hook }) {
  return (
    <Shell>
      <Kicker>Hook · {data.event ?? data.kind}</Kicker>
      <h3 className="font-mono text-[16px] font-semibold leading-tight text-ink">
        {data.file}
      </h3>
      <p className="mt-2 flex-1 text-[15px] text-mut">{data.does}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {data.event ? <CatalogChip>{data.event}</CatalogChip> : null}
        {data.matcher ? <CatalogChip>{data.matcher}</CatalogChip> : null}
      </div>
      {data.overrides.length > 0 ? (
        <p className="mt-3 font-mono text-[11px] text-mut">
          override: {data.overrides.join(", ")}
        </p>
      ) : null}
    </Shell>
  );
}

function CliCard({ data }: { data: CliCommand }) {
  return (
    <Shell>
      <Kicker>CLI · {CLI_GROUP_LABELS[data.group]}</Kicker>
      <h3 className="font-mono text-[16px] font-semibold leading-tight text-ink">
        {data.command}
        {data.args ? <span className="text-mut"> {data.args}</span> : null}
      </h3>
      <p className="mt-2 flex-1 text-[15px] text-mut">{data.summary}</p>
    </Shell>
  );
}

export function CatalogCard({ entry }: { entry: CatalogEntry }) {
  switch (entry.kind) {
    case "agent":
      return <AgentCard data={entry.data} />;
    case "skill":
      return <SkillCard data={entry.data} />;
    case "hook":
      return <HookCard data={entry.data} />;
    case "cli":
      return <CliCard data={entry.data} />;
  }
}
