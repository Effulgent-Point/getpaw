import type { Metadata } from "next";
import Link from "next/link";
import { CopyBlock } from "@/components/CopyBlock";
import { GITHUB_URL } from "@/components/chrome/nav";

// AEO-friendly meta: the description answers "how do I build my own AI
// coding harness?" in one paragraph rather than pitching a product.
export const metadata: Metadata = {
  title: "Build your own agentic harness",
  description:
    "How to build your own agentic harness: start with mechanical hooks (git safety, secret scan), then encode doctrine as rules, then add narrow single-purpose agents, then chain them into pipelines. Deployment targets, corpus mining, and a step-by-step playbook.",
  alternates: { canonical: "/build-your-own" },
  openGraph: {
    title: "Build your own agentic harness: the playbook",
    description:
      "A step-by-step playbook: hooks first, then rules, then small agents, then orchestration. Corpus mining for a persona agent that reviews code in your voice.",
    url: "https://getpaw.dev/build-your-own",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build your own agentic harness: the playbook",
    description:
      "Hooks first, then rules, then small agents, then orchestration. The playbook we wish we had.",
  },
};

// Structured data. HowTo covers the step-by-step playbook (Google and
// Perplexity both surface HowTo in AI-synthesized answers). FAQPage covers
// the "what is X" reader questions. Article ties the metadata together.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://getpaw.dev/build-your-own#article",
      headline: "Build your own agentic harness",
      description:
        "A practical playbook for encoding your engineering doctrine into an AI harness of your own.",
      url: "https://getpaw.dev/build-your-own",
      author: { "@type": "Organization", name: "Effulgent Point" },
      publisher: {
        "@type": "Organization",
        name: "Effulgent Point",
        url: "https://effulgentpoint.com",
      },
      datePublished: "2026-08-26",
      dateModified: "2026-08-26",
      inLanguage: "en",
    },
    {
      "@type": "HowTo",
      "@id": "https://getpaw.dev/build-your-own#howto",
      name: "How to build your own agentic harness",
      description:
        "Encode your own engineering doctrine into an AI harness by layering hooks, rules, small agents, and orchestration.",
      totalTime: "P30D",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Enhance the basics first",
          text: "Encode git safety, secret scan, drift detection, and protected-branch guard as mechanical hooks. Cheap, unambiguous, and always-on. Do this before any LLM enters the picture.",
          url: "https://getpaw.dev/build-your-own#basics",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Walk through your day-to-day",
          text: "Journal for one week. Identify recurrent shapes. Rank by tedium times frequency. Automate the smallest slice first.",
          url: "https://getpaw.dev/build-your-own#day",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Point your LLM at your history",
          text: "Assemble a private corpus: two to three years of your git log, every PR you have authored, every review comment you have left. Feed the corpus and a distillation prompt to a capable model. Edit the output until it reads like you on your best day. Build a persona agent from it.",
          url: "https://getpaw.dev/build-your-own#corpus",
        },
        {
          "@type": "HowToStep",
          position: 4,
          name: "Slowly automate yourself",
          text: "Hooks first. Then doctrine files agents can read. Then small narrow agents. Then orchestration between agents. Then reusable skill bundles that multiple agents draw on.",
          url: "https://getpaw.dev/build-your-own#progressive",
        },
        {
          "@type": "HowToStep",
          position: 5,
          name: "Experiment, evaluate, pivot, update",
          text: "Every new capability lands behind a flag. Log outputs. Track false positive rate, false negative rate, latency, cost. Kill capabilities that fire more false positives than truth.",
          url: "https://getpaw.dev/build-your-own#lifecycle",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://getpaw.dev/build-your-own#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is an agentic harness?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "An agentic harness is the scaffolding around an LLM: enforced doctrine, deterministic hooks that fire on real events, agents with narrow scopes, gates that block bad work from moving forward, and audit trails that make every decision reconstructable a year later. The LLM is the engine; the harness is the vehicle.",
          },
        },
        {
          "@type": "Question",
          name: "Why build my own harness instead of using paw?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "paw is one reference implementation of the pattern, not the pattern itself. Your standards are yours. Nobody else's harness enforces how you review code, catches what you keep flagging, or writes rollback plans in your voice. Fork paw as a starting point or build from scratch.",
          },
        },
        {
          "@type": "Question",
          name: "What is the smallest useful first step?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A mechanical git-safety hook. No LLM. Block force-push to main, block commits to main directly, warn on rebase against published history. Ship it before you build anything smarter. The hook layer stabilizes the ground everything else sits on.",
          },
        },
        {
          "@type": "Question",
          name: "Can the harness work with multiple coding agents at once?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The agents, rules, and contexts stay the same; only the loader changes. Render every rule and agent to the format each IDE expects; keep the source of truth in one place.",
          },
        },
      ],
    },
  ],
};

