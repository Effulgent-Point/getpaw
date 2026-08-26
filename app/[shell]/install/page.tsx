import type { Metadata } from "next";
import Link from "next/link";
import { CopyBlock } from "@/components/CopyBlock";
import { GITHUB_URL } from "@/components/chrome/nav";

export const metadata: Metadata = {
  title: "Install",
  description:
    "Install paw in under a minute: clone the repo, run ./paw setup, and start with the interactive tutorial. Python 3.10+, git, and Claude Code.",
  alternates: { canonical: "/install" },
};

const CLONE = `git clone https://github.com/Effulgent-Point/paw.git ~/paw
cd ~/paw
./paw setup`;

const FIRST_RUN = `paw tutorial --web     # open the browser tutorial
paw check              # run the standard quality gate
paw agents             # list all 18 agents
paw doctor             # diagnose an install`;

const REQUIREMENTS = [
  "Python 3.10 or newer",
  "git",
  "A terminal",
  "Claude Code",
];

export default function InstallPage() {
  return (
    <>
      <section className="wrap pb-10 pt-16">
        <span className="eyebrow">
          <span className="tick" />
          Install paw
        </span>
        <h1 className="mt-5 max-w-[760px] font-display text-[clamp(32px,5vw,54px)] font-extrabold leading-[1.02] tracking-[-0.02em]">
          Clone it. Run setup. Ship.
        </h1>
        <p className="mt-4 max-w-[560px] text-[17px] text-mut">
          paw installs in under a minute. Clone anywhere: setup detects its own
          location, writes correct paths, and backs up your settings before it
          touches them.
        </p>
      </section>

      <section className="wrap pb-6">
        <h2 className="label">
          <span className="tick" />
          Requirements
        </h2>
        <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[13px] text-mut">
          {REQUIREMENTS.map((r) => (
            <li key={r} className="flex items-center gap-2">
              <span
                className="inline-block h-[6px] w-[6px] rounded-full bg-sp3"
                aria-hidden="true"
              />
              {r}
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap py-10">
        <ol className="grid gap-10">
          <li>
            <h2 className="label">
              <span className="tick" />1 &middot; Clone and set up
            </h2>
            <div className="mt-4 max-w-[640px]">
              <CopyBlock code={CLONE} />
            </div>
            <p className="mt-3 text-[15px] text-mut">
              Setup checks Python, curses, git, your terminal, and Claude Code,
              then installs the hooks.
            </p>
          </li>
          <li>
            <h2 className="label">
              <span className="tick" />2 &middot; First run
            </h2>
            <div className="mt-4 max-w-[640px]">
              <CopyBlock code={FIRST_RUN} />
            </div>
            <p className="mt-3 text-[15px] text-mut">
              Prefer to look before you install? Try the{" "}
              <Link href="/tutorial" className="underline">
                hosted tutorial
              </Link>{" "}
              first, then browse the full{" "}
              <Link href="/catalog" className="underline">
                catalog
              </Link>
              .
            </p>
          </li>
        </ol>
      </section>

      <section className="wrap pb-24">
        <hr className="spectral-rule mb-8 max-w-[600px]" />
        <div className="flex flex-wrap gap-3">
          <a
            className="btn"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Star on GitHub
          </a>
          <Link className="btn line" href="/tutorial">
            Try the tutorial
          </Link>
        </div>
      </section>
    </>
  );
}
