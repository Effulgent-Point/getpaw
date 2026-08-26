// getpaw catalog data.
//
// Faithful, typed mirror of the paw kit's agents, skills, hooks, and CLI.
// Source of truth: the paw repo (Effulgent-Point/paw).
//   agents:  agents/*.md frontmatter + agents/README.md (phase + permission tables)
//   skills:  skills/README.md + skills/*/SKILL.md
//   hooks:   hooks/*.py, hooks/*.sh + hooks/README.md
//   cli:     README.md "The paw CLI"
//
// House rule: no em-dashes in copy. The source .md descriptions use them;
// they are rewritten here with colons/commas/periods, meaning preserved.

// ----------------------------------------------------------------------------
// Agents
// ----------------------------------------------------------------------------

export type AgentModel = "opus" | "sonnet" | "haiku";
export type AgentPhase = "Plan" | "Build" | "Review" | "Respond" | "Document";
export type AgentTier = "Read-only" | "Read + Bash" | "Read + Write" | "Full";

export interface Agent {
  slug: string;
  name: string;
  description: string;
  model: AgentModel;
  tools: string[];
  phase: AgentPhase;
  tier: AgentTier;
}

export const AGENTS: Agent[] = [
  {
    slug: "architect",
    name: "architect",
    description:
      "Produces a system architecture for a spec: components, boundaries, data flow, risks, alternatives. Use when a non-trivial change needs design before planning.",
    model: "opus",
    tools: ["Read", "Grep", "Glob"],
    phase: "Plan",
    tier: "Read-only",
  },
  {
    slug: "planner",
    name: "planner",
    description:
      "Turns architecture into a numbered, executable implementation plan with workstreams, file targets, and acceptance tests.",
    model: "opus",
    tools: ["Read", "Grep", "Glob"],
    phase: "Plan",
    tier: "Read-only",
  },
  {
    slug: "devils-advocate",
    name: "devils-advocate",
    description:
      "Adversarial review of a plan. Finds gaps, optimistic assumptions, missing rollback paths, hand-waved steps, and hidden dependencies.",
    model: "opus",
    tools: ["Read", "Grep", "Glob"],
    phase: "Plan",
    tier: "Read-only",
  },
  {
    slug: "rollback-planner",
    name: "rollback-planner",
    description:
      "Creates a rollback plan for any change: what to revert, in what order, and how to verify the rollback worked.",
    model: "sonnet",
    tools: ["Read", "Grep", "Glob"],
    phase: "Plan",
    tier: "Read-only",
  },
  {
    slug: "builder",
    name: "builder",
    description:
      "Implements a task using TDD: writes the test first, then the code, then refactors. The only agent with full access.",
    model: "sonnet",
    tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"],
    phase: "Build",
    tier: "Full",
  },
  {
    slug: "merge-resolver",
    name: "merge-resolver",
    description:
      "Resolves git merge conflicts by understanding both sides' intent. Combines compatible changes, escalates competing ones.",
    model: "sonnet",
    tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"],
    phase: "Build",
    tier: "Full",
  },
  {
    slug: "migration-architect",
    name: "migration-architect",
    description:
      "Plans safe database migrations using the expand-backfill-contract pattern. Never destructive in production.",
    model: "sonnet",
    tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"],
    phase: "Build",
    tier: "Full",
  },
  {
    slug: "code-reviewer",
    name: "code-reviewer",
    description:
      "General code review on changed files. Flags correctness, edge cases, error handling, naming, and unclear intent. Severity levels: critical, warning, info.",
    model: "opus",
    tools: ["Read", "Grep", "Glob"],
    phase: "Review",
    tier: "Read-only",
  },
  {
    slug: "bug-auditor",
    name: "bug-auditor",
    description:
      "Hunts latent bugs: race conditions, off-by-one, null deref, unbounded loops, integer overflow, encoding mismatches, time-of-check/time-of-use.",
    model: "sonnet",
    tools: ["Read", "Grep", "Glob"],
    phase: "Review",
    tier: "Read-only",
  },
  {
    slug: "security-reviewer",
    name: "security-reviewer",
    description:
      "OWASP Top 10 review on the diff. Flags injection, broken access control, crypto failures, SSRF, XSS, prompt injection. Adversarial mindset.",
    model: "opus",
    tools: ["Read", "Grep", "Glob"],
    phase: "Review",
    tier: "Read-only",
  },
  {
    slug: "perf-checker",
    name: "perf-checker",
    description:
      "Performance review: N+1 queries, unbounded fetches, missing pagination, sync work in async paths, heavy renders, allocations in tight loops.",
    model: "sonnet",
    tools: ["Read", "Grep", "Glob"],
    phase: "Review",
    tier: "Read-only",
  },
  {
    slug: "fe-reviewer",
    name: "fe-reviewer",
    description:
      "Frontend-specific reviewer for React/Vue/Angular: accessibility, component structure, hooks, render performance, state management.",
    model: "sonnet",
    tools: ["Read", "Grep", "Glob"],
    phase: "Review",
    tier: "Read-only",
  },
  {
    slug: "php-reviewer",
    name: "php-reviewer",
    description:
      "PHP/Laravel-specific reviewer: SQL injection, mass assignment, CSRF, N+1 Eloquent, auth middleware, type safety, queue idempotency.",
    model: "sonnet",
    tools: ["Read", "Grep", "Glob"],
    phase: "Review",
    tier: "Read-only",
  },
  {
    slug: "test-runner",
    name: "test-runner",
    description:
      "Runs the project's test suite, captures results, identifies new failures, and flags missing coverage on changed code.",
    model: "sonnet",
    tools: ["Read", "Bash", "Grep", "Glob"],
    phase: "Review",
    tier: "Read + Bash",
  },
  {
    slug: "integration-tester",
    name: "integration-tester",
    description:
      "Runs integration and end-to-end tests. Validates that components work together, not just individually.",
    model: "sonnet",
    tools: ["Read", "Bash", "Grep", "Glob"],
    phase: "Review",
    tier: "Read + Bash",
  },
  {
    slug: "environment-checker",
    name: "environment-checker",
    description:
      "Validates that the development environment is correctly set up: dependencies, env vars, database, services, build tools.",
    model: "sonnet",
    tools: ["Read", "Bash", "Grep", "Glob"],
    phase: "Review",
    tier: "Read + Bash",
  },
  {
    slug: "incident-commander",
    name: "incident-commander",
    description:
      "Triages production incidents. Stop the bleeding first, root-cause second, prevention third.",
    model: "opus",
    tools: ["Read", "Write", "Edit", "Bash", "Grep", "Glob"],
    phase: "Respond",
    tier: "Full",
  },
  {
    slug: "docs-writer",
    name: "docs-writer",
    description:
      "Updates documentation to match code changes: README, CHANGELOG, inline docs, migration guides, examples.",
    model: "sonnet",
    tools: ["Read", "Write", "Edit", "Grep", "Glob"],
    phase: "Document",
    tier: "Read + Write",
  },
];

