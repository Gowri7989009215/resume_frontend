import { NextRequest, NextResponse } from "next/server";
import { ATSScoringEngine } from "@/lib/ats-scoring-engine";
import { ResumeTransformer } from "@/lib/resume-transformer";
import { AIContentImprover } from "@/lib/ai-content-improver";
import { ExtractedData } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { resumeData, useAI = false } = body;

        if (!resumeData) {
            return NextResponse.json(
                { error: "Missing resumeData in request body" },
                { status: 400 }
            );
        }

        // Transform resume using professional templates
        let transformedResume = ResumeTransformer.transformResume(resumeData);
        
        // Add placeholders for missing sections
        transformedResume = ResumeTransformer.addPlaceholders(transformedResume);

        // Apply AI improvements if requested
        if (useAI) {
            try {
                const aiImproved = await AIContentImprover.improveResumeContent(resumeData, {
                    improveGrammar: true,
                    enhanceActionVerbs: true,
                    addMetrics: true,
                    professionalTone: true
                });
                
                // Merge AI improvements with transformed resume
                transformedResume = {
                    ...transformedResume,
                    summary: aiImproved.summary || transformedResume.summary,
                    experience: aiImproved.experience || transformedResume.experience,
                    projects: aiImproved.projects || transformedResume.projects
                };
            } catch (error) {
                console.error("AI improvement failed:", error);
                // Continue with non-AI transformation
            }
        }

        // Calculate new ATS score
        const resumeForScoring: ExtractedData = {
            ...resumeData,
            ...transformedResume,
            rawText: resumeData.rawText || ""
        };
        const newATSScore = ATSScoringEngine.calculateATSScore(resumeForScoring);

        // Generate local improvement suggestions
        const suggestions = AIContentImprover.generateResumeSuggestions(resumeData);

        return NextResponse.json({
            success: true,
            transformedResume,
            newATSScore,
            suggestions,
            improvements: {
                addedPlaceholders: !resumeData.experience || resumeData.experience.length === 0,
                enhancedExperience: true,
                professionalSummary: !!transformedResume.summary,
                improvedSkills: transformedResume.skills.length > (resumeData.skills?.length || 0),
                aiEnhanced: useAI
            }
        });

    } catch (error) {
        console.error("Error in make-resume-super:", error);
        return NextResponse.json(
            { 
                error: "Failed to transform resume",
                details: error instanceof Error ? error.message : "Unknown error"
            },
            { status: 500 }
        );
    }
}
