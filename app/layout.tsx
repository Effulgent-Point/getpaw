import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Atkinson_Hyperlegible,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

// Optical Bench type system, exposed as the --fd / --fb / --fm CSS variables
// that globals.css and tailwind.config.ts reference.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--fd",
  display: "swap",
});
const body = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--fb",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--fm",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getpaw.dev"),
  title: {
    default: "paw, Personal Agent Workflows",
    template: "%s · paw",
  },
  description:
    "paw is an open-source AI SDLC starter kit: 18 specialized agents, 7 skill bundles, enforcement hooks, and a CLI that makes your coding agent write code right.",
};

/*
  NOTE (scaffold): this root layout ships a minimal standalone shell so the
  catalog route builds and reads on its own. The host-switched chrome
  (getpaw.dev PawHeader/Footer vs paw.effulgentpoint.com EpHeader/Footer)
  is a separate workstream under components/chrome/. Replace the header and
  footer below when that lands.
*/
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to main content
        </a>

        <header className="border-b border-line">
          <div className="wrap flex items-center gap-6 py-5 text-[14.5px]">
            <a
              href="/"
              className="flex items-center gap-2 font-display text-[17px] font-extrabold no-underline"
            >
              <span className="relative inline-block h-[9px] w-[9px] rounded-full bg-ink" />
              paw
            </a>
            <nav className="ml-auto flex flex-wrap items-center gap-5 text-mut">
              <a href="/catalog" className="no-underline hover:text-ink">
                Catalog
              </a>
              <a href="/tutorial" className="no-underline hover:text-ink">
                Tutorial
              </a>
              <a href="/install" className="no-underline hover:text-ink">
                Install
              </a>
              <a
                href="https://github.com/Effulgent-Point/paw"
                className="no-underline hover:text-ink"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>

        <main id="main">{children}</main>

        <footer className="border-t border-line py-12 text-sm">
          <div className="wrap flex flex-wrap items-center justify-between gap-4 text-mut">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
              paw · Personal Agent Workflows
            </span>
            <span className="font-mono text-[11px]">
              An open-source AI SDLC starter kit. MIT.
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
