import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail, newPassword } = await req.json();
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const otpSession = await prisma.oTPSession.findUnique({
      where: { email },
    });

    if (!otpSession || !otpSession.verified) {
      return NextResponse.json(
        { error: "Please verify your reset code first" },
        { status: 400 }
      );
    }

    if (new Date() > otpSession.expiresAt) {
      return NextResponse.json(
        { error: "Reset code has expired" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "No password account found for this email" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.oTPSession.delete({
      where: { email },
    });

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
