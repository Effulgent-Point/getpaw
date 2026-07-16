import type { MetadataRoute } from "next";

// Canonical identity is getpaw.dev; point crawlers at its sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://getpaw.dev/sitemap.xml",
    host: "https://getpaw.dev",
  };
}
