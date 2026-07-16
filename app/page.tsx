// NOTE (scaffold): placeholder home. The full home hero + animated terminal is
// a separate workstream. This exists so the app builds and links into /catalog.
export default function Home() {
  return (
    <section className="wrap py-20">
      <span className="eyebrow">
        <span className="tick" />
        Personal Agent Workflows
      </span>
      <h1 className="mt-5 max-w-[820px] font-display text-[clamp(38px,7vw,74px)] font-extrabold leading-[0.98] tracking-[-0.02em]">
        Your agent writes code fast.
        <br />
        <span className="text-mut">paw makes it write code right.</span>
      </h1>
      <hr className="spectral-rule my-8 max-w-[600px]" />
      <p className="max-w-[540px] text-[19px] text-mut">
        An open-source AI SDLC starter kit: standards that are enforced not
        suggested, 18 specialized agents, 7 skill bundles, git guardrails, and a
        CLI.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a className="btn" href="/catalog">
          Browse the catalog
        </a>
        <a className="btn line" href="/install">
          Install paw
        </a>
      </div>
    </section>
  );
}
