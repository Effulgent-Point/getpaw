import type { Metadata } from "next";
import Link from "next/link";
import { SlideViewer, type Slide } from "@/components/bamboohr/SlideViewer";
import { CopyCmd } from "@/components/bamboohr/CopyCmd";

export const metadata: Metadata = {
  title: "Welcome, Bambooligans",
  description:
    "A Tech Forge training on paw and building your own agents, made for the BambooHR team. Quickstart, live deck, and the AI principles you already know, rendered in code.",
  alternates: { canonical: "/bamboohr" },
};

// BambooHR's three AI development principles, mapped to what paw actually does.
const principles = [
  {
    principle: "Benefits should be clear",
    paw: "Standards are explicit and enforced, never buried in a README people skip. Every agent checks one dimension and tells you exactly what it found.",
  },
  {
    principle: "Empowerment, not replacement",
    paw: "Your agent writes code fast; paw keeps you the conductor. 14 of 18 agents run with restricted permissions. Most only look and report, you decide.",
  },
  {
    principle: "Built on a foundation of trust",
    paw: "Trust becomes mechanical. Hooks hard-block rebase, force-push, and commits to main. Guardrails that fire, not guidelines that get skipped.",
  },
];

const steps = [
  { label: "Clone paw", cmd: "git clone https://github.com/Effulgent-Point/paw.git ~/paw" },
  { label: "Run setup", cmd: "cd ~/paw && ./paw setup" },
  { label: "Learn it in your browser", cmd: "./paw tutorial --web" },
  { label: "Build your first agent", cmd: "./paw tutorial try" },
];

const slides: Slide[] = [
  {
    kicker: "BambooHR × paw · Tech Forge",
    title: "Build Your Own Agents",
    subtitle: "A hands-on hour with paw. Welcome, Bambooligans.",
  },
  {
    kicker: "You already do this",
    title: "Employees ask, AI answers",
    subtitle:
      "You ship AI every day with Ask BambooHR. Today we flip it: you build the agent, and you set the rules.",
  },
  {
    kicker: "Your principles, in code",
    title: "Empowerment, not replacement",
    bullets: [
      "Clear benefits: standards are enforced, not suggested",
      "Empowerment: 14 of 18 agents run with restricted permissions",
      "Trust: hooks block the dangerous git moves, mechanically",
    ],
  },
  {
    kicker: "What is in the box",
    title: "18 agents. 7 skills. Hard-stop hooks. A CLI.",
    bullets: [
      "Specialized reviewers, each checking one dimension",
      "Domain skill bundles agents load for expertise",
      "Hooks that fire on real git and agent events",
    ],
  },
  {
    kicker: "The hands-on",
    title: "Clone, setup, tutorial, build",
    subtitle:
      "Four commands to a working setup, then build your first agent live. The quickstart on this page has every command with a copy button.",
  },
  {
    kicker: "Go build",
    title: "getpaw.dev/tutorial",
    subtitle:
      "Nine tracks, from Learn paw to Contributing. Keep going after today, then bring an agent idea back to your team.",
  },
];

export default function BambooHrPage() {
  return (
    <div className="bamboo-root">
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 72 }}>
        {/* Hero */}
        <section className="bamboo-hero" style={{ padding: "clamp(28px, 5vw, 60px)" }}>
          <span className="bamboo-chip">🐼 BambooHR × paw</span>
          <h1
            style={{
              fontFamily: "var(--fd), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(34px, 6vw, 68px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: "18px 0 0",
            }}
          >
            Welcome, Bambooligans.
          </h1>
          <p
            className="bamboo-mut"
            style={{ fontSize: "clamp(17px, 2.4vw, 22px)", maxWidth: "48ch", marginTop: 16 }}
          >
            You use AI every day with Ask BambooHR. In this Tech Forge session, you
            build your own. paw is the starter kit that makes your coding agent
            write code right.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
            <a href="#quickstart" className="bamboo-btn">
              Start the quickstart
            </a>
            <a href="#deck" className="bamboo-btn line">
              Open the deck
            </a>
          </div>
        </section>

        {/* Principles in code */}
        <section style={{ marginTop: 64 }}>
          <p className="eyebrow">
            <span className="tick" />
            Your AI principles, in code
          </p>
          <h2 style={{ fontSize: "clamp(24px, 3.4vw, 36px)", margin: "10px 0 6px" }}>
            paw is your AI principles, made mechanical
          </h2>
          <p style={{ color: "var(--bamboo-mut)", maxWidth: "60ch" }}>
            BambooHR builds AI on three principles. paw is what they look like once
            they are enforced in your codebase instead of written on a wall.
          </p>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              marginTop: 24,
            }}
          >
            {principles.map((p, idx) => (
              <div key={p.principle} className="bamboo-card">
                <p className="p-num">{String(idx + 1).padStart(2, "0")}</p>
                <h3 style={{ fontSize: 18, margin: "10px 0 8px" }}>{p.principle}</h3>
                <p style={{ fontSize: 14.5, color: "var(--bamboo-mut)", lineHeight: 1.6 }}>
                  {p.paw}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quickstart */}
        <section id="quickstart" style={{ marginTop: 64, scrollMarginTop: 90 }}>
          <p className="eyebrow">
            <span className="tick" />
            Branded quickstart
          </p>
          <h2 style={{ fontSize: "clamp(24px, 3.4vw, 36px)", margin: "10px 0 6px" }}>
            Four commands, then build your first agent
          </h2>
          <p style={{ color: "var(--bamboo-mut)", maxWidth: "58ch" }}>
            Every command copies to your clipboard. Follow along live, or run it on
            your own after the session.
          </p>
          <div style={{ display: "grid", gap: 18, marginTop: 24 }}>
            {steps.map((s, idx) => (
              <div key={s.label}>
                <p
                  className="label"
                  style={{ color: "var(--bamboo-deep)", marginBottom: 8 }}
                >
                  Step {idx + 1} · {s.label}
                </p>
                <CopyCmd cmd={s.cmd} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
            <Link href="/tutorial" className="bamboo-btn">
              Open the full tutorial
            </Link>
            <a
              href="https://github.com/Effulgent-Point/paw"
              target="_blank"
              rel="noopener"
              className="bamboo-btn line"
              style={{ color: "var(--bamboo-deep)", borderColor: "var(--bamboo-line)" }}
            >
              paw on GitHub ↗
            </a>
          </div>
        </section>

        {/* Deck */}
        <section id="deck" style={{ marginTop: 64, scrollMarginTop: 90 }}>
          <p className="eyebrow">
            <span className="tick" />
            The deck
          </p>
          <h2 style={{ fontSize: "clamp(24px, 3.4vw, 36px)", margin: "10px 0 14px" }}>
            Present it right here
          </h2>
          <SlideViewer slides={slides} />
          <p style={{ fontSize: 13, color: "var(--bamboo-mut)", marginTop: 12 }}>
            Placeholder deck. Arrows or space to move, F for fullscreen present mode.
            Swap in the real slides anytime.
          </p>
        </section>
      </div>
    </div>
  );
}
