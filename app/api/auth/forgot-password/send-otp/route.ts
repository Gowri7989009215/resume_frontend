import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { getEmailErrorMessage, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email: rawEmail } = await req.json();
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
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

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.oTPSession.upsert({
      where: { email },
      update: {
        otp,
        expiresAt,
        attempts: 0,
        verified: false,
      },
      create: {
        email,
        otp,
        expiresAt,
        attempts: 0,
        verified: false,
      },
    });

    const { error } = await sendEmail({
      to: email,
      subject: "Reset your ResumeIQ password",
      text: `Your ResumeIQ password reset code is ${otp}. It expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin: 0 0 16px;">Reset your ResumeIQ password</h2>
          <p style="margin: 0 0 16px;">Use this 6-digit code to continue changing your password:</p>
          <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 0 0 16px;">${otp}</p>
          <p style="margin: 0;">This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend failed to send password reset OTP:", error);
      const detail = getEmailErrorMessage(error);

      return NextResponse.json(
        {
          error: process.env.NODE_ENV === "development" ? detail : "Failed to send reset email",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Reset code sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending password reset OTP:", error);
    return NextResponse.json(
      { error: "Failed to send reset code" },
      { status: 500 }
    );
  }
}
