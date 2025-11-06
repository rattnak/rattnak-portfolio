import { prisma } from "./prisma";

export async function getCompetitions() {
  return prisma.competition.findMany({
    orderBy: { date: "desc" },
  });
}

export async function getFeaturedCompetitions() {
  return prisma.competition.findMany({
    where: { featured: true },
    orderBy: { date: "desc" },
    take: 6,
  });
}
