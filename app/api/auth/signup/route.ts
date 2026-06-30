import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email: rawEmail, password } = await req.json();
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        authProvider: "email",
        emailVerified: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
