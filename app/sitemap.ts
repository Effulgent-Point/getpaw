import type { MetadataRoute } from "next";
import { TRACK_IDS } from "@/lib/tutorial/data";

const BASE = "https://getpaw.dev";

// Every URL is a getpaw.dev URL, matching the rel=canonical on each page.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    "",
    "/tutorial",
    "/catalog",
    "/library",
    "/build-your-own",
    "/resources",
    "/install",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
  }));
  const tracks = TRACK_IDS.map((track) => ({
    url: `${BASE}/tutorial/${track}`,
    lastModified: now,
  }));
  return [...pages, ...tracks];
}
