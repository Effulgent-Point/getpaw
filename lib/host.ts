import { headers } from "next/headers";

// One app, two front doors. The chrome (header + footer) is chosen by the
// request host so paw.effulgentpoint.com reads as a native page of
// effulgentpoint.com, while getpaw.dev keeps paw's own standalone shell.
//   getpaw.dev (+ localhost, previews) -> "paw"  standalone shell
//   paw.effulgentpoint.com             -> "ep"   Effulgent Point Optical Bench shell
export type Shell = "paw" | "ep";

export async function getShell(): Promise<Shell> {
  const h = await headers();
  const raw = (h.get("x-forwarded-host") ?? h.get("host") ?? "").toLowerCase();
  const host = raw.split(":")[0]; // strip any port
  if (host === "effulgentpoint.com" || host.endsWith(".effulgentpoint.com")) {
    return "ep";
  }
  return "paw";
}
