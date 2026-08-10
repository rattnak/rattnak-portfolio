import type { MetadataRoute } from "next";
import {
  getAllProjects,
  getAllAchievements,
  getAllPublishedBlogPosts,
  getOpenSourceContributionsGroupedByProject,
} from "@/lib/database";

const BASE_URL = "https://rattnak.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, achievements, posts, ossGroups] = await Promise.all([
    getAllProjects(),
    getAllAchievements(),
    getAllPublishedBlogPosts(),
    getOpenSourceContributionsGroupedByProject(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/projects",
    "/achievements",
    "/open-source",
    "/blog",
    "/contact",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...projects.map((p) => ({
      url: `${BASE_URL}/projects/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...achievements.map((a) => ({
      url: `${BASE_URL}/achievements/${a.id}`,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    ...ossGroups.map((g) => ({
      url: `${BASE_URL}/open-source/${g.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((b: { slug: string }) => ({
      url: `${BASE_URL}/blog/${b.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