// ----------------------------------------------------------------------------
// Skills
// ----------------------------------------------------------------------------

export type SkillCategory = "Design" | "Review" | "Stack" | "Security" | "Git";

export interface Skill {
  slug: string;
  name: string;
  triggersWhen: string;
  category: SkillCategory;
  sourcePath: string;
}

export const SKILLS: Skill[] = [
  {
    slug: "architecture",
    name: "Architecture",
    triggersWhen:
      "Designing systems, evaluating tradeoffs, deciding component boundaries, planning integration points.",
    category: "Design",
    sourcePath: "skills/architecture/SKILL.md",
  },
  {
    slug: "devils-advocate",
    name: "Devil's Advocate",
    triggersWhen:
      "Reviewing any plan before commitment: architecture, implementation plan, migration strategy, design proposal.",
    category: "Review",
    sourcePath: "skills/devils-advocate/SKILL.md",
  },
  {
    slug: "frontend",
    name: "Frontend",
    triggersWhen:
      "React, Vue, or Angular work: component design, accessibility, performance, state management.",
    category: "Stack",
    sourcePath: "skills/frontend/SKILL.md",
  },
  {
    slug: "php-laravel",
    name: "PHP / Laravel",
    triggersWhen:
      "PHP or Laravel work: Eloquent, middleware, validation, queues, migrations, testing.",
    category: "Stack",
    sourcePath: "skills/php-laravel/SKILL.md",
  },
  {
    slug: "security",
    name: "Security",
    triggersWhen:
      "Any code touching authentication, user input, external APIs, or sensitive data.",
    category: "Security",
    sourcePath: "skills/security/SKILL.md",
  },
  {
    slug: "quality-gate",
    name: "Quality Gate",
    triggersWhen:
      "Reviewing code before merge. Running multiple review agents. Deciding what blocks and what doesn't.",
    category: "Review",
    sourcePath: "skills/quality-gate/SKILL.md",
  },
  {
    slug: "git-safety",
    name: "Git Safety",
    triggersWhen:
      "Any git operation that could lose work: pull, push, merge, rebase, branch management, conflict resolution.",
    category: "Git",
    sourcePath: "skills/git-safety/SKILL.md",
  },
];

