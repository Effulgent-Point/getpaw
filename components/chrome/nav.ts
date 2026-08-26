// Single source of truth for the primary paw navigation, wired identically into
// both shells (standalone paw + Effulgent Point). In-page links stay on the
// current host; canonical tags point search engines at getpaw.dev.
export const PAW_NAV = [
  { href: "/tutorial", label: "Tutorial" },
  { href: "/catalog", label: "Catalog" },
  { href: "/library", label: "Library" },
  { href: "/build-your-own", label: "Build your own" },
  { href: "/install", label: "Install" },
] as const;

export const GITHUB_URL = "https://github.com/Effulgent-Point/paw";
export const GITHUB_ORG_URL = "https://github.com/Effulgent-Point";
export const LICENSE_URL =
  "https://github.com/Effulgent-Point/paw/blob/main/LICENSE";
export const EP_URL = "https://effulgentpoint.com";
