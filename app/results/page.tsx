"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AnalysisResult, ImprovedResume } from "@/lib/types";
import ScoreCard from "@/components/ScoreCard";
import SectionBreakdown from "@/components/SectionBreakdown";
import ResumePreview from "@/components/ResumePreview";
import Link from "next/link";

export default function ResultsPage() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [isImproving, setIsImproving] = useState(false);
    const [improvedResume, setImprovedResume] = useState<ImprovedResume | null>(null);
    const [optimizedText, setOptimizedText] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showImproved, setShowImproved] = useState(false);

    useEffect(() => {
        const stored = sessionStorage.getItem("resumeAnalysis");
        if (!stored) {
            router.replace("/upload");
            return;
        }
        try {
            setResult(JSON.parse(stored));
        } catch {
            router.replace("/upload");
        }
    }, [router]);

    const handleImprove = async () => {
        if (!result) return;
        setIsImproving(true);
        setError(null);

        try {
            const res = await axios.post<{ improvedResume: ImprovedResume; resumeText: string }>(
                "/api/improve",
                { extractedData: result.extractedData }
            );
            setImprovedResume(res.data.improvedResume);
            setOptimizedText(res.data.resumeText);
            setShowImproved(true);
        } catch (err: unknown) {
            const msg =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : "Failed to generate improved resume. Please try again.";
            setError(msg);
        } finally {
            setIsImproving(false);
        }
    };

    const handleDownload = async () => {
        if (!improvedResume) return;
        setIsDownloading(true);
        setError(null);

        try {
            const res = await axios.post(
                "/api/download",
                { resumeData: improvedResume },
                { responseType: "blob" }
            );

            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${improvedResume.fullName.replace(/\s+/g, "_")}_ATS_Resume.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            setError("Failed to download PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (!result) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm">Loading your results…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            {/* Header */}
            <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 text-sm font-semibold px-4 py-1.5 rounded-full border border-emerald-100 mb-4">
                    ✅ Analysis Complete
                </span>
                <h1 className="text-4xl font-black text-slate-900 mb-3">
                    Your Resume Report
                </h1>
                <p className="text-slate-500 text-base">
                    Here&apos;s your detailed ATS analysis with improvement suggestions.
                </p>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mb-6 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 max-w-2xl mx-auto"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left column: score + section breakdown */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <ScoreCard score={result.overallScore} />
                    <SectionBreakdown sectionScores={result.sectionScores} />
                </div>

                {/* Right column: extracted data, missing keywords, suggestions */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <ResumePreview data={result.extractedData} />

                    {/* Missing Keywords */}
                    {result.missingKeywords.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
                        >
                            <h2 className="text-lg font-bold text-slate-800 mb-4">
                                Missing Keywords
                            </h2>
                            <p className="text-sm text-slate-500 mb-3">
                                Add these keywords to increase your ATS match rate:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {result.missingKeywords.map((kw) => (
                                    <span
                                        key={kw}
                                        className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-full border border-red-100 font-medium"
                                    >
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Suggestions */}
                    {result.suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
                        >
                            <h2 className="text-lg font-bold text-slate-800 mb-4">
                                Improvement Suggestions
                            </h2>
                            <ul className="space-y-3">
                                {result.suggestions.map((s, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm">
                                        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <svg className="w-3 h-3 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" />
                                            </svg>
                                        </div>
                                        <span className="text-slate-700">{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {/* Improved Resume Preview */}
                    <AnimatePresence>
                        {showImproved && improvedResume && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-2xl shadow-md border border-emerald-100 p-6"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Your Optimized Resume is Ready!
                                    </h2>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm space-y-2 mb-4">
                                    <p className="font-bold text-xl text-slate-800">{improvedResume.fullName}</p>
                                    <p className="text-slate-500 font-medium">{improvedResume.email}</p>
                                    <p className="text-slate-600 mt-2 leading-relaxed">{improvedResume.summary}</p>
                                    <div className="mt-3">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Skills:</span>
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {improvedResume.skills.slice(0, 8).map((s) => (
                                                <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-100">
                                                    {s}
                                                </span>
                                            ))}
                                            {improvedResume.skills.length > 8 && (
                                                <span className="text-xs text-slate-400 self-center">+{improvedResume.skills.length - 8} more</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {optimizedText && (
                                    <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4 max-h-80 overflow-y-auto text-xs font-mono whitespace-pre-wrap text-slate-700">
                                        {optimizedText}
                                    </div>
                                )}

                                <button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all shadow-md flex items-center justify-center gap-2 ${isDownloading
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-emerald-200 cursor-pointer"
                                        }`}
                                >
                                    {isDownloading ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Generating PDF…
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            ⬇ Download Optimized Resume PDF
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Action Buttons */}
            <motion.div
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                {!showImproved && (
                    <button
                        onClick={handleImprove}
                        disabled={isImproving}
                        className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all shadow-lg ${isImproving
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 hover:scale-105 active:scale-95 cursor-pointer"
                            }`}
                    >
                        {isImproving ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Generating…
                            </>
                        ) : (
                            "✨ Make My Resume Super"
                        )}
                    </button>
                )}

                <Link
                    href="/upload"
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-all"
                >
                    ↩ Analyze Another Resume
                </Link>
            </motion.div>
        </div>
    );
}