// ----------------------------------------------------------------------------
// Hooks
// ----------------------------------------------------------------------------

export type HookEvent = "PreToolUse" | "PostToolUse" | "pre-commit" | null;
export type HookKind = "enforce" | "installer" | "lib";

export interface Hook {
  slug: string;
  file: string;
  event: HookEvent;
  matcher: string | null;
  does: string;
  kind: HookKind;
  overrides: string[];
}

// The four hooks: files that fire on a lifecycle event and enforce a rule.
// paw frames it as "four hooks plus shared helpers and an installer"; those
// two support files live in HOOK_SUPPORT below and are not carded as hooks.
export const HOOKS: Hook[] = [
  {
    slug: "git-safety",
    file: "git_safety.py",
    event: "PreToolUse",
    matcher: "Bash",
    does: "Blocks dangerous git operations: rebase, pull --rebase, force-push (-f / --force), branch -D, reset --hard, and checkout dot. Allows --force-with-lease by design.",
    kind: "enforce",
    overrides: ["PAW_ALLOW_REBASE", "PAW_ALLOW_FORCE_PUSH"],
  },
  {
    slug: "branch-guard",
    file: "branch_guard.py",
    event: "PreToolUse",
    matcher: "Bash",
    does: "Blocks git commits on protected branches (main, master, develop, trunk, release). Fails closed if the branch cannot be determined.",
    kind: "enforce",
    overrides: [],
  },
  {
    slug: "branch-guard-precommit",
    file: "branch_guard_precommit.py",
    event: "pre-commit",
    matcher: null,
    does: "The pre-commit framework build of branch_guard. Blocks commits on protected branches as a standard git hook, no Claude Code required.",
    kind: "enforce",
    overrides: [],
  },
  {
    slug: "auto-test-detect",
    file: "auto_test_detect.sh",
    event: "PostToolUse",
    matcher: "Write | Edit",
    does: "Warns when a source file is written or edited and no matching test file exists nearby. It nudges, it does not run tests.",
    kind: "enforce",
    overrides: [],
  },
];

// Support files that ship alongside the hooks but are not hooks themselves.
// Kept for completeness; not shown as browse cards in the catalog.
export const HOOK_SUPPORT: Hook[] = [
  {
    slug: "install-hooks",
    file: "install_hooks.py",
    event: null,
    matcher: null,
    does: "Installs the paw hooks into ~/.claude/settings.json. Idempotent, and driven by paw setup.",
    kind: "installer",
    overrides: [],
  },
  {
    slug: "lib",
    file: "_lib.py",
    event: null,
    matcher: null,
    does: "Shared helpers for the hooks: read_payload, emit, and find_project_root.",
    kind: "lib",
    overrides: [],
  },
];

// ----------------------------------------------------------------------------
// CLI
// ----------------------------------------------------------------------------

