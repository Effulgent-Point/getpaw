import Link from "next/link";
import { PAW_NAV, GITHUB_URL, GITHUB_ORG_URL, EP_URL } from "./nav";

// paw.effulgentpoint.com footer: the Effulgent Point footer, with a paw column
// so the section stays navigable. Mirrors effulgentpoint.com's footer chrome.
export function EpFooter() {
  return (
    <footer className="border-t border-line pt-12 pb-14">
      <div className="wrap f-grid">
        <div>
          <a href={`${EP_URL}/`} className="mark" style={{ fontSize: "16px" }}>
            <span className="pt" aria-hidden="true" />
            EffulgentPoint
          </a>
          <p className="f-tag">
            AI strategy and engineering for organizations that refuse to be
            passengers.
          </p>
        </div>
        <div className="f-col">
          <h3>paw</h3>
          <Link href="/">Overview</Link>
          {PAW_NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <div className="f-col">
          <h3>Company</h3>
          <a href={`${EP_URL}/work/`}>Work</a>
          <a href={`${EP_URL}/services/`}>Services</a>
          <a href={`${EP_URL}/about/`}>About</a>
          <a href={`${EP_URL}/contact/`}>Contact</a>
        </div>
        <div className="f-col">
          <h3>Connect</h3>
          <a href={GITHUB_ORG_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/company/effulgent-point"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
      <div className="wrap fine">
        &copy; 2026 Effulgent Point LLC &middot; EX + FULGERE &middot; TO SHINE
        OUT
      </div>
    </footer>
  );
}
