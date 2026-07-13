// app/open-source/[slug]/page.tsx
import { getOpenSourceContributionsGroupedByProject, getOpenSourceProjectGroupBySlug } from "@/lib/database";
import { getRepoInfo, formatStars } from "@/lib/github";
import { notFound } from "next/navigation";
import OpenSourceProjectDetailClient from "@/components/OpenSourceProjectDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const groups = await getOpenSourceContributionsGroupedByProject();
  return groups.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const group = await getOpenSourceProjectGroupBySlug(slug);

  if (!group) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${group.projectName} - Chanrattnak Mong`,
    description: `Open source contributions to ${group.projectName}`,
  };
}

export const revalidate = 3600;

export default async function OpenSourceProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const group = await getOpenSourceProjectGroupBySlug(slug);

  if (!group) {
    notFound();
  }

  // Stars/context fetched at build (cached daily); omitted on failure.
  const info = await getRepoInfo(group.repoUrl);
  const repoInfo = info ? { stars: formatStars(info.stars), description: info.description } : null;

  return <OpenSourceProjectDetailClient group={group} repoInfo={repoInfo} />;
}
