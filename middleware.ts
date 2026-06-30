import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/resumes",
  "/api/resumes",
  "/api/reports",
  "/api/account",
];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = [
  "/auth/signin",
  "/auth/signup",
];

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Check if route is auth route
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect to signin if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(
      new URL("/auth/signin?callbackUrl=" + request.nextUrl.pathname, request.url)
    );
  }

  // Redirect to dashboard if accessing auth routes with session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
