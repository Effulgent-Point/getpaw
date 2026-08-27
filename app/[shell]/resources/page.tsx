import type { Metadata } from "next";
import Link from "next/link";

// AEO-friendly meta: a direct answer, not a "learn about" pitch. The
// description reads as a standalone reply to "what should I read to build an
// agentic harness."
export const metadata: Metadata = {
  title: "Resources",
  description:
    "A curated reading list for building agentic harnesses: coding-agent IDEs (Cursor, Claude Code, Codex, Aider, OpenHands), agent-design primers (ReAct, Anthropic's building-effective-agents), and durable-execution runtimes (Temporal, Restate, DBOS) that act as harnesses of their own.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Resources for building agentic harnesses",
    description:
      "Curated, verified links to coding-agent IDEs, agent-design papers, and durable-execution runtimes. What each is, and when you would pick it.",
    url: "https://getpaw.dev/resources",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resources for building agentic harnesses",
    description:
      "Coding-agent IDEs, agent-design papers, and durable-execution runtimes. What each is, and when you would pick it.",
  },
};

// Every URL in this page is verified live at publish time. If a link cannot
// be verified, it does not ship. The reader should never hit a dead doc from
// a page whose whole job is to be a curated index.
type Resource = {
  name: string;
  url: string;
  what: string;
  when: string;
};

const IDES: Resource[] = [
  {
    name: "Cursor",
    url: "https://cursor.com/docs",
    what: "IDE fork of VS Code with a first-class agent panel, plan mode, and .cursor/rules for persistent per-project guidance.",
    when: "You want an editor-native agent with strong keyboard workflow and shared team rules under version control.",
  },
  {
    name: "Cursor Rules",
    url: "https://cursor.com/docs/context/rules",
    what: "The rules system: project rules in .cursor/rules/*.mdc, user rules, team rules, and AGENTS.md fallback, with glob-scoped activation.",
    when: "You already write Cursor and want to encode standards the agent applies every session without reminding it.",
  },
  {
    name: "Claude Code",
    url: "https://code.claude.com/docs/",
    what: "Anthropic's terminal, IDE, desktop, and web coding agent. Reads the codebase, edits files, runs commands, and integrates with git.",
    when: "You want an agent that operates across surfaces (CLI, VS Code, JetBrains, browser) with the same session, hooks, and skills.",
  },
  {
    name: "Claude Agent SDK",
    url: "https://code.claude.com/docs/en/agent-sdk/overview",
    what: "Python and TypeScript library for building custom agents on top of Claude Code's agent loop, tools, hooks, subagents, and permissions.",
    when: "You are past interactive use and want to embed the agent loop in your own process, service, or CI.",
  },
  {
    name: "GitHub Copilot",
    url: "https://docs.github.com/en/copilot",
    what: "GitHub's in-editor assistant plus Copilot Chat, code review, and custom agents that run in the browser and IDE.",
    when: "You live inside GitHub Enterprise, need SSO / audit / policy controls, and want an agent wired directly into PRs and Actions.",
  },
  {
    name: "OpenAI Codex CLI",
    url: "https://github.com/openai/codex",
    what: "Open-source terminal coding agent from OpenAI. Runs locally with your ChatGPT account, with IDE integrations for VS Code, Cursor, and Windsurf.",
    when: "You are on the OpenAI stack and want a CLI-first agent without leaving your terminal.",
  },
  {
    name: "Aider",
    url: "https://aider.chat/docs/",
    what: "Open-source terminal pair programmer. Model-agnostic, git-aware, auto-commits every change with a descriptive message.",
    when: "You want a minimal, script-friendly agent that treats git as the ledger and works with any capable model.",
  },
  {
    name: "OpenHands",
    url: "https://github.com/All-Hands-AI/OpenHands",
    what: "Open-source self-hosted agent runtime (formerly OpenDevin). Runs Claude Code, Codex, Gemini, or its own agents against local, remote, or cloud backends.",
    when: "You need a multi-agent control plane you can host yourself, wire into Slack, GitHub, or Linear, and trigger on a schedule.",
  },
];

