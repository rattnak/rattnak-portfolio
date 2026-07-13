import type { NextConfig } from "next";
import { execSync } from "child_process";

// Vercel sets VERCEL_GIT_COMMIT_SHA on every build. Locally it does not
// exist, which left the footer and colophon printing a provenance line
// with no commit at all. Fall back to the working tree's own HEAD so the
// line is honest in every environment.
//
// The try/catch is load-bearing: a build from a source tarball has no
// .git directory and `git` may not be installed at all. Returning
// undefined there restores exactly the previous behavior (the commit
// fragment is skipped) instead of failing the build.
function resolveCommitSha(): string | undefined {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  try {
    return execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return undefined;
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  poweredByHeader: false,
  // A package-lock.json also exists higher in the home directory. Without an
  // explicit root, Turbopack treats that directory as the workspace and can
  // mix file watching/cache state outside this project.
  turbopack: {
    root: process.cwd(),
  },
  env: {
    // Vercel's env var when deployed, the local git HEAD otherwise; see
    // resolveCommitSha. Still undefined when neither is available, which
    // every consumer (Footer, colophon) already handles.
    NEXT_PUBLIC_COMMIT_SHA: resolveCommitSha(),
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  async redirects() {
    // The retired list pages 301 to the merged work grid. Exact-path
    // sources only: detail routes (/projects/[id], /open-source/[slug],
    // /achievements/[id]) keep resolving as before.
    return [
      { source: "/projects", destination: "/#work", permanent: true },
      { source: "/open-source", destination: "/#work", permanent: true },
      { source: "/achievements", destination: "/#work", permanent: true },
      // About and Contact merged into one page; old bookmarks/search
      // results for /contact land on the merged section instead of 404.
      { source: "/contact", destination: "/about#contact", permanent: true },
    ];
  },
};

export default nextConfig;
