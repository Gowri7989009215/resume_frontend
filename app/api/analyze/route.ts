import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

/**
 * POST /api/analyze
 *
 * Thin proxy: forwards the uploaded resume file to the Express backend
 * (BACKEND_URL/api/analyze) and streams the JSON result back to the client.
 *
 * The session userId is appended to the FormData so the backend can
 * optionally persist the analysis result to the database.
 */
export async function POST(req: NextRequest) {
    try {
        // Resolve the backend base URL.
        // BACKEND_URL  → server-side only (preferred for SSR proxies)
        // NEXT_PUBLIC_BACKEND_URL → fallback (also works server-side)
        const backendUrl =
            process.env.BACKEND_URL ||
            process.env.NEXT_PUBLIC_BACKEND_URL ||
            "http://localhost:5000";

        // Get the current session so we can pass userId to the backend
        const session = await auth();

        // Read the incoming FormData (file, ocrText, resumeName)
        const incomingFormData = await req.formData();

        // Build a new FormData to forward
        const forwardFormData = new FormData();

        const file = incomingFormData.get("resume") as File | null;
        const resumeName = incomingFormData.get("resumeName") as string | null;
        const ocrText = incomingFormData.get("ocrText") as string | null;

        if (!file) {
            return NextResponse.json(
                { error: "No resume file uploaded" },
                { status: 400 }
            );
        }

        forwardFormData.append("resume", file, file.name);

        if (resumeName) forwardFormData.append("resumeName", resumeName);
        if (ocrText) forwardFormData.append("ocrText", ocrText);

        // Pass userId so the backend can persist the result (optional)
        if (session?.user?.id) {
            forwardFormData.append("userId", session.user.id);
        }

        // Proxy to the Express backend
        const backendRes = await fetch(`${backendUrl}/api/analyze`, {
            method: "POST",
            body: forwardFormData,
            // Note: do NOT set Content-Type — fetch sets it automatically
            // with the correct multipart boundary when body is FormData.
        });

        const data = await backendRes.json();

        // Increment the counter (fire-and-forget) if analysis succeeded
        if (backendRes.ok) {
            fetch(`${req.nextUrl.origin}/api/counter`, { method: "POST" }).catch(
                () => {}
            );
        }

        return NextResponse.json(data, { status: backendRes.status });
    } catch (error: unknown) {
        console.error("[/api/analyze proxy] Error:", error);
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