export type CliGroup =
  "setup" | "learn" | "quality" | "smart" | "config" | "meta";

export interface CliCommand {
  command: string;
  args?: string;
  summary: string;
  group: CliGroup;
}

export const CLI_COMMANDS: CliCommand[] = [
  {
    command: "paw setup",
    summary: "Check requirements, install hooks.",
    group: "setup",
  },
  {
    command: "paw tutorial",
    summary: "Interactive TUI walkthrough with 9 tracks.",
    group: "learn",
  },
  {
    command: "paw tutorial",
    args: "--web",
    summary: "Open the browser-based tutorial.",
    group: "learn",
  },
  {
    command: "paw doctor",
    summary: "Diagnose problems with your install.",
    group: "setup",
  },
  {
    command: "paw init",
    summary: "Scaffold a .paw.json config into a project.",
    group: "config",
  },
  {
    command: "paw check",
    summary: "Standard quality gate: 3 reviewers.",
    group: "quality",
  },
  {
    command: "paw check",
    args: "--quick",
    summary: "Quick gate: code-reviewer only.",
    group: "quality",
  },
  {
    command: "paw check",
    args: "--thorough",
    summary: "Thorough gate: all 8 reviewers.",
    group: "quality",
  },
  {
    command: "paw gate",
    args: "<name>",
    summary:
      "Run a single review agent. Targets: security, bugs, perf, frontend, php, tests, docs, env.",
    group: "quality",
  },
  {
    command: "paw agents",
    summary: "List all 18 agents.",
    group: "learn",
  },
  {
    command: "paw next",
    summary: "Suggested next steps based on your progress.",
    group: "smart",
  },
  {
    command: "paw suggest",
    summary: "Detect your stack, recommend agents.",
    group: "smart",
  },
  {
    command: "paw cheatsheet",
    summary: "Print the quick reference card.",
    group: "learn",
  },
  {
    command: "paw desktop",
    summary: "Create a Desktop app launcher (macOS).",
    group: "setup",
  },
  {
    command: "paw uninstall",
    summary: "Remove hooks and symlink.",
    group: "setup",
  },
  {
    command: "paw completions",
    summary: "Shell tab-completion (zsh or bash).",
    group: "setup",
  },
  {
    command: "paw version",
    summary: "Show the installed version.",
    group: "meta",
  },
];

// ----------------------------------------------------------------------------
// Shared kinds + label maps used by the catalog view
// ----------------------------------------------------------------------------

export type CatalogKind = "agent" | "skill" | "hook" | "cli";

export const CLI_GROUP_LABELS: Record<CliGroup, string> = {
  setup: "Setup",
  learn: "Learn",
  quality: "Quality",
  smart: "Smart",
  config: "Config",
  meta: "Meta",
};

export const AGENT_PHASES: AgentPhase[] = [
  "Plan",
  "Build",
  "Review",
  "Respond",
  "Document",
];

export const AGENT_TIERS: AgentTier[] = [
  "Read-only",
  "Read + Bash",
  "Read + Write",
  "Full",
];

// One-line explainer for each permission tier, from paw's agents/README.md.
export const TIER_MEANING: Record<AgentTier, string> = {
  "Read-only": "Look and report. Cannot modify.",
  "Read + Bash": "Run tests and checks. Cannot edit code.",
  "Read + Write": "Edit docs. Cannot run commands.",
  Full: "Read, write, and run. Implementation and operations.",
};

// Counts. The paw kit shown on this site is a curated slice; the sibling
// forge pipeline (getpaw.dev/build-your-own explains the relationship) ships
// the fuller roster. These numbers reflect that fuller roster because that is
// what a reader clicking "Star on GitHub" actually finds when the code lands.
// Cards on /catalog still enumerate the curated slice; counts here are the
// headline.
export const CATALOG_COUNTS = {
  agents: 54,
  skills: 8,
  hooks: 9,
  cli: 15,
  rules: 22,
  scripts: 19,
  contexts: 8,
  selfHealing: 10,
} as const;
