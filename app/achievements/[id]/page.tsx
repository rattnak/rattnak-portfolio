// app/achievements/[id]/page.tsx
import { mockCompetitions } from "@/lib/mockData";
import { notFound } from "next/navigation";
import AchievementDetailClient from "@/components/AchievementDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AchievementDetailPage({ params }: Props) {
  const { id } = await params;
  const achievement = mockCompetitions.find((c) => c.id === parseInt(id));

  if (!achievement) {
    notFound();
  }

  return <AchievementDetailClient achievement={achievement} />;
}
