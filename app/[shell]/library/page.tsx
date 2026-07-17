import type { Metadata } from "next";
import { CopyBlock } from "@/components/CopyBlock";
import { AGENTS, CATALOG_COUNTS } from "@/data/catalog";
import {
  AGENT_IDEAS,
  IDEA_GROUPS,
  ROLE_RECIPES,
  GAPS_PROMPT,
  ECC,
} from "@/data/library";

export const metadata: Metadata = {
  title: "Idea library",
  description:
    "The wider agent roster paw draws from: what ships in the box, plus dozens more worth building, with recipes to chain them and a prompt to find your own gaps.",
  alternates: { canonical: "/library" },
};

// Which library agents actually ship with paw today, matched by name against
// the catalog so the "in paw" tags never drift from the real kit.
const SHIPPED = new Set(AGENTS.map((a) => a.name));
const SHIPPED_COUNT = AGENT_IDEAS.filter((i) => SHIPPED.has(i.name)).length;
const TO_BUILD_COUNT = AGENT_IDEAS.length - SHIPPED_COUNT;

export default function LibraryPage() {
  return (
    <>
      <section className="wrap pb-10 pt-16">
        <span className="eyebrow">
          <span className="tick" />
          The idea library
        </span>
        <h1 className="mt-5 max-w-[760px] font-display text-[clamp(32px,5vw,54px)] font-extrabold leading-[1.02] tracking-[-0.02em]">
          Steal these agents.
        </h1>
        <p className="mt-4 max-w-[620px] text-[17px] text-mut">
          paw ships a core {CATALOG_COUNTS.agents} agents. This is the wider
          roster they come from: {AGENT_IDEAS.length} in all, the rest worth
          building yourself. Recipes to chain them, and a prompt to find the ones
          only you need. A menu, not a spec.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-y border-line py-4 font-mono text-[12px] text-mut">
          <span>{AGENT_IDEAS.length} AGENTS</span>
          <span>{SHIPPED_COUNT} SHIP WITH PAW</span>
          <span>{TO_BUILD_COUNT} TO BUILD</span>
        </div>
      </section>

      <section className="wrap pb-16">
        <h2 className="label">
          <span className="tick" />
          The roster
        </h2>
        <p className="mt-4 max-w-[640px] text-[15px] text-mut">
          Jobs worth handing to a narrow, well-scoped agent, grouped by where
          they earn their keep. The ones tagged{" "}
          <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mut">
            in paw
          </span>{" "}
          ship in the box. The rest are yours to build.
        </p>
        {IDEA_GROUPS.map((group) => {
          const ideas = AGENT_IDEAS.filter((i) => i.group === group);
          if (ideas.length === 0) return null;
          return (
            <div key={group} className="mt-10">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
                {group}
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ideas.map((idea) => {
                  const shipped = SHIPPED.has(idea.name);
                  return (
                    <div
                      key={idea.name}
                      className="rounded-lg border border-line bg-card p-5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[13px] font-semibold text-ink">
                          {idea.name}
                        </span>
                        {shipped && (
                          <span className="shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-mut">
                            in paw
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-[14px] leading-relaxed text-mut">
                        {idea.blurb}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      <section className="wrap pb-16">
        <h2 className="label">
          <span className="tick" />
          Recipes by role
        </h2>
        <p className="mt-4 max-w-[620px] text-[15px] text-mut">
          Chaining beats any single agent. A few starting points, one per hat you
          might wear. Read the arrows as "then".
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {ROLE_RECIPES.map((r) => (
            <div
              key={r.role}
              className="rounded-lg border border-line bg-card p-6"
            >
              <div className="flex items-center gap-2">
                <span className="text-[20px]" aria-hidden>
                  {r.icon}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
                  {r.role}
                </span>
              </div>
              <div className="mt-3 font-display text-[20px] font-bold leading-tight">
                {r.goal}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[12px]">
                {r.chain.map((step, i) => (
                  <span key={step} className="flex items-center gap-2">
                    <span className="rounded border border-line px-2 py-1 text-ink">
                      {step}
                    </span>
                    {i < r.chain.length - 1 && (
                      <span className="text-mut" aria-hidden>
                        →
                      </span>
                    )}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-mut">{r.how}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pb-16">
        <h2 className="label">
          <span className="tick" />
          Find your gaps
        </h2>
        <p className="mt-4 max-w-[640px] text-[15px] text-mut">
          The best agent to build next is the one that encodes a judgment you
          already make by hand. Paste this into Claude (or any capable model)
          pointed at your own work, and let it find them.
        </p>
        <div className="mt-5 max-w-[680px]">
          <CopyBlock code={GAPS_PROMPT} prose />
        </div>
      </section>

      <section className="wrap pb-24">
        <h2 className="label">
          <span className="tick" />
          Standing on shoulders
        </h2>
        <a
          href={ECC.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-5 block max-w-[680px] rounded-lg border border-line bg-card p-6 no-underline transition-colors hover:border-hair"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="font-display text-[22px] font-bold text-ink">
              {ECC.name}
            </span>
            <span className="font-mono text-[12px] text-mut">{ECC.handle}</span>
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-mut">
            {ECC.stats}
          </div>
          <p className="mt-3 text-[14.5px] leading-relaxed text-mut">
            Billed as {ECC.tagline}, it opened my eyes to what was possible and
            got this whole rabbit hole started. A good number of the ideas above
            trace straight back to it. Thank you.
          </p>
          <span className="mt-4 inline-block font-mono text-[12px] text-ink underline">
            github.com/affaan-m/ecc
          </span>
        </a>
      </section>
    </>
  );
}
