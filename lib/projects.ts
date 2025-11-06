import { ProjectType } from "@prisma/client";
import { prisma } from "./prisma";

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: [
      { featured: "desc" },
      { endDate: "desc" },
      { startDate: "desc" }
    ],
  });
}

export async function getCodingProjects() {
  return prisma.project.findMany({
    where: { type: ProjectType.CODING },
    orderBy: [
      { featured: "desc" },
      { endDate: "desc" },
      { startDate: "desc" }
    ],
  });
}

export async function getCaseStudies() {
  return prisma.project.findMany({
    where: { type: ProjectType.CASE_STUDY },
    orderBy: [
      { featured: "desc" },
      { endDate: "desc" },
      { startDate: "desc" }
    ],
  });
}

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: [
      { endDate: "desc" },
      { startDate: "desc" }
    ],
    take: 6,
  });
}