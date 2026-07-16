import { NextResponse, type NextRequest } from "next/server";

// Host -> shell mapping, then rewrite the request to the matching root segment
// (app/[shell]). The URL bar is unchanged for visitors; Next serves the
// prebuilt static /paw/* or /ep/* page. This keeps host-aware chrome while
// letting every route be statically generated (no headers() in the layout).
//   paw.effulgentpoint.com / *.effulgentpoint.com -> ep
//   getpaw.dev, localhost, previews, everything else -> paw
function shellForHost(host: string): "paw" | "ep" {
  const h = host.toLowerCase().split(":")[0];
  if (h === "effulgentpoint.com" || h.endsWith(".effulgentpoint.com")) {
    return "ep";
  }
  return "paw";
}

export function proxy(req: NextRequest) {
  // Match getShell()'s original priority: x-forwarded-host, then host.
  const host =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "";
  const shell = shellForHost(host);

  const url = req.nextUrl.clone();
  url.pathname = `/${shell}${req.nextUrl.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except Next internals, metadata routes, and files with an
  // extension (static assets, robots.txt, sitemap.xml, opengraph-image, etc.).
  matcher: [
    "/((?!_next/static|_next/image|_next/data|favicon.ico|robots.txt|sitemap.xml|opengraph-image|.*\\.).*)",
  ],
};
