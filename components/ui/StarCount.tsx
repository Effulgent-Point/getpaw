// Live GitHub star count, cached for an hour so we never hammer the API and
// the page stays static-fast. Renders nothing if GitHub is unreachable or
// rate-limits us, so the button degrades cleanly.

async function fetchStars(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/Effulgent-Point/paw",
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: "application/vnd.github+json",
          // GitHub's REST API rejects requests without a User-Agent.
          "User-Agent": "getpaw.dev",
        },
        signal: AbortSignal.timeout(2500),
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    // Network error, timeout, JSON parse failure — all degrade to "no badge."
    return null;
  }
}

export async function StarCount() {
  // JSX construction happens outside the try/catch (react-hooks/error-boundaries
  // is right that JSX inside try doesn't survive React's lazy rendering — the
  // fetch is what actually needs the catch).
  const stars = await fetchStars();
  if (stars === null) return null;
  return <span aria-label={`${stars} GitHub stars`}> ★ {stars}</span>;
}
