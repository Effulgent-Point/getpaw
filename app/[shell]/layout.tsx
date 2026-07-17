import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Atkinson_Hyperlegible,
  IBM_Plex_Mono,
} from "next/font/google";
import "../globals.css";
import { getShell } from "@/lib/host";
import { PawHeader } from "@/components/chrome/PawHeader";
import { PawFooter } from "@/components/chrome/PawFooter";
import { EpHeader } from "@/components/chrome/EpHeader";
import { EpFooter } from "@/components/chrome/EpFooter";
import { ConsolePaw } from "@/components/ui/ConsolePaw";

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
    default: "paw, Personal Agent Workforce",
    template: "%s · paw",
  },
  description:
    "paw is an open-source Personal Agent Workforce: 18 specialized agents, 7 skill bundles, enforcement hooks, and a CLI that makes your coding agent write code right.",
  applicationName: "paw",
  openGraph: {
    type: "website",
    siteName: "paw",
    url: "https://getpaw.dev",
    title: "paw, Personal Agent Workforce",
    description:
      "An open-source Personal Agent Workforce: standards enforced, not suggested, 18 agents, 7 skill bundles, hooks, and a CLI.",
  },
};

// SoftwareApplication structured data. Canonical identity is getpaw.dev
// regardless of which host serves the request.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "paw",
  alternateName: "Personal Agent Workforce",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Linux",
  url: "https://getpaw.dev/",
  downloadUrl: "https://github.com/Effulgent-Point/paw",
  softwareHelp: "https://getpaw.dev/tutorial",
  description:
    "paw is an open-source Personal Agent Workforce: 18 specialized agents, 7 skill bundles, enforcement hooks, and a CLI that makes your coding agent write code right.",
  license: "https://opensource.org/licenses/MIT",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: {
    "@type": "Organization",
    name: "Effulgent Point",
    url: "https://effulgentpoint.com/",
  },
};

// Prebuild both shells so every route can be served as static HTML per host.
// middleware.ts maps the request host to the matching /paw or /ep prefix.
export function generateStaticParams() {
  return [{ shell: "paw" }, { shell: "ep" }];
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shell = await getShell();

  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          // Static, hardcoded object (no user input). Escape "<" so a value can
          // never break out of the script element.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to main content
        </a>
        <ConsolePaw />

        {shell === "ep" ? <EpHeader /> : <PawHeader />}

        <main id="main">{children}</main>

        {shell === "ep" ? <EpFooter /> : <PawFooter />}
      </body>
    </html>
  );
}