const AGENT_DESIGN: Resource[] = [
  {
    name: "Building effective agents (Anthropic)",
    url: "https://www.anthropic.com/engineering/building-effective-agents",
    what: "The reference primer on agent patterns: augmented LLMs, prompt chaining, routing, parallelization, orchestrator-worker, evaluator-optimizer, and autonomous loops.",
    when: "You are about to reach for a framework. Read this first. Most of what you need is a small composition of the patterns here.",
  },
  {
    name: "A harness for every task (Claude)",
    url: "https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code",
    what: "How the Claude Code team frames dynamic multi-agent workflows: fan-out-and-synthesize, adversarial verification, tournaments, loop-until-done, generate-and-filter.",
    when: "You already have a working single-agent flow and are asking whether it is time to orchestrate multiple.",
  },
  {
    name: "ReAct: Reasoning and Acting in LMs (arXiv)",
    url: "https://arxiv.org/abs/2210.03629",
    what: "The paper that popularized interleaving reasoning traces with tool-use actions. The foundation nearly every agent loop still reflects.",
    when: "You want to understand why agent loops are shaped the way they are before you go designing a new one.",
  },
  {
    name: "OpenAI Agents SDK",
    url: "https://openai.github.io/openai-agents-python/",
    what: "OpenAI's lightweight agent framework: agents, tools, sandboxes, realtime and voice variants, guardrails. Small surface area, fast to read.",
    when: "You want a minimal building block from the OpenAI side, without pulling in a heavier orchestration graph.",
  },
  {
    name: "LangGraph (LangChain)",
    url: "https://docs.langchain.com/oss/python/langgraph/graph-api",
    what: "State + nodes + edges. A message-passing graph model for building durable, controllable multi-step agent workflows with checkpointing and streaming.",
    when: "Your agent has enough branching, retries, and human-in-the-loop pauses that you want a real graph runtime holding it together.",
  },
  {
    name: "LangChain agents",
    url: "https://docs.langchain.com/oss/python/langchain/agents",
    what: "The classic model-calls-tools-in-a-loop building block, now recommended for smaller flows before you graduate to LangGraph.",
    when: "You want the shortest path from a working prompt to a tool-using agent inside an existing LangChain project.",
  },
];

const HARNESS: Resource[] = [
  {
    name: "Temporal for AI",
    url: "https://temporal.io/solutions/ai",
    what: "Durable execution runtime pitched as the orchestrator for AI applications. Long-running sessions survive crashes, retries, and rate limits by replaying journaled steps.",
    when: "Your agent needs to run for hours or days, pause for human approval, and resume after any kind of failure without losing state.",
  },
  {
    name: "Temporal AI cookbook",
    url: "https://docs.temporal.io/ai-cookbook/openai-agents-sdk-python",
    what: "Concrete recipe: OpenAI Agents SDK activities wrapped as Temporal tools, so your agent loop inherits deterministic replay and structured retries.",
    when: "You already know Temporal and want to plug an agent SDK into it without inventing your own activity boundaries.",
  },
  {
    name: "Restate",
    url: "https://restate.dev/",
    what: "Single-binary durable execution and virtual-object runtime. Ships as its own agent runtime with memory, human-in-the-loop pauses, and long-running tasks.",
    when: "You want durable execution without operating a full workflow cluster, and you like the actor / virtual-object model for agent state.",
  },
  {
    name: "DBOS",
    url: "https://docs.dbos.dev/",
    what: "Open-source durable execution library that hooks into Postgres. Native integrations with Pydantic AI, LlamaIndex, and the OpenAI Agents SDK.",
    when: "Your stack is already Postgres-centric and you want durable workflows without a separate orchestration service.",
  },
];

// The llms.txt convention is worth calling out on its own, since it sits
// underneath everything on this page and most readers have not encountered
// it yet.
const LLMS_TXT_URL = "https://llmstxt.org/";

// Structured data for AEO: an ItemList of the resource sections plus an
// Article wrapper. FAQPage covers the "what is X" reader questions. Google
// AI Overviews and Perplexity both bias toward structured question-answer
// content when synthesizing answers. Same static-object escape pattern as
// app/[shell]/layout.tsx.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://getpaw.dev/resources#article",
      headline: "Resources for building agentic harnesses",
      description:
        "Curated links to coding-agent IDEs, agent-design papers, and durable-execution runtimes, with a one-line what and a one-line when you would pick it.",
      url: "https://getpaw.dev/resources",
      author: { "@type": "Organization", name: "Effulgent Point" },
      publisher: {
        "@type": "Organization",
        name: "Effulgent Point",
        url: "https://effulgentpoint.com",
      },
      datePublished: "2026-08-26",
      dateModified: "2026-08-26",
      inLanguage: "en",
      about: [
        "AI coding agents",
        "Agentic harness",
        "Durable execution",
        "LLM tool use",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://getpaw.dev/resources#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is an agentic harness?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "An agentic harness is the scaffolding around an LLM: rules, hooks, gates, memory, permissions, and multi-agent orchestration. The LLM is the engine; the harness is the vehicle. A harness turns a capable model into a reliable teammate by encoding your standards and enforcing them mechanically.",
          },
        },
        {
          "@type": "Question",
          name: "Which AI coding IDE should I pick?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Pick Cursor for an editor-native agent with .cursor/rules for team standards. Pick Claude Code for a multi-surface agent (CLI, IDE, desktop, web) with hooks, skills, and subagents. Pick GitHub Copilot if you live inside GitHub Enterprise. Pick OpenAI Codex CLI or Aider for terminal-first workflows. Pick OpenHands to self-host a multi-agent runtime.",
          },
        },
        {
          "@type": "Question",
          name: "What is durable execution and why does it matter for agents?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Durable execution is a runtime pattern in which every step of a workflow is journaled so the workflow can resume exactly where it left off after a crash, restart, or rate limit. For agents this matters because long-running loops call flaky tools, hit quota, and pause for human approval. Temporal, Restate, and DBOS are three production-grade options.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need a framework to build an agent?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Anthropic's Building Effective Agents post explicitly recommends against reaching for a framework by default. Start with a simple loop: model calls tools, tools return results, loop continues until the model signals completion. Add a framework only when you have a specific gap it fills (durable execution, graph-shaped control flow, cross-agent handoff).",
          },
        },
        {
          "@type": "Question",
          name: "What is llms.txt?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "llms.txt is an emerging convention (analogous to robots.txt) that publishes a plain-text summary of a site aimed at LLM crawlers and AI answer engines. It lives at /llms.txt and points at the pages worth indexing. This site publishes one.",
          },
        },
      ],
    },
  ],
};

