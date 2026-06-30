"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { templateMap } from "@/components/ResumeTemplates";
import type { ExtractedData } from "@/lib/types";

interface TemplateSelectionPageProps {
    onSelectTemplate: (templateId: string) => void;
}

interface TemplateOption {
    id: string;
    name: string;
    category?: string;
    description: string;
    atsScore?: number;
    isATS?: boolean;
    preview?: {
        name?: string;
        role?: string;
        skills?: string[];
    };
}

function getPreviewData(tpl: TemplateOption): ExtractedData {
    const preview = tpl.preview || {};
    const email = "hello@example.com";
    const phone = "+1 234 567 890";

    return {
        fullName: preview.name || "Alex Morgan",
        email,
        phone,
        linkedin: "",
        github: "",
        portfolio: "",
        personalInfo: {
            name: preview.name || "Alex Morgan",
            role: preview.role || `${tpl.category || "Modern"} Professional`,
            email,
            phone,
            location: "New York, USA"
        },
        summary: "Dedicated professional with extensive experience driving successful business outcomes through strategic planning.",
        experience: [
            {
                title: "Senior Role",
                company: "Top Tech Corp",
                dates: "2020 - Present",
                location: "Remote",
                description: ["Led a team of 10", "Increased revenue by 50%"]
            }
        ],
        skills: preview.skills || ["Strategy", "Leadership", "Analytics", "Operations"],
        education: [
            {
                degree: "BS Computer Science",
                institution: "State University",
                dates: "2018"
            }
        ],
        projects: [],
        rawText: ""
    };
}

export default function TemplateSelectionPage({ onSelectTemplate }: TemplateSelectionPageProps) {
    const [templates, setTemplates] = useState<TemplateOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await fetch("/api/templates", { method: "POST" });
                const data = await res.json();
                if (data.templates) {
                    setTemplates(data.templates);
                }
            } catch (err) {
                console.error("Failed to fetch templates", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-gray-500 font-medium">Loading templates...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <header className="text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Choose Your Layout</h2>
                <p className="text-lg text-gray-500 mt-3">
                    Select a professional template. Our AI will automatically format and optimize your content for it.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((tpl) => {
                    const PreviewComponent = templateMap[tpl.id] || templateMap.classic;
                    const isSelected = selected === tpl.id;
                    const previewData = getPreviewData(tpl);

                    return (
                        <div 
                            key={tpl.id}
                            onClick={() => setSelected(tpl.id)}
                            className={`group cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 border-4 bg-white shadow-sm hover:shadow-xl ${isSelected ? 'border-blue-600 outline outline-4 outline-blue-100' : 'border-transparent hover:border-gray-200'}`}
                        >
                            <div className="bg-gray-50 relative pointer-events-none p-4 h-80 overflow-hidden border-b border-gray-100 flex items-start justify-center">
                                {/* Miniature Preview Wrapper */}
                                <div className="transform scale-[0.4] origin-top shadow-xl">
                                    <PreviewComponent data={previewData} />
                                </div>

                                {isSelected && (
                                    <div className="absolute top-4 right-4 bg-blue-600 rounded-full p-1 text-white shadow-lg z-10 animate-in zoom-in">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center justify-between">
                                    {tpl.name}
                                    <span className="ml-3 shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                                        ATS {tpl.atsScore || 100}
                                    </span>
                                </h3>
                                <p className="text-sm text-gray-500">{tpl.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center mt-12 pt-8 sticky bottom-8 z-20">
                <button 
                    onClick={() => selected && onSelectTemplate(selected)}
                    disabled={!selected}
                    className="px-12 py-4 rounded-2xl bg-gray-900 text-white font-bold text-lg hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 flex items-center gap-3"
                >
                    Apply Template & Generate
                </button>
            </div>
        </div>
    );
}