// Escape "<" so no value in the static JSON-LD object can break out of the
// script element. Same technique as the site-wide graph in app/[shell]/layout.tsx.
const JSON_LD_HTML = JSON.stringify(JSON_LD).replace(/</g, "\\u003c");

// A prompt-ready block for the corpus-mining pass. Kept as a real script the
// reader can adapt, not marketing prose.
const CORPUS_PULL = `# 1) Your commit voice, condensed
git log --author="you@example.com" --since="2 years ago" \\
  --pretty=format:'%h %ad  %s%n%b%n---' --date=short \\
  > ~/corpus/commit-log.txt

# 2) Every PR you have authored (via gh)
gh pr list --author "@me" --state all --limit 500 \\
  --json number,title,body,createdAt,mergedAt,url \\
  > ~/corpus/prs.json

# 3) Every review comment you have left
gh api graphql -f query='
{ viewer { pullRequests(first: 100, states: [MERGED, CLOSED]) {
    nodes { number title comments(first: 50) {
      nodes { author { login } body createdAt } } } } } }' \\
  > ~/corpus/pr-comments.json`;

// The gaps-prompt tailored to the harness build (distinct from /library's
// agent-shape prompt; this one is looking for encoded doctrine, not agents).
const DOCTRINE_PROMPT = `You are reviewing my last two years of git commits, PR reviews, and PR bodies.

Extract:
1. Patterns I flag over and over as reviewer (bugs, smells, missing tests).
2. Standards I consistently enforce (naming, error handling, git hygiene).
3. Judgments I keep making by hand that could be a rule or a hook.
4. The tone and vocabulary I use when reviewing.

Output a doctrine file: 8 to 12 rules, each with a title, one paragraph of
"why", and a concrete example from the corpus. Match my voice. Do not invent
rules I have not demonstrated.`;

// A concrete example of what a persona agent's frontmatter looks like, so the
// reader has an anchor beyond "just write markdown."
const PERSONA_AGENT = `---
name: my-reviewer
description: >
  My personal code-review voice. Runs on every PR diff. Flags the
  patterns I catch by hand, in the tone I use, at the severity I use.
model: sonnet
tools: [Read, Grep, Glob]
phase: Review
tier: Read-only
---

# my-reviewer

You review code the way I do. When something I would flag appears,
you flag it with the same severity, the same reasoning, and the same
tone. When there is no issue, you say nothing.

## What I care about (extracted from my last 400 review comments)

- Silent fallbacks. If a call fails and the code returns a default
  instead of erroring, I always ask about the observability. Flag it.
- Off-by-one in pagination. I have caught this 11 times.
- Test names that describe implementation, not behavior.
- ...

## How I write review comments

- Direct. No hedging language.
- One issue per comment. Never a laundry list.
- Ask a question when I want the author to think; assert when I know.

## Output shape

Match the paw gate-output schema: id, severity, category, file, line,
message, required_change, acceptance_check. Categories I use:
silent-failure, edge-case, test-quality, naming, missing-observability.`;

