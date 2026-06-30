"use client";

import { useState } from "react";
import { DownloadCloud, FileText, ArrowLeft, Loader2, Lightbulb, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { templateMap } from "@/components/ResumeTemplates";
import { ExtractedData } from "@/lib/types";

interface ResumePreviewPageProps {
    data: ExtractedData;
    templateId: string;
    onBack: () => void;
    suggestions?: string[];   // from ATS analysis
    missingKeywords?: string[];
}

const GENERIC_SUGGESTIONS = [
    "Add quantifiable metrics to your experience bullets (e.g., 'Improved performance by 40%')",
    "Use strong action verbs: Led, Built, Designed, Architected, Deployed, Optimised",
    "Include a clear LinkedIn profile URL so recruiters can find you easily",
    "Add a GitHub link to showcase your actual code to technical interviewers",
    "Ensure each project description answers: What did you build? With what? What was the impact?",
    "Keep bullet points concise — 1-2 lines each, starting with a verb",
    "Tailor your summary section to the specific job role you are applying for",
    "Include your CGPA if it is above 7.5 — many ATS systems filter by it",
];

export default function ResumePreviewPage({
    data,
    templateId,
    onBack,
    suggestions = [],
    missingKeywords = [],
}: ResumePreviewPageProps) {
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
    const [showAllSuggestions, setShowAllSuggestions] = useState(false);

    const PreviewComponent = templateMap[templateId] || templateMap["classic"];

    // Merge AI suggestions with generic ones, deduplicate
    const allSuggestions = [...new Set([...suggestions, ...GENERIC_SUGGESTIONS])];
    const visibleSuggestions = showAllSuggestions ? allSuggestions : allSuggestions.slice(0, 5);

    // PDF download — prints the rendered template HTML via window.print
    const handleDownloadPdf = async () => {
        setIsDownloadingPdf(true);
        try {
            // Use browser print for perfect visual match
            const printWindow = window.open("", "_blank", "width=900,height=1200");
            if (!printWindow) throw new Error("Popup blocked");

            const templateEl = document.getElementById("resume-template-canvas");
            const html = templateEl?.outerHTML || "";

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Resume</title>
                    <meta charset="utf-8" />
                    <style>
                        @page { size: A4; margin: 0; }
                        body { margin: 0; padding: 0; background: white; }
                        * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    </style>
                    <link rel="stylesheet" href="/globals.css" />
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body>${html}</body>
                </html>
            `);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
                setIsDownloadingPdf(false);
            }, 1200);
        } catch (err) {
            console.error(err);
            // Fallback to API
            try {
                const res = await fetch("/api/download/pdf", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ resumeData: data }),
                });
                if (!res.ok) throw new Error("PDF generation failed");
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `resume.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (fallbackErr) {
                alert("Failed to download PDF.");
            } finally {
                setIsDownloadingPdf(false);
            }
        }
    };

    const handleDownloadDocx = async () => {
        setIsDownloadingDocx(true);
        try {
            const res = await fetch("/api/download/docx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeData: data }),
            });
            if (!res.ok) throw new Error("DOCX generation failed");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `resume.docx`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Failed to download DOCX.");
        } finally {
            setIsDownloadingDocx(false);
        }
    };

    return (
        <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4">
            {/* Back button */}
            <button
                onClick={onBack}
                className="flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Templates
            </button>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* ── Left: Resume Canvas ─────────────────────────────────── */}
                <div className="flex-1 min-w-0">
                    <div className="bg-gray-200 rounded-2xl p-6 shadow-inner overflow-auto">
                        <div id="resume-template-canvas" className="origin-top mx-auto" style={{ width: 794 }}>
                            <PreviewComponent data={data} />
                        </div>
                    </div>
                </div>

                {/* ── Right: Controls + Suggestions ───────────────────────── */}
                <div className="xl:w-80 shrink-0 flex flex-col gap-5">

                    {/* Export buttons */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Export Resume</h3>
                            <p className="text-xs text-gray-400 mt-1">Download your AI-optimized resume</p>
                        </div>
                        <button
                            onClick={handleDownloadPdf}
                            disabled={isDownloadingPdf}
                            className="w-full py-3.5 px-4 bg-gray-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-md active:scale-95 disabled:opacity-60"
                        >
                            {isDownloadingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                            Download PDF
                        </button>
                        <button
                            onClick={handleDownloadDocx}
                            disabled={isDownloadingDocx}
                            className="w-full py-3.5 px-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all active:scale-95 disabled:opacity-60"
                        >
                            {isDownloadingDocx ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                            Download DOCX
                        </button>
                        <p className="text-[11px] text-gray-400 text-center">Powered by Gemini AI · ATS Optimized</p>
                    </div>

                    {/* Missing Keywords */}
                    {missingKeywords && missingKeywords.length > 0 && (
                        <div className="bg-orange-50 rounded-2xl border border-orange-100 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-orange-700 flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-4 h-4" /> Add These Keywords
                            </h3>
                            <p className="text-xs text-orange-600 mb-3 leading-relaxed">
                                These in-demand skills are missing from your resume. Adding them can significantly boost your ATS score:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {missingKeywords.slice(0, 12).map((kw, i) => (
                                    <span key={i} className="text-[11px] bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-medium">
                                        + {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Improvement Suggestions */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-1">
                            <Lightbulb className="w-4 h-4 text-yellow-500" /> AI Improvement Suggestions
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">Apply these changes to strengthen your resume:</p>

                        <ul className="space-y-3">
                            {visibleSuggestions.map((sugg, i) => (
                                <li key={i} className="flex gap-2.5 text-xs text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>{sugg}</span>
                                </li>
                            ))}
                        </ul>

                        {allSuggestions.length > 5 && (
                            <button
                                onClick={() => setShowAllSuggestions(!showAllSuggestions)}
                                className="mt-3 w-full text-xs font-medium text-blue-600 flex items-center justify-center gap-1 hover:text-blue-800 transition-colors"
                            >
                                {showAllSuggestions
                                    ? <><ChevronUp className="w-3 h-3" /> Show less</>
                                    : <><ChevronDown className="w-3 h-3" /> Show {allSuggestions.length - 5} more suggestions</>
                                }
                            </button>
                        )}
                    </div>

                    {/* Quick checklist */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
                        <h3 className="text-sm font-bold text-blue-800 mb-3">✅ Before You Send</h3>
                        <ul className="space-y-2 text-xs text-blue-700">
                            {[
                                "Spell-check the entire document",
                                "Verify email & phone are correct",
                                "Confirm all links are working",
                                "Save as PDF before attaching",
                                "Customize for each job description",
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded border border-blue-300 bg-white shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