// A resource card list, styled to match /build-your-own and /library.
function ResourceGrid({ items }: { items: Resource[] }) {
  return (
    <ul className="mt-8 grid gap-4 md:grid-cols-2">
      {items.map((r) => (
        <li key={r.url} className="rounded-lg border border-line bg-card p-5">
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[17px] font-bold leading-tight underline decoration-hair underline-offset-4 hover:decoration-ink"
          >
            {r.name}
          </a>
          <p className="mt-2 text-[14.5px] leading-relaxed text-mut">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-mut">
              What
            </span>
            <br />
            {r.what}
          </p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-mut">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-mut">
              When you would pick it
            </span>
            <br />
            {r.when}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function ResourcesPage() {
  return (
    <>
      {/* Static structured-data object; the "<" replace matches the pattern in
          app/[shell]/layout.tsx and keeps a value from breaking out of the
          script element. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
        }}
      />

      <article>
        {/* Hero. The h1 answers "what is this page?" in a single sentence so
            AI answer engines can lift it cleanly. */}
        <section className="wrap pb-10 pt-16">
          <span className="eyebrow">
            <span className="tick" />
            The reading list
          </span>
          <h1 className="mt-5 max-w-[820px] font-display text-[clamp(34px,5.6vw,60px)] font-extrabold leading-[1.02] tracking-[-0.02em]">
            Resources for building an agentic harness.
          </h1>
          <hr className="spectral-rule my-8 max-w-[600px]" />
          <p className="max-w-[640px] text-[18px] leading-[1.6] text-mut">
            A curated, verified list. Each link has a one-line{" "}
            <em>what it is</em> and a one-line <em>when you would pick it</em>.
            No rankings, no editorial hype. If a link is not on this page, it is
            because we could not verify it resolves.
          </p>
          <p className="mt-4 max-w-[640px] text-[15.5px] leading-[1.65] text-mut">
            Last verified <time dateTime="2026-08-26">August 26, 2026</time>.
            The list is grouped by what you are trying to do: pick a coding IDE
            for daily work, learn the shape of a good agent, or add durable
            execution underneath a long-running loop.
          </p>
        </section>

        {/* Section 1: IDE + agent tooling */}
        <section id="ides" className="wrap pb-16">
          <h2 className="label">
            <span className="tick" />
            Coding-agent IDEs and CLIs
          </h2>
          <p className="mt-5 max-w-[720px] text-[16px] leading-[1.65] text-mut">
            The tools that put an agent inside your editor or terminal. Pick one
            for daily work; nothing on this page assumes a particular choice.
            The harness pattern is portable across all of them, and the{" "}
            <Link href="/build-your-own" className="underline">
              build-your-own playbook
            </Link>{" "}
            explains how.
          </p>
          <ResourceGrid items={IDES} />
        </section>

        {/* Section 2: how to think about agents */}
        <section id="agent-design" className="wrap pb-16">
          <h2 className="label">
            <span className="tick" />
            Building agents: concepts and walkthroughs
          </h2>
          <p className="mt-5 max-w-[720px] text-[16px] leading-[1.65] text-mut">
            The papers and posts that explain <em>why</em> agent loops are
            shaped the way they are. Read at least the first two before you
            reach for a framework.
          </p>
          <ResourceGrid items={AGENT_DESIGN} />
        </section>

        {/* Section 3: the meta-layer, harness patterns */}
        <section id="harness" className="wrap pb-16">
          <h2 className="label">
            <span className="tick" />
            Harness patterns and durable execution
          </h2>
          <p className="mt-5 max-w-[720px] text-[16px] leading-[1.65] text-mut">
            An agent that runs for five minutes is a script. An agent that runs
            for five hours is a workflow. These runtimes handle the second case:
            journaled steps, deterministic replay, human-in-the-loop pauses,
            structured retries. Any of them can act as the outer harness around
            an LLM loop.
          </p>
          <ResourceGrid items={HARNESS} />
        </section>

        {/* AEO-friendly Q/A section — the questions map 1:1 to the FAQPage
            JSON-LD above, so the on-page copy and the structured data agree. */}
        <section id="faq" className="wrap pb-16">
          <h2 className="label">
            <span className="tick" />
            Quick answers
          </h2>
          <p className="mt-5 max-w-[680px] text-[16px] leading-[1.65] text-mut">
            The five questions readers land on this page asking, answered in one
            paragraph each.
          </p>
          <dl className="mt-8 space-y-6">
            <div className="rounded-lg border border-line bg-card p-5">
              <dt className="font-display text-[17px] font-bold leading-tight">
                What is an agentic harness?
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-mut">
                The scaffolding around an LLM: rules, hooks, gates, memory,
                permissions, and multi-agent orchestration. The LLM is the
                engine; the harness is the vehicle. A harness turns a capable
                model into a reliable teammate by encoding your standards and
                enforcing them mechanically.
              </dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-5">
              <dt className="font-display text-[17px] font-bold leading-tight">
                Which AI coding IDE should I pick?
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-mut">
                Pick Cursor for an editor-native agent with{" "}
                <code className="font-mono text-ink">.cursor/rules</code> for
                team standards. Pick Claude Code for a multi-surface agent (CLI,
                IDE, desktop, web) with hooks, skills, and subagents. Pick
                GitHub Copilot if you live inside GitHub Enterprise. Pick OpenAI
                Codex CLI or Aider for terminal-first workflows. Pick OpenHands
                to self-host a multi-agent runtime.
              </dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-5">
              <dt className="font-display text-[17px] font-bold leading-tight">
                What is durable execution and why does it matter for agents?
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-mut">
                A runtime pattern in which every step of a workflow is journaled
                so the workflow can resume exactly where it left off after a
                crash, restart, or rate limit. For agents this matters because
                long-running loops call flaky tools, hit quota, and pause for
                human approval. Temporal, Restate, and DBOS are three
                production-grade options.
              </dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-5">
              <dt className="font-display text-[17px] font-bold leading-tight">
                Do I need a framework to build an agent?
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-mut">
                No. Anthropic&apos;s{" "}
                <a
                  href="https://www.anthropic.com/engineering/building-effective-agents"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Building Effective Agents
                </a>{" "}
                post explicitly recommends against reaching for a framework by
                default. Start with a simple loop: model calls tools, tools
                return results, loop continues until the model signals
                completion. Add a framework only when you have a specific gap it
                fills (durable execution, graph-shaped control flow, cross-agent
                handoff).
              </dd>
            </div>
            <div className="rounded-lg border border-line bg-card p-5">
              <dt className="font-display text-[17px] font-bold leading-tight">
                What is llms.txt?
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-mut">
                An emerging convention (analogous to{" "}
                <code className="font-mono text-ink">robots.txt</code>) that
                publishes a plain-text summary of a site aimed at LLM crawlers
                and AI answer engines. It lives at{" "}
                <code className="font-mono text-ink">/llms.txt</code> and points
                at the pages worth indexing. paw publishes one at{" "}
                <a href="/llms.txt" className="underline">
                  getpaw.dev/llms.txt
                </a>
                . The convention is documented at{" "}
                <a
                  href={LLMS_TXT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  llmstxt.org
                </a>
                .
              </dd>
            </div>
          </dl>
        </section>

        {/* CTA back to build-your-own and library */}
        <section className="wrap pb-24">
          <div className="rounded-lg border border-line bg-card p-8">
            <span className="eyebrow">
              <span className="tick" />
              Once you have picked your tools
            </span>
            <h2 className="mt-3 max-w-[640px] font-display text-[clamp(22px,3vw,30px)] font-extrabold leading-[1.05] tracking-[-0.01em]">
              Read the playbook, steal from the roster.
            </h2>
            <p className="mt-3 max-w-[680px] text-[15.5px] leading-relaxed text-mut">
              A reading list is only the first mile. The{" "}
              <Link href="/build-your-own" className="underline">
                build-your-own playbook
              </Link>{" "}
              walks step-by-step from &quot;my current workflow&quot; to a
              harness that catches what you would catch. The{" "}
              <Link href="/library" className="underline">
                idea library
              </Link>{" "}
              is the wider agent roster to steal from, with recipes to chain
              them.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="btn" href="/build-your-own">
                Read the playbook
              </Link>
              <Link className="btn line" href="/library">
                Steal from the roster
              </Link>
              <Link className="btn line" href="/install">
                Install paw
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