const DEPLOY_TARGETS = [
  {
    label: "Personal laptop or Mac mini fleet",
    body: "Simplest case. Your harness runs where you code. Add a Tailscale mesh if you want to dispatch heavy runs to a spare machine. paw supports this out of the box; any harness that shells out to a local model or CLI can do the same.",
  },
  {
    label: "Enterprise day-job",
    body: "The base + overlay pattern. Fork the harness. Keep the base clean; put team-specific rules, agents, and hooks in overlays/team-name/. A loader with precedence rules picks overlay > base. Now every team has the same substrate with their own additions on top.",
  },
  {
    label: "Temporal / durable-execution",
    body: "The pipeline itself becomes a workflow. Phases become activities. Retries, timeouts, and cancellation come from the runtime, not your Python. The temporal-architect agent enforces determinism, activity boundaries, saga patterns, and versioning at review time.",
  },
  {
    label: "AWS / GCP / Azure only",
    body: "Compliance and cloud egress rules constrain what the harness can do. Bake those constraints into hooks: an egress-guard hook that blocks calls to non-approved hosts, an IaC-reviewer agent that catches drift. paw's enterprise-deployment context enumerates the tradeoffs per cloud.",
  },
  {
    label: "On-prem (TFS, TeamCity, self-hosted GitLab / Bitbucket)",
    body: "Air-gapped or near-air-gapped. Rules and hooks work fine; agent LLM calls need a plan for models that reach out. Pick between a hosted proxy inside the perimeter or self-hosted open models. Rest of the harness is unchanged.",
  },
  {
    label: "Azure DevOps cloud",
    body: "ADO's YAML pipelines call the harness the same way GitHub Actions does. paw ships a starter workflow file for ADO under ci-templates/. The interesting decisions here are usually about identity (managed identity, service principals) and secret handling.",
  },
  {
    label: "Cursor, Claude Code, Codex, or something else",
    body: "The agents, rules, and contexts stay the same; only the loader changes. paw's generate-cursor-rules renders every rule and agent as an .mdc file so Cursor sees exactly what Claude Code sees. If you add a third IDE, add a third renderer, keep the source of truth in one place.",
  },
  {
    label: "All of the above at once",
    body: "This is the honest case for most teams. paw's enterprise.* config section carries the target list; overlays declare which target they belong to; the CI templates land as starting points and get customized by owners of each system. The point is not one deployment; the point is that the harness is portable across all of them.",
  },
];

const BASICS = [
  {
    label: "Git safety",
    body: "No rebase against nested-agent commits (rebase silently overwrites work done by a parallel worktree). No force-push to main. No commits directly to main. Every one of these is a mechanical hook, not a review note.",
  },
  {
    label: "No rm in automation",
    body: "Use .back suffixes or a trash utility. The session end lists .back files for one explicit cleanup decision. Deletion is a human choice; the harness never makes it silently.",
  },
  {
    label: "No try / except / pass",
    body: "Silent swallowing is worse than failing loud. Every caught exception logs to a forensic path with the context and the intended recovery. No exceptions.",
  },
  {
    label: "Test-first for new capabilities",
    body: "New script: write the test that exercises it first. New hook: pipe a synthesized stdin payload and confirm the side effect before wiring settings.json. New agent: write the scenario in examples/ before the frontmatter.",
  },
  {
    label: "Every automation is auditable",
    body: "Every prompt that runs harness logic logs to .pipeline/prompts.jsonl. Every commit produced by an agent gets a .pipeline/commits/<sha>.json capture. If a future you cannot reconstruct why a change happened, the harness failed a duty.",
  },
];

const DAY_STEPS = [
  {
    n: "01",
    title: "Journal for one week",
    body: "Not a to-do list. Every meaningful task: what did you do, why, and what would have unblocked you 30 minutes earlier? Include the review comments you left, the incidents you chased, and the meetings you left annoyed. This is the raw material.",
  },
  {
    n: "02",
    title: "Identify the recurrent shapes",
    body: "Read the week back. Circle every phrase that starts with Every Monday, Every PR review I check X, Every incident I look at Y then Z. Those are the shapes. They are your automation candidates.",
  },
  {
    n: "03",
    title: "Rank by tedium times frequency",
    body: "High tedium plus high frequency wins. A quarterly boring thing is worth less than a daily annoying thing. Kill the daily thing first. Write the tedium score and the frequency in the journal so future-you can argue about it.",
  },
  {
    n: "04",
    title: "Automate the smallest slice",
    body: "Not automate my whole PR review. The smallest slice: automate grep for TODO by me on push, as a hook. Ship it. See if it fires. Iterate. The lesson is that shipping small automations teaches you what a bigger one needs.",
  },
];

