import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await checkAdminAccess();
    const { id } = await context.params;

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

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
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

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await checkAdminAccess();
    const { id } = await context.params;

    await prisma.project.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
