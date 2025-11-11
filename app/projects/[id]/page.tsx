// app/projects/[id]/page.tsx
import { getAllProjects, getProjectWithTags } from "@/lib/database";
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/components/ProjectDetailClient";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const project = await getProjectWithTags(parseInt(id));

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.name} - Chanrattnak Mong`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectWithTags(parseInt(id));

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
