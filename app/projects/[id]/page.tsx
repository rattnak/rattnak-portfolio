// app/projects/[id]/page.tsx
import { mockProjects } from "@/lib/mockData";
import { notFound } from "next/navigation";
import ProjectDetailClient from "@/components/ProjectDetailClient";

type Props = {
  params: {
    id: string;
  };
};

export async function generateStaticParams() {
  return mockProjects.map((project) => ({
    id: project.id.toString(),
  }));
}

export async function generateMetadata({ params }: Props) {
  const project = mockProjects.find((p) => p.id.toString() === params.id);

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

export default function ProjectDetailPage({ params }: Props) {
  const project = mockProjects.find((p) => p.id.toString() === params.id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
