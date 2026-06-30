import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail, otp: rawOtp } = await req.json();
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
    const otp = typeof rawOtp === "string" ? rawOtp.trim() : "";

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find OTP session
    const otpSession = await prisma.oTPSession.findUnique({
      where: { email },
    });

    if (!otpSession) {
      return NextResponse.json(
        { error: "No OTP request found for this email" },
        { status: 404 }
      );
    }

    // Check expiration
    if (new Date() > otpSession.expiresAt) {
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    // Check attempts
    if (otpSession.attempts >= 5) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new OTP" },
        { status: 429 }
      );
    }

    // Verify OTP
    if (otpSession.otp !== otp) {
      await prisma.oTPSession.update({
        where: { email },
        data: { attempts: otpSession.attempts + 1 },
      });

      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Mark as verified
    await prisma.oTPSession.update({
      where: { email },
      data: { verified: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
