import type { Metadata } from "next";
import { CATALOG_COUNTS } from "@/data/catalog";
import { CatalogView } from "@/components/catalog/CatalogView";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse the paw kit: 54 specialized agents, 22 doctrine rules, 8 skill bundles, 9 hooks, and a 15-command CLI. Search everything, or filter agents by phase and permission tier.",
  alternates: { canonical: "/catalog" },
};

export default function CatalogPage() {
  return (
    <>
      <section className="wrap pb-10 pt-16">
        <span className="eyebrow">
          <span className="tick" />
          The paw catalog
        </span>
        <h1 className="mt-5 max-w-[760px] font-display text-[clamp(32px,5vw,54px)] font-extrabold leading-[1.02] tracking-[-0.02em]">
          Everything in the kit.
        </h1>
        <p className="mt-4 max-w-[560px] text-[17px] text-mut">
          Every agent, skill, hook, and command paw ships, pulled straight from
          the source. Search it, or filter the agents by phase and permission
          tier.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-y border-line py-4 font-mono text-[12px] text-mut">
          <span>{CATALOG_COUNTS.agents} AGENTS</span>
          <span>{CATALOG_COUNTS.skills} SKILLS</span>
          <span>{CATALOG_COUNTS.hooks} HOOKS</span>
          <span>{CATALOG_COUNTS.cli} CLI COMMANDS</span>
        </div>
      </section>

      <section className="wrap pb-24">
        <CatalogView />
      </section>
    </>
  );
}
