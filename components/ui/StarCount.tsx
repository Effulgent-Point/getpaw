// Live GitHub star count, cached for an hour so we never hammer the API and
// the page stays static-fast. Renders nothing if GitHub is unreachable or
// rate-limits us, so the button degrades cleanly.
export async function StarCount() {
  try {
    const res = await fetch(
      "https://api.github.com/repos/Effulgent-Point/paw",
      {
        next: { revalidate: 3600 },
        headers: { Accept: "application/vnd.github+json" },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    if (typeof data.stargazers_count !== "number") return null;
    return (
      <span aria-label={`${data.stargazers_count} GitHub stars`}>
        {" "}
        ★ {data.stargazers_count}
      </span>
    );
  } catch {
    return null;
  }
}
