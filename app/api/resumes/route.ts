import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

// GET all resumes for authenticated user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        resumeName: true,
        originalFileName: true,
        fileType: true,
        createdAt: true,
        updatedAt: true,
        atsReports: {
          select: {
            overallScore: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    return NextResponse.json(resumes, { status: 200 });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

// DELETE a resume
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("id");

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete resume and all related data
    await prisma.resume.delete({
      where: { id: resumeId },
    });

    return NextResponse.json(
      { success: true, message: "Resume deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
