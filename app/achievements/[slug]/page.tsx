// app/achievements/[slug]/page.tsx
// Slug-addressed detail route. Legacy numeric ids (/achievements/5) are
// caught by this same route and 301'd to the canonical slug URL; see
// slugForLegacyId below.
import { getAchievementBySlug, getAchievementWithTags, getAllAchievements } from "@/lib/database";
import { notFound, permanentRedirect } from "next/navigation";
import AchievementDetailClient from "@/components/AchievementDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const achievements = await getAllAchievements();
  return achievements.map((achievement) => ({
    slug: achievement.slug,
  }));
}

// Real slugs always contain a letter, so a digits-only segment is
// unambiguously a legacy id link.
async function slugForLegacyId(slug: string): Promise<string | null> {
  if (!/^\d+$/.test(slug)) return null;
  const achievement = await getAchievementWithTags(parseInt(slug, 10));
  return achievement?.slug ?? null;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const achievement = await getAchievementBySlug(slug);

  if (!achievement) {
    return {
      title: "Achievement Not Found",
    };
  }

  return {
    title: `${achievement.name} - Chanrattnak Mong`,
    description: achievement.description,
  };
}

export default async function AchievementDetailPage({ params }: Props) {
  const { slug } = await params;
  const achievement = await getAchievementBySlug(slug);

  if (!achievement) {
    const canonical = await slugForLegacyId(slug);
    if (canonical) permanentRedirect(`/achievements/${canonical}`);
    notFound();
  }

  return <AchievementDetailClient achievement={achievement} />;
}
