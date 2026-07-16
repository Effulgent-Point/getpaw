import Link from "next/link";
import { PAW_NAV, GITHUB_URL } from "./nav";

// Standalone getpaw.dev header: paw's own identity.
export function PawHeader() {
  return (
    <header className="border-b border-line">
      <div className="wrap flex flex-wrap items-center gap-x-6 gap-y-3 py-5">
        <Link href="/" className="mark" aria-label="paw, home">
          <span className="pt" aria-hidden="true" />
          paw
        </Link>
        <nav
          aria-label="Primary"
          className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2 text-[14.5px]"
        >
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
    </header>
  );
}
