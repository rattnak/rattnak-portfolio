// lib/github.ts
// Server-side GitHub API helpers: cached daily via Next's fetch cache,
// zero client JS, and every failure path degrades to "omit the data"
// so rate limits can never break a page.

export type RepoInfo = {
  stars: number;
  description: string | null;
};

export async function getRepoInfo(repoUrl: string | null): Promise<RepoInfo | null> {
  if (!repoUrl) return null;
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!match) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/${match[1]}/${match[2]}`, {
      next: { revalidate: 86400 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      stars: typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
      description: data.description ?? null,
    };
  } catch {
    return null;
  }
}

export type ActivityItem = {
  kind: "pr" | "push";
  repo: string;
  title: string;
  url: string;
  date: string;
};

export async function getRecentActivity(username = "rattnak"): Promise<ActivityItem[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=30`,
      {
        next: { revalidate: 86400 },
        headers: { Accept: "application/vnd.github+json" },
      }
    );
    if (!res.ok) return [];
    const events = await res.json();
    if (!Array.isArray(events)) return [];

    const items: ActivityItem[] = [];
    for (const e of events) {
      if (items.length >= 5) break;
      if (e?.type === "PullRequestEvent" && e.payload?.action === "opened") {
        items.push({
          kind: "pr",
          repo: e.repo?.name ?? "",
          title: e.payload.pull_request?.title ?? "Pull request",
          url: e.payload.pull_request?.html_url ?? `https://github.com/${e.repo?.name ?? ""}`,
          date: e.created_at,
        });
      } else if (e?.type === "PushEvent" && e.payload?.commits?.length) {
        const last = e.payload.commits[e.payload.commits.length - 1];
        items.push({
          kind: "push",
          repo: e.repo?.name ?? "",
          title: String(last?.message ?? "Push").split("\n")[0].slice(0, 90),
          url: `https://github.com/${e.repo?.name ?? ""}`,
          date: e.created_at,
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

export function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(stars);
}
