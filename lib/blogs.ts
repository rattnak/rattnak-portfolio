import { prisma } from "./prisma";

export async function getPublishedBlogPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
  });
}

export async function getRecentBlogPosts(limit: number = 3) {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}