const PROGRESSIVE = [
  {
    title: "Hooks first",
    body: "Encode git safety, secret scan, drift detection, protected-branch guard. Hooks are cheap, mechanical, and unambiguous. They catch what you would catch on autopilot. Ship these before any LLM enters the picture.",
  },
  {
    title: "Rules as text",
    body: "Doctrine files agents can read. Not one-liners; short essays with the reasoning. When the rule is wrong later, you can argue with it. paw keeps these under rules/; every rule has a why and an enforced-by pointer.",
  },
  {
    title: "Small narrow agents",
    body: "One PR-review dimension per agent. A silent-failure hunter. A test-name-quality checker. A dependency-license auditor. Least-privilege tools. Read-only until proven otherwise. Fifteen small agents beat one big one.",
  },
  {
    title: "Orchestrating agents",
    body: "Once you have small agents, chain them. An architect that emits a plan the planner reads. A gap detector that reads gate outputs and spawns follow-up work. Orchestration is where the pipeline shape shows up.",
  },
  {
    title: "Skills that bundle knowledge",
    body: "Skills are capability packs multiple agents draw on. paw ships one for git-safety, one for gate-output shape, one for intent tracking. When two agents need the same knowledge, extract it once.",
  },
  {
    title: "The end state",
    body: "The harness catches what you would catch. You review the diff, not the noise. Your tone survives every review. Your standards are enforced when you are on vacation.",
  },
];

const CORPUS_ITEMS = [
  "Two to three years of your git log, filtered to your commits.",
  "Every PR you have authored plus every PR review comment you have written.",
  "Your commit messages. They reveal what YOU consider shippable.",
  "Your outbox: emails you wrote, Slack or Teams messages you sent (careful of confidentiality, use a private subset).",
  "Confluence, Notion, or SharePoint pages you authored.",
  "Jira, Monday, Trello, or Linear tickets you closed with substantive summaries.",
  "Postmortems and incident retros you wrote or led.",
  "Design docs and RFCs where your comments moved the outcome.",
];

const LIFECYCLE = [
  {
    title: "Experiment",
    body: "Every new capability lands behind a flag or in a branch. Not shipped, not enabled by default. You want easy backouts.",
  },
  {
    title: "Evaluate",
    body: "Log outputs. Compare what the harness caught vs what a human review would have caught. Track false positive rate, false negative rate, latency, cost. Boring metrics, not vibes.",
  },
  {
    title: "Pivot",
    body: "Kill capabilities that fire more false positives than truth. Merge capabilities that overlap. Rewrite prompts that have drifted. Update rules that were wrong.",
  },
  {
    title: "Update",
    body: "The harness is never done. Neither is the person using it. Ship the next revision; the discipline is what compounds.",
  },
];

