"use client";

import { useState } from "react";
import UploadPage from "@/components/UploadPage";
import ScoreDashboard from "@/components/ScoreDashboard";
import TemplateSelectionPage from "@/components/TemplateSelectionPage";
import ResumePreviewPage from "@/components/ResumePreviewPage";
import { Loader2 } from "lucide-react";
import { ExtractedData } from "@/lib/types";

// User Flow: "upload" -> "score" -> "select_template" -> "generating" -> "preview"
type Step = "upload" | "score" | "select_template" | "generating" | "preview";

export default function BuilderOrchestrator() {
    const [currentStep, setCurrentStep] = useState<Step>("upload");
    const [analysisData, setAnalysisData] = useState<any>(null); // ATS Score + Extracted Data
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [improvedResumeData, setImprovedResumeData] = useState<ExtractedData | null>(null);
    
    // Step 1: Handle Upload Complete
    const handleAnalyzeComplete = (data: any) => {
        setAnalysisData(data); // data has { score, evaluation, extractedData, ... }
        setCurrentStep("score");
    };

    // Step 2: "Make My Resume Super" Clicked
    const handleMakeSuperClick = () => {
        setCurrentStep("select_template");
    };

    // Step 3: Template Selected
    const handleTemplateSelected = async (templateId: string) => {
        setSelectedTemplate(templateId);
        setCurrentStep("generating");

        try {
            const res = await fetch("/api/generate-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                     extractedData: analysisData.extractedData || analysisData.data || analysisData, 
                     templateId 
                }),
            });
            
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || "Failed to generate resume");
            
            setImprovedResumeData(data.improvedData);
            setCurrentStep("preview");
        } catch (error) {
            console.error(error);
            alert("Failed to generate resume. Please ensure your GEMINI_API_KEY is configured in .env.local.");
            setCurrentStep("select_template");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {currentStep === "upload" && (
                    <UploadPage onAnalyzeComplete={handleAnalyzeComplete} />
                )}

                {currentStep === "score" && (
                    <ScoreDashboard 
                        analysisData={analysisData} 
                        onMakeSuperClick={handleMakeSuperClick} 
                    />
                )}

                {currentStep === "select_template" && (
                    <TemplateSelectionPage 
                        onSelectTemplate={handleTemplateSelected} 
                    />
                )}

                {currentStep === "generating" && (
                    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in zoom-in">
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-blue-100 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Applying AI Magic...</h2>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                Our AI is restructuring your resume, enhancing action verbs, and fixing grammar to perfectly fit the <span className="font-semibold text-blue-600 capitalize">{selectedTemplate}</span> template.
                            </p>
                        </div>
                    </div>
                )}

                {currentStep === "preview" && improvedResumeData && selectedTemplate && (
                    <ResumePreviewPage 
                        data={improvedResumeData}
                        templateId={selectedTemplate}
                        onBack={() => setCurrentStep("select_template")}
                        suggestions={analysisData?.suggestions || []}
                        missingKeywords={analysisData?.missingKeywords || []}
                    />
                )}
            </div>
        </div>
    );
}
