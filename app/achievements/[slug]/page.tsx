// app/achievements/[id]/page.tsx
import { getAllCompetitions, getCompetitionById } from "@/lib/database";
import { notFound } from "next/navigation";
import AchievementDetailClient from "@/components/AchievementDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const competitions = await getAllCompetitions();
  return competitions.map((competition) => ({
    id: competition.id.toString(),
  }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const achievement = await getCompetitionById(parseInt(id));

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
  const { id } = await params;
  const achievement = await getCompetitionById(parseInt(id));

  if (!achievement) {
    notFound();
  }

  return <AchievementDetailClient achievement={achievement} />;
}
