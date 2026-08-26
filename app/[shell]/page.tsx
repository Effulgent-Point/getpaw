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

// Recent, concrete shipments. Kept short and specific; long enough to answer
// "what has actually changed since I last looked" without turning the home
// page into a changelog.
const RECENT = [
  {
    tag: "Playbook",
    title: "Build your own agentic harness",
    body: "A new practical walkthrough for encoding your own doctrine, deployment targets, and persona agent. It is the page we wish someone had handed us before we started. Read it in order once, come back to the sections that match where you are stuck.",
  },
  {
    tag: "Kit",
    title: "18 agents, 4 hooks, 7 skill bundles",
    body: "The catalog page enumerates the current kit end to end. Each agent card carries its phase and permission tier so you can see, at a glance, which ones can only look and which ones can write.",
  },
  {
    tag: "Learn",
    title: "Nine-track hosted tutorial",
    body: "The browser walkthrough matches the CLI walkthrough one to one. Learn paw, agents, hooks, rules, the CLI, workflows, terminology, contributing, and the practice buggy app. Generated from a single source so the two never drift.",
  },
  {
    tag: "Discovery",
    title: "Idea library and the wider roster",
    body: "The /library page lays out the wider agent roster paw draws from, with in-paw tags on the ones that ship in the box and recipes to chain them. A menu to steal from, not a spec.",
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
          An open-source Personal Agent Workforce: standards that are enforced,
          not suggested, {CATALOG_COUNTS.agents} specialized agents,{" "}
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
          <code className="font-mono text-ink">paw tutorial --web</code>. Then
          run <code className="font-mono text-ink">paw init</code> inside a
          project to opt into the gates that make sense for the stack.
        </p>
      </section>

      <section className="wrap pb-16">
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

      <section className="wrap pb-16">
        <h2 className="label">
          <span className="tick" />
          Shipped recently
        </h2>
        <p className="mt-4 max-w-[620px] text-[15.5px] text-mut">
          paw is a moving target on purpose. Here is what landed on main in the
          last few arcs, and why each one earned its keep.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {RECENT.map((r) => (
            <div
              key={r.title}
              className="rounded-lg border border-line bg-card p-5"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
                {r.tag}
              </div>
              <div className="mt-2 font-display text-[18px] font-bold leading-tight">
                {r.title}
              </div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-mut">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pb-24">
        <div className="rounded-lg border border-line bg-card p-8">
          <span className="eyebrow">
            <span className="tick" />
            New
          </span>
          <h2 className="mt-3 max-w-[640px] font-display text-[clamp(24px,3.4vw,34px)] font-extrabold leading-[1.05] tracking-[-0.01em]">
            Build your own agentic harness.
          </h2>
          <p className="mt-3 max-w-[600px] text-[15.5px] leading-relaxed text-mut">
            paw is one implementation of a pattern, not the pattern itself. If
            you want to encode your own doctrine, your own hooks, and your own
            agents around your day-to-day, we wrote the playbook we wish we had.
            Deployment targets, corpus mining, when to encode a rule vs spawn an
            agent, all of it.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn" href="/build-your-own">
              Read the playbook
            </Link>
            <Link className="btn line" href="/library">
              Steal from the roster
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
