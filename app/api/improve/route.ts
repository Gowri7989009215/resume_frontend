import { NextRequest, NextResponse } from "next/server";
import { generateImprovedResume, generateResumeText } from "@/lib/template";
import { ExtractedData } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const extractedData: ExtractedData = body.extractedData;

        if (!extractedData) {
            return NextResponse.json(
                { error: "Missing extractedData in request body" },
                { status: 400 }
            );
        }

        const improvedResume = generateImprovedResume(extractedData);
        const resumeText = generateResumeText(improvedResume);

        return NextResponse.json({ improvedResume, resumeText }, { status: 200 });
    } catch (error: unknown) {
        console.error("[/api/improve] Error:", error);
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
