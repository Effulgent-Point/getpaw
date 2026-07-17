import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { CATALOG_COUNTS } from "@/data/catalog";
import { CopyBlock } from "@/components/CopyBlock";
import { GITHUB_URL } from "@/components/chrome/nav";
import { PawTerminal } from "@/components/ui/PawTerminal";
import { StarCount } from "@/components/ui/StarCount";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const INSTALL = `git clone https://github.com/Effulgent-Point/paw.git ~/paw
cd ~/paw
./paw setup`;

const PILLARS = [
  {
    n: CATALOG_COUNTS.agents,
    label: "specialized agents",
    body: "An architect, a planner, a builder, reviewers, and more, each with a narrow job and the right permissions.",
  },
  {
    n: CATALOG_COUNTS.skills,
    label: "skill bundles",
    body: "Reusable capability packs your agent loads on demand, from git doctrine to test-first workflows.",
  },
  {
    n: CATALOG_COUNTS.hooks,
    label: "enforcement hooks",
    body: "Gates that fire on real events, so standards are enforced by the tooling, not left to good intentions.",
  },
];

export default function Home() {
  return (
    <>
      <section className="wrap py-20">
        <span className="eyebrow">
          <span className="tick" />
          Personal Agent Workforce
        </span>
        <h1 className="mt-5 max-w-[820px] font-display text-[clamp(38px,7vw,74px)] font-extrabold leading-[0.98] tracking-[-0.02em]">
          Your agent writes code fast.
          <br />
          <span className="text-mut">paw makes it write code right.</span>
        </h1>
        <hr className="spectral-rule my-8 max-w-[600px]" />
        <p className="max-w-[540px] text-[19px] text-mut">
          An open-source Personal Agent Workforce: standards that are enforced not
          suggested, {CATALOG_COUNTS.agents} specialized agents, {" "}
          {CATALOG_COUNTS.skills} skill bundles, git guardrails, and a CLI.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="btn" href="/tutorial">
            Try the tutorial
          </Link>
          <Link className="btn line" href="/catalog">
            Browse the catalog
          </Link>
          <a
            className="btn line"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Star on GitHub
            <Suspense fallback={null}>
              <StarCount />
            </Suspense>
          </a>
        </div>
      </section>

      <section className="wrap pb-10">
        <PawTerminal />
      </section>

      <section className="wrap pb-6">
        <div className="flex flex-wrap gap-x-8 gap-y-2 border-y border-line py-4 font-mono text-[12px] text-mut">
          <span>{CATALOG_COUNTS.agents} AGENTS</span>
          <span>{CATALOG_COUNTS.skills} SKILLS</span>
          <span>{CATALOG_COUNTS.hooks} HOOKS</span>
          <span>{CATALOG_COUNTS.cli} CLI COMMANDS</span>
        </div>
      </section>

      <section className="wrap pb-16 pt-8">
        <h2 className="label">
          <span className="tick" />
          Install in under a minute
        </h2>
        <div className="mt-5 max-w-[620px]">
          <CopyBlock code={INSTALL} />
        </div>
        <p className="mt-4 text-[15px] text-mut">
          Try the polished walkthrough here on the{" "}
          <Link href="/tutorial" className="underline">
            hosted tutorial
          </Link>
          , or run it locally after install with{" "}
          <code className="font-mono text-ink">paw tutorial --web</code>.
        </p>
      </section>

      <section className="wrap pb-24">
        <h2 className="label">
          <span className="tick" />
          What is in the kit
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {PILLARS.map((p) => (
            <Link
              key={p.label}
              href="/catalog"
              className="group rounded-lg border border-line bg-card p-6 no-underline transition-colors hover:border-hair"
            >
              <div className="font-display text-[40px] font-extrabold leading-none">
                {p.n}
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
                {p.label}
              </div>
              <p className="mt-3 text-[14.5px] text-mut">{p.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
