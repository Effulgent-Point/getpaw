"use client";

import { useMemo, useState } from "react";
import {
  AGENTS,
  SKILLS,
  HOOKS,
  CLI_COMMANDS,
  AGENT_PHASES,
  AGENT_TIERS,
  type AgentPhase,
  type AgentTier,
} from "@/data/catalog";
import { CatalogCard, type CatalogEntry } from "./CatalogCard";
import {
  CatalogFilters,
  type ViewKind,
  type KindOption,
} from "./CatalogFilters";

// One flat list of every catalog item, tagged by kind.
const ALL_ENTRIES: CatalogEntry[] = [
  ...AGENTS.map((data): CatalogEntry => ({ kind: "agent", data })),
  ...SKILLS.map((data): CatalogEntry => ({ kind: "skill", data })),
  ...HOOKS.map((data): CatalogEntry => ({ kind: "hook", data })),
  ...CLI_COMMANDS.map((data): CatalogEntry => ({ kind: "cli", data })),
];

function entryText(entry: CatalogEntry): string {
  switch (entry.kind) {
    case "agent":
      return [
        entry.data.name,
        entry.data.description,
        entry.data.phase,
        entry.data.tier,
        entry.data.model,
        entry.data.tools.join(" "),
      ]
        .join(" ")
        .toLowerCase();
    case "skill":
      return [entry.data.name, entry.data.triggersWhen, entry.data.category]
        .join(" ")
        .toLowerCase();
    case "hook":
      return [
        entry.data.file,
        entry.data.does,
        entry.data.event ?? "",
        entry.data.matcher ?? "",
        entry.data.kind,
      ]
        .join(" ")
        .toLowerCase();
    case "cli":
      return [
        entry.data.command,
        entry.data.args ?? "",
        entry.data.summary,
        entry.data.group,
      ]
        .join(" ")
        .toLowerCase();
  }
}

function entryKey(entry: CatalogEntry): string {
  switch (entry.kind) {
    case "agent":
      return `agent:${entry.data.slug}`;
    case "skill":
      return `skill:${entry.data.slug}`;
    case "hook":
      return `hook:${entry.data.slug}`;
    case "cli":
      return `cli:${entry.data.command}:${entry.data.args ?? ""}`;
  }
}

export function CatalogView() {
  const [activeKind, setActiveKind] = useState<ViewKind>("all");
  const [query, setQuery] = useState("");
  const [activePhase, setActivePhase] = useState<AgentPhase | "all">("all");
  const [activeTier, setActiveTier] = useState<AgentTier | "all">("all");

  const kinds: KindOption[] = [
    { key: "all", label: "All", count: ALL_ENTRIES.length },
    { key: "agent", label: "Agents", count: AGENTS.length },
    { key: "skill", label: "Skills", count: SKILLS.length },
    { key: "hook", label: "Hooks", count: HOOKS.length },
    { key: "cli", label: "CLI", count: CLI_COMMANDS.length },
  ];

  const results = useMemo(() => {
    let entries =
      activeKind === "all"
        ? ALL_ENTRIES
        : ALL_ENTRIES.filter((e) => e.kind === activeKind);

    if (activeKind === "agent") {
      entries = entries.filter((e) => {
        if (e.kind !== "agent") return false;
        if (activePhase !== "all" && e.data.phase !== activePhase) return false;
        if (activeTier !== "all" && e.data.tier !== activeTier) return false;
        return true;
      });
    }

    const q = query.trim().toLowerCase();
    if (q) {
      entries = entries.filter((e) => entryText(e).includes(q));
    }
    return entries;
  }, [activeKind, query, activePhase, activeTier]);

  return (
    <div className="flex flex-col gap-8">
      <CatalogFilters
        kinds={kinds}
        activeKind={activeKind}
        onKindChange={setActiveKind}
        query={query}
        onQueryChange={setQuery}
        showAgentFacets={activeKind === "agent"}
        phases={AGENT_PHASES}
        activePhase={activePhase}
        onPhaseChange={setActivePhase}
        tiers={AGENT_TIERS}
        activeTier={activeTier}
        onTierChange={setActiveTier}
      />

      <h2 className="sr-only">Results</h2>
      <p className="font-mono text-[12px] text-mut">
        {results.length} {results.length === 1 ? "result" : "results"}
      </p>

      {results.length === 0 ? (
        <div className="rounded-md border border-dashed border-hair bg-card p-10 text-center">
          <p className="text-mut">
            Nothing matches that. Try a different search or filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((entry) => (
            <CatalogCard key={entryKey(entry)} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
