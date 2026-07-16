import Link from "next/link";
import { PAW_NAV, GITHUB_URL, EP_URL } from "./nav";

// paw.effulgentpoint.com header: the Effulgent Point masthead (links go out to
// effulgentpoint.com) over a paw sub-nav (links stay on this host), so paw reads
// as a native section of effulgentpoint.com rather than an embedded iframe.
const EP_LINKS = [
  { href: `${EP_URL}/work/`, label: "Work" },
  { href: `${EP_URL}/services/`, label: "Services" },
  { href: `${EP_URL}/strategy/`, label: "Strategy" },
  { href: `${EP_URL}/about/`, label: "About" },
];

export function EpHeader() {
  return (
    <header>
      {/* Effulgent Point masthead */}
      <div className="wrap">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line py-6">
          <a href={`${EP_URL}/`} className="mark">
            <span className="pt" aria-hidden="true" />
            EffulgentPoint
          </a>
          <nav
            aria-label="Effulgent Point"
            className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2 text-[14.5px]"
          >
            {EP_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </nav>
          <a href={`${EP_URL}/contact/`} className="btn sm">
            Get in touch
          </a>
        </div>
      </div>

      {/* paw section sub-nav (stays on paw.effulgentpoint.com) */}
      <div className="wrap">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-line py-3.5 text-[14px]">
          <Link
            href="/"
            className="flex items-center gap-2 font-display font-extrabold no-underline"
            aria-label="paw, overview"
          >
            <span className="tick" aria-hidden="true" />
            paw
          </Link>
          <nav
            aria-label="paw"
            className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <Link href="/" className="nav-link">
              Overview
            </Link>
            {PAW_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
            <a
              href={GITHUB_URL}
              className="nav-link"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
