/** @type {import('next').NextConfig} */

// Baseline security headers for a static marketing/docs site. A nonce-based CSP
// is deliberately left out here: it requires per-request nonces wired through
// middleware and would break Next's inline runtime scripts and the inline
// JSON-LD without careful browser testing. The site has no auth, cookies, or
// user data, so the clickjacking/framing and sniffing protections below cover
// the practical risk.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig = {
  reactStrictMode: true,
  // Enables `next/root-params`, so the host-derived shell segment (app/[shell])
  // can be read without headers() and pages stay statically generated.
  experimental: { rootParams: true },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
