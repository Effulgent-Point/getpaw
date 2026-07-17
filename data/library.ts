// Ideas and recipes for the /library page. paw ships 18 agents; these are more
// ideas to build, drawn from the forge pipeline (getpaw's bigger sibling) and
// real workflows. Nothing here is required, it is a menu to steal from.

export type AgentIdea = { name: string; blurb: string; group: string };

export const IDEA_GROUPS = [
  "Research",
  "Plan",
  "Design",
  "Build",
  "Review",
  "Security",
  "Test & QA",
  "Ship",
  "Ops & risk",
] as const;

export const AGENT_IDEAS: AgentIdea[] = [
  // Research
  { group: "Research", name: "codebase-cartographer", blurb: "Maps an unfamiliar repo: entry points, data flow, and where the risky code lives." },
  { group: "Research", name: "prior-art-scout", blurb: "Finds how this was already solved, in your own history and the wider ecosystem." },
  { group: "Research", name: "requirements-researcher", blurb: "Reads the issues, docs, and threads and assembles what the feature actually needs to do." },
  { group: "Research", name: "competitive-analyst", blurb: "Pulls apart a competitor's product or docs and reports what they do differently." },
  { group: "Research", name: "api-explorer", blurb: "Reads a third-party API's docs and hands back the exact calls, auth, and gotchas." },
  // Plan
  { group: "Plan", name: "architect", blurb: "Turns a spec into a system: components, boundaries, data flow, and the risks up front." },
  { group: "Plan", name: "planner", blurb: "Turns the architecture into a numbered, executable plan with acceptance tests." },
  { group: "Plan", name: "devils-advocate", blurb: "Stress-tests the plan for gaps, optimistic assumptions, and hand-waved steps." },
  { group: "Plan", name: "intake-normalizer", blurb: "Turns a messy issue, PDF, or Slack thread into one clean spec everyone can build from." },
  // Design
  { group: "Design", name: "design-system-keeper", blurb: "Checks new UI against your existing colors, spacing, and components so it matches the rest of the app." },
  { group: "Design", name: "fe-reviewer", blurb: "Reviews front-end markup, component states, and responsive behavior." },
  { group: "Design", name: "ux-writer", blurb: "Writes the microcopy: button labels, empty states, and errors that sound human." },
  { group: "Design", name: "accessibility-auditor", blurb: "WCAG pass: keyboard, focus, contrast, semantic HTML, and alt text." },
  // Build
  { group: "Build", name: "builder", blurb: "Implements one task test-first in an isolated worktree, then refactors." },
  { group: "Build", name: "migration-architect", blurb: "Designs safe schema changes: expand, backfill, contract. No destructive one-shots." },
  { group: "Build", name: "merge-resolver", blurb: "Integrates parallel branches and resolves conflicts by merge, never rebase." },
  { group: "Build", name: "scaffolder", blurb: "Generates the boring boilerplate for a new module to your house conventions." },
  // Review
  { group: "Review", name: "code-reviewer", blurb: "Correctness, edge cases, error handling, naming, and unclear intent on the diff." },
  { group: "Review", name: "bug-auditor", blurb: "Hunts latent bugs: races, off-by-one, null deref, overflow, time-of-check issues." },
  { group: "Review", name: "perf-checker", blurb: "N+1 queries, unbounded fetches, sync work in async paths, heavy renders." },
  { group: "Review", name: "breaking-change-detector", blurb: "Flags public-API changes that will break the people who depend on you." },
  { group: "Review", name: "silent-failure-hunter", blurb: "Empty catches, swallowed errors, and fallbacks that hide real failures." },
  { group: "Review", name: "comment-analyzer", blurb: "Comments that lie, comments that just narrate, and the missing 'why'." },
  // Security
  { group: "Security", name: "security-owasp", blurb: "OWASP Top 10 on the diff: injection, broken access control, SSRF, XSS, secrets." },
  { group: "Security", name: "security-soc2", blurb: "SOC 2 readiness: access controls, logging, encryption in transit and at rest." },
  { group: "Security", name: "dependency-auditor", blurb: "CVEs, licenses, and supply-chain risk in anything new you pulled in." },
  { group: "Security", name: "secrets-scanner", blurb: "Hunts hardcoded keys, tokens, and credentials before they reach git history." },
  { group: "Security", name: "threat-modeler", blurb: "Maps the attack surface of a new feature before a line of it is written." },
  // Test & QA
  { group: "Test & QA", name: "test-runner", blurb: "Runs the suite, isolates new failures, and flags code that shipped without a test." },
  { group: "Test & QA", name: "flake-detector", blurb: "Finds tests that pass and fail without a code change, and quarantines them." },
  { group: "Test & QA", name: "integration-tester", blurb: "Exercises the seams between systems, where the demo-proof bugs hide." },
  { group: "Test & QA", name: "coverage-gap-finder", blurb: "Finds the changed lines that shipped without a single test touching them." },
  // Ship
  { group: "Ship", name: "docs-writer", blurb: "Updates the README, migration guide, and examples to match what you just built." },
  { group: "Ship", name: "release-notes-writer", blurb: "Turns the commits into user-facing release notes people will actually read." },
  { group: "Ship", name: "rollback-planner", blurb: "Writes the rollback procedure before you ship, not during the incident." },
  { group: "Ship", name: "delivery-agent", blurb: "Opens the PR with the full audit trail and waits for a human to approve the merge." },
  // Ops & risk
  { group: "Ops & risk", name: "risk-assessor", blurb: "Flags irreversible or high-blast-radius steps before anyone runs them." },
  { group: "Ops & risk", name: "cost-estimator", blurb: "Prices the change: new crons, full-table scans, LLM calls, edge invocations." },
  { group: "Ops & risk", name: "observability-agent", blurb: "Checks that new code emits enough logs, metrics, and traces to debug at 2am." },
  { group: "Ops & risk", name: "incident-commander", blurb: "Takes over when things derail: halts the mess, preserves forensics, escalates." },
  { group: "Ops & risk", name: "product-intent-checker", blurb: "Compares what shipped against what was actually asked for, and flags the drift." },
  { group: "Ops & risk", name: "gap-detector", blurb: "Reads the intent check and spawns follow-up work for whatever the plan missed." },
];

