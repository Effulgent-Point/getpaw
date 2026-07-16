import Link from "next/link";
import { PAW_NAV, GITHUB_URL, LICENSE_URL, EP_URL } from "./nav";

// Standalone getpaw.dev footer. The "An Effulgent Point project" link is the
// intended open-source to Effulgent Point funnel and lives on the EP side of
// the wall, so it belongs here.
export function PawFooter() {
  return (
    <footer className="border-t border-line pt-12 pb-14">
      <div className="wrap f-grid">
        <div>
          <Link href="/" className="mark" style={{ fontSize: "16px" }}>
            <span className="pt" aria-hidden="true" />
            paw
          </Link>
          <p className="f-tag">
            An open-source AI SDLC starter kit. Standards enforced, not
            suggested.
          </p>
        </div>
        <div className="f-col">
          <h3>Explore</h3>
          <Link href="/">Home</Link>
          {PAW_NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="f-col">
          <h3>Source</h3>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer">
            License (MIT)
          </a>
        </div>
        <div className="f-col">
          <h3>Made by</h3>
          <a href={EP_URL} target="_blank" rel="noopener noreferrer">
            Effulgent Point
          </a>
        </div>
      </div>
      <div className="wrap fine">
        An Effulgent Point project. MIT licensed. paw, Personal Agent Workflows.
      </div>
    </footer>
  );
}
