import { shell as rootShell } from "next/root-params";

// One app, two front doors. The chrome (header + footer) is chosen by the
// request host so paw.effulgentpoint.com reads as a native page of
// effulgentpoint.com, while getpaw.dev keeps paw's own standalone shell.
//   getpaw.dev (+ localhost, previews) -> "paw"  standalone shell
//   paw.effulgentpoint.com             -> "ep"   Effulgent Point Optical Bench shell
//
// The shell is a root URL segment (app/[shell]) resolved from `next/root-params`
// instead of headers(). Reading a root param does NOT force per-request dynamic
// rendering the way headers() did, so every page can be statically generated
// per shell. proxy.ts rewrites the request host to the /paw or /ep prefix,
// keeping the URL bar unchanged for visitors.
export type Shell = "paw" | "ep";

export async function getShell(): Promise<Shell> {
  const value = await rootShell();
  return value === "ep" ? "ep" : "paw";
}