export default function BuildYourOwnPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON_LD_HTML }}
      />
      <article>
      {/* Hero */}
      <section id="hero" className="wrap pb-10 pt-16">
        <span className="eyebrow">
          <span className="tick" />
          The playbook
        </span>
        <h1 className="mt-5 max-w-[820px] font-display text-[clamp(34px,5.6vw,60px)] font-extrabold leading-[1.02] tracking-[-0.02em]">
          Build your own agentic harness.
        </h1>
        <hr className="spectral-rule my-8 max-w-[600px]" />
        <p className="max-w-[620px] text-[18px] leading-[1.6] text-mut">
          A harness is not an AI code assistant. It is the scaffolding, rules,
          hooks, gates, and memory that shape how AI agents work on YOUR code
          and YOUR process. paw is one implementation. You should have one of
          your own.
        </p>
        <p className="mt-4 max-w-[620px] text-[16px] leading-[1.65] text-mut">
          This page is a practical walkthrough, not a marketing blurb. It is the
          playbook we wish someone had handed us. Read it in order once, then
          come back to the sections that match where you are stuck.
        </p>
      </section>

      {/* What is an agentic harness */}
      <section className="wrap pb-12">
        <h2 className="label">
          <span className="tick" />
          What an agentic harness actually is
        </h2>
        <div className="mt-5 max-w-[720px] space-y-4 text-[16px] leading-[1.7] text-mut">
          <p>
            An LLM alone answers questions. An assistant integration adds editor
            context. A harness is what turns those two things into a system:
            enforced doctrine, deterministic hooks that fire on real events,
            agents with narrow scopes, gates that block bad work from moving
            forward, and audit trails that make every decision reconstructable a
            year later.
          </p>
          <p>
            The reason to build your own is not that paw is inadequate. The
            reason is that your standards are yours. Nobody else&apos;s harness
            enforces how <em>you</em> review code, catches what <em>you</em>{" "}
            keep flagging, or writes rollback plans in <em>your</em> voice. paw
            ships as a starting point that respects that. Fork it, delete what
            does not apply, and add what does.
          </p>
          <p>
            The rest of this page is how to get from &quot;my current
            workflow&quot; to &quot;a self-updating harness that catches what I
            would catch.&quot; It works whether your target is a personal
            laptop, a team fork, an enterprise deployment, or all of them at
            once.
          </p>
        </div>
      </section>

      {/* Deployment target matters */}
      <section className="wrap pb-16">
        <h2 className="label">
          <span className="tick" />
          Deployment target matters. Pick your combination.
        </h2>
        <p className="mt-5 max-w-[680px] text-[16px] leading-[1.65] text-mut">
          Where the harness runs shapes what it can do. Air-gapped teams cannot
          call hosted models the way a personal laptop can. Regulated clouds
          constrain egress. Different IDEs load rule files from different paths.
          Start with the target, then decide which pieces of the harness change
          to fit.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {DEPLOY_TARGETS.map((t) => (
            <div
              key={t.label}
              className="rounded-lg border border-line bg-card p-5"
            >
              <div className="font-display text-[17px] font-bold leading-tight">
                {t.label}
              </div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-mut">
                {t.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-[680px] text-[15px] leading-relaxed text-mut">
          paw carries an{" "}
          <code className="font-mono text-ink">enterprise.*</code> config
          section that names the target, an overlay convention for per-team
          divergence without base drift, and starter CI workflows for GitHub
          Actions, Azure DevOps, GitLab CI, and Jenkins. Whichever target you
          pick, you should not have to write the loader glue from scratch.
        </p>
      </section>

      {/* Enhance the basics first */}
      <section id="basics" className="wrap pb-16">
        <h2 className="label">
          <span className="tick" />
          Enhance the basics first
        </h2>
        <p className="mt-5 max-w-[680px] text-[16px] leading-[1.65] text-mut">
          Before automating anything with an LLM, encode the guardrails a senior
          engineer would insist on. These are not AI-specific. They are the
          substrate everything else sits on. If your harness cannot protect a
          git history, it cannot be trusted to review a diff.
        </p>
        <ul className="mt-8 space-y-5">
          {BASICS.map((b) => (
            <li
              key={b.label}
              className="rounded-lg border border-line bg-card p-5"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
                Basic
              </div>
              <div className="mt-1 font-display text-[18px] font-bold leading-tight">
                {b.label}
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-mut">
                {b.body}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[680px] text-[15px] leading-relaxed text-mut">
          paw&apos;s <code className="font-mono text-ink">hooks/</code> and{" "}
          <code className="font-mono text-ink">rules/</code> directories are
          what this looks like once it is encoded. Read them not as gospel but
          as one example of a doctrine that has been beaten on for a while.
        </p>
      </section>

      {/* Walk through YOUR day-to-day */}
      <section id="day" className="wrap pb-16">
        <h2 className="label">
          <span className="tick" />
          Walk through your day-to-day, step by step
        </h2>
        <p className="mt-5 max-w-[680px] text-[16px] leading-[1.65] text-mut">
          This is the core of the whole exercise. Every good harness starts with
          a written, honest inventory of what its owner actually does. Skip this
          step and you will build clever automations for problems you do not
          have.
        </p>
        <ol className="mt-8 space-y-5">
          {DAY_STEPS.map((s) => (
            <li key={s.n} className="rounded-lg border border-line bg-card p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[12px] tracking-widest text-mut">
                  {s.n}
                </span>
                <span className="font-display text-[18px] font-bold leading-tight">
                  {s.title}
                </span>
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-mut">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Slowly automate yourself */}
      <section id="progressive" className="wrap pb-16">
        <h2 className="label">
          <span className="tick" />
          Slowly automate yourself
        </h2>
        <p className="mt-5 max-w-[680px] text-[16px] leading-[1.65] text-mut">
          Order matters. Skipping the mechanical hook layer and jumping straight
          to a general-purpose review agent is how people end up disappointed
          and blaming the LLM. The layers below stack; earlier ones stabilize
          the ground for later ones.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {PROGRESSIVE.map((p, i) => (
            <div
              key={p.title}
              className="rounded-lg border border-line bg-card p-5"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
                Layer {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-1 font-display text-[18px] font-bold leading-tight">
                {p.title}
              </div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-mut">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Point your LLM at your history */}
      <section id="corpus" className="wrap pb-16">
        <h2 className="label">
          <span className="tick" />
          Point your LLM at your history
        </h2>
        <p className="mt-5 max-w-[680px] text-[16px] leading-[1.65] text-mut">
          The harness that sounds like you is trained on you. Not with fancy
          fine-tuning. With a corpus you pull yourself and a prompt that asks
          the model to distill it. Cheap, private, and effective.
        </p>

        <h3 className="mt-8 font-display text-[20px] font-bold leading-tight">
          The corpus
        </h3>
        <p className="mt-2 max-w-[680px] text-[15px] leading-relaxed text-mut">
          Assemble a private folder. This is not for training weights. It is for
          a single long prompt or a retrieval index the persona agent reads at
          review time. Suggested content:
        </p>
        <ul className="mt-4 max-w-[680px] space-y-2 text-[15px] leading-relaxed text-mut">
          {CORPUS_ITEMS.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                aria-hidden="true"
                className="mt-2 inline-block h-[6px] w-[6px] shrink-0 rounded-full bg-sp3"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-10 font-display text-[20px] font-bold leading-tight">
          A starting script
        </h3>
        <p className="mt-2 max-w-[680px] text-[15px] leading-relaxed text-mut">
          For git-centric work, three commands get you 80 percent of the way.
          Adapt to your host and comment conventions.
        </p>
        <div className="mt-4 max-w-[720px]">
          <CopyBlock code={CORPUS_PULL} />
        </div>

        <h3 className="mt-10 font-display text-[20px] font-bold leading-tight">
          The distillation prompt
        </h3>
        <p className="mt-2 max-w-[680px] text-[15px] leading-relaxed text-mut">
          Feed the corpus and this prompt to any capable model. The output is
          your first doctrine draft. Edit it by hand until it reads like you on
          your best day.
        </p>
        <div className="mt-4 max-w-[720px]">
          <CopyBlock code={DOCTRINE_PROMPT} prose />
        </div>

        <h3 className="mt-10 font-display text-[20px] font-bold leading-tight">
          Build a persona agent from it
        </h3>
        <p className="mt-2 max-w-[680px] text-[15px] leading-relaxed text-mut">
          Now write an agent whose &quot;role&quot; section is distilled from
          the corpus. Same frontmatter format paw uses, so you can swap it into
          paw&apos;s pipeline directly if you like the fit. The example below is
          a skeleton; fill in the ellipses from what your corpus taught the
          model about you.
        </p>
        <div className="mt-4 max-w-[720px]">
          <CopyBlock code={PERSONA_AGENT} />
        </div>
        <p className="mt-4 max-w-[680px] text-[14.5px] leading-relaxed text-mut">
          The agent-file format lives in{" "}
          <a
            href={`${GITHUB_URL}/blob/main/agents/README.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            paw&apos;s agents/README.md
          </a>
          . Every field has a doc entry. If you copy paw&apos;s frontmatter
          shape, the same agent runs in Claude Code and in Cursor without a
          rewrite.
        </p>
      </section>

      {/* Piece by piece, then group */}
      <section className="wrap pb-16">
        <h2 className="label">
          <span className="tick" />
          Piece by piece, then group
        </h2>
        <div className="mt-5 max-w-[720px] space-y-4 text-[16px] leading-[1.7] text-mut">
          <p>
            Once you have three or four small automated pieces, resist the urge
            to build one giant orchestrator. Start intentionally chaining what
            you have. paw calls this pattern &quot;pipeline phases&quot;:
            architect emits a plan; planner reads it; gates read the diff; a gap
            detector reads the gate output; a builder reads the gap. Each phase
            has a clear input, a clear output, and a clear failure mode.
          </p>
          <p>
            Group the phases into workflows. paw calls these <em>commands</em>{" "}
            and ships them under{" "}
            <code className="font-mono text-ink">commands/</code>. A command is
            a named recipe: <em>/paw ship</em> runs plan then build then review
            then merge, in order. If a step fails, the whole command halts and
            preserves forensics for you to look at.
          </p>
          <p>
            Add gates that block bad output from moving forward. A gate is not
            an agent; a gate is the piece that decides whether the agent output
            should stop the pipeline. Severity levels help: <em>critical</em>{" "}
            blocks ship, <em>warning</em> annotates the diff, <em>info</em>{" "}
            logs. Structured findings with ids let you re-verify by id after a
            fix. paw&apos;s gate-output schema is a reference; the shape matters
            more than the exact fields.
          </p>
          <p>
            Add hooks that fire on lifecycle events: pre-commit, post-merge,
            on-Stop, when the base branch drifts, when the session ends. Hooks
            are where mechanical enforcement lives. LLMs are for judgment; hooks
            are for math.
          </p>
        </div>
      </section>

      {/* Experiment, evaluate, pivot, update */}
      <section id="lifecycle" className="wrap pb-16">
        <h2 className="label">
          <span className="tick" />
          Experiment, evaluate, pivot, update
        </h2>
        <p className="mt-5 max-w-[680px] text-[16px] leading-[1.65] text-mut">
          The harness is a living system. Treat every capability as a
          hypothesis. paw runs its own QA fan-out against itself on a schedule;
          the last one caught three critical bugs and about ten warnings that
          had shipped through TDD and per-PR review. That is not embarrassing;
          that is the loop working.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {LIFECYCLE.map((l, i) => (
            <div
              key={l.title}
              className="rounded-lg border border-line bg-card p-5"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-mut">
                Step {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-1 font-display text-[20px] font-bold leading-tight">
                {l.title}
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-mut">
                {l.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Fork paw, or don't */}
      <section className="wrap pb-24">
        <div className="rounded-lg border border-line bg-card p-8">
          <span className="eyebrow">
            <span className="tick" />
            Fork paw, or don&apos;t
          </span>
          <h2 className="mt-3 max-w-[640px] font-display text-[clamp(22px,3vw,30px)] font-extrabold leading-[1.05] tracking-[-0.01em]">
            paw is MIT licensed and built to be forked.
          </h2>
          <div className="mt-4 max-w-[680px] space-y-3 text-[15.5px] leading-relaxed text-mut">
            <p>
              If you want a starting point, fork it. Delete the agents that do
              not apply. Add the persona agent your corpus taught you to write.
              Point the loader at your rules directory. The base plus overlay
              convention keeps team customizations from drifting the base.
            </p>
            <p>
              If you want a reference, read it. paw&apos;s{" "}
              <code className="font-mono text-ink">hooks/</code>,{" "}
              <code className="font-mono text-ink">rules/</code>,{" "}
              <code className="font-mono text-ink">agents/</code>, and{" "}
              <code className="font-mono text-ink">skills/</code> are all small,
              readable, and self-contained. Steal patterns, ignore the rest.
            </p>
            <p>
              If you build something worth sharing back, we would love a PR.
              Contributing guide is in the repo.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              className="btn"
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Fork on GitHub
            </a>
            <Link className="btn line" href="/library">
              Steal from the roster
            </Link>
            <Link className="btn line" href="/catalog">
              Read the catalog
            </Link>
          </div>
        </div>
      </section>
      </article>
    </>
  );
}
