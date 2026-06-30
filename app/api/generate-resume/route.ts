import { NextRequest, NextResponse } from "next/server";
import { AIContentImprover } from "@/lib/ai-content-improver";
import { ExtractedData } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const extractedData: ExtractedData = body.extractedData;
        const templateId: string = body.templateId; // Ojas, Gambeera, Nova, Elite, Classic

        if (!extractedData) {
            return NextResponse.json(
                { error: "Missing extractedData in request body" },
                { status: 400 }
            );
        }

        if (!templateId) {
            return NextResponse.json(
                { error: "Missing templateId in request body" },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured in the environment variables." },
                { status: 500 }
            );
        }

        // Improve grammar, enhance action verbs, add metrics and impact statements using AI
        const improvedData = await AIContentImprover.improveResumeContent(extractedData, {
            improveGrammar: true,
            enhanceActionVerbs: true,
            addMetrics: true,
            professionalTone: true
        });

        // Add placeholders if data is missing, so the UI can display "Add your achievements here"
        if (!improvedData.summary || improvedData.summary.trim().length === 0) {
            improvedData.summary = "[Add your professional summary here. Highlight your key achievements and goals.]";
        }
        
        if (!improvedData.experience || improvedData.experience.length === 0) {
            improvedData.experience = [
                {
                    title: "[Your Job Title]",
                    company: "[Company Name]",
                    dates: "[Start Date] - [End Date]",
                    location: "[Location]",
                    description: [
                        "[Add your achievement here. Include metrics (%, numbers)]",
                        "[Add your responsibilities here. Start with action verbs]"
                    ]
                }
            ];
        }

        if (!improvedData.skills || improvedData.skills.length === 0) {
            improvedData.skills = ["Java", "Python", "React", "[Add more skills here]"];
        }
        
        if (!improvedData.projects || improvedData.projects.length === 0) {
            improvedData.projects = [
                {
                    title: "[Project Name]",
                     description: "[Add your project description here. What did you build? What technologies did you use?]",
                     technologies: ["[Tech 1]", "[Tech 2]"]
                }
            ];
        }

        return NextResponse.json({ 
            improvedData, 
            templateId 
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("[/api/generate-resume] Error:", error);
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