export type Recipe = {
  role: string;
  icon: string;
  goal: string;
  chain: string[];
  how: string;
};

export const ROLE_RECIPES: Recipe[] = [
  {
    role: "Designer",
    icon: "🎨",
    goal: "Ship a component that is actually accessible",
    chain: ["fe-reviewer", "accessibility-auditor", "docs-writer"],
    how: "Have the front-end reviewer check the markup and states, the accessibility auditor catch the keyboard and contrast gaps a demo hides, then docs-writer produce the usage example your team will copy.",
  },
  {
    role: "Product",
    icon: "🧭",
    goal: "Turn a vague ask into a plan you can trust",
    chain: ["architect", "devils-advocate", "product-intent-checker"],
    how: "Architect drafts the approach, devils-advocate pokes holes in it before you commit, and product-intent-checker confirms the result still matches what you actually asked for.",
  },
  {
    role: "Engineering",
    icon: "⚙️",
    goal: "Merge a feature with confidence",
    chain: ["code-reviewer + bug-auditor + security", "test-runner", "rollback-planner"],
    how: "Run the review trio in parallel on the diff, then the test suite, then write the rollback before you ship. Three passes, and you sleep.",
  },
  {
    role: "Leadership",
    icon: "📊",
    goal: "Know the risk and cost before you greenlight",
    chain: ["risk-assessor", "cost-estimator", "gap-detector"],
    how: "Risk-assessor flags the blast radius, cost-estimator prices the cloud spend, and gap-detector shows what the plan is quietly missing. A one-page decision brief, no meeting.",
  },
  {
    role: "QA",
    icon: "🔬",
    goal: "Find the bugs the demo hides",
    chain: ["bug-auditor", "flake-detector", "integration-tester"],
    how: "Bug-auditor hunts the latent stuff, flake-detector quarantines tests that lie, and integration-tester checks the seams between systems where real failures live.",
  },
];

// A prompt people can paste into Claude to find the agents they are missing.
export const GAPS_PROMPT = `Look at my last two weeks: commits, PR comments, and the mistakes I keep catching by hand in review.

What repetitive judgment am I applying manually that an agent could encode for me?

Propose 3 agents I do not have yet. For each: a name, its one-line job, the tools and permissions it would need, and the specific gap it fills. Rank them by how much time they would save me.`;

export const ECC = {
  name: "everything claude code",
  handle: "@affaan-m",
  url: "https://github.com/affaan-m/ecc",
  stats: "67 agents · 278+ skills · 211K+ stars",
  tagline: "the harness-native operator system for agentic work",
};
