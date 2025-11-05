import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
