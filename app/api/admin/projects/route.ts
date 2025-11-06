import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    await checkAdminAccess();

    const body = await request.json();
    const {
      name,
      description,
      url,
      type,
      tags,
      imageUrl,
      githubUrl,
      liveUrl,
      featured,
      startDate,
      endDate,
    } = body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        url,
        type,
        tags,
        imageUrl,
        githubUrl,
        liveUrl,
        featured,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
