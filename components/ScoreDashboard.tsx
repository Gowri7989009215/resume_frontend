"use client";

import { CheckCircle, AlertCircle, TrendingUp, Sparkles, AlertTriangle } from "lucide-react";

interface ScoreDashboardProps {
    analysisData: any;
    onMakeSuperClick: () => void;
}

export default function ScoreDashboard({ analysisData, onMakeSuperClick }: ScoreDashboardProps) {
    if (!analysisData) return null;

    // Support both old shape {score, evaluation, keywordMatch} and new API shape
    // {overallScore, sectionScores, missingKeywords, suggestions}
    const score: number = analysisData.overallScore ?? analysisData.score ?? 0;
    const missingKeywords: string[] = analysisData.missingKeywords ?? [];
    const suggestions: string[] = analysisData.suggestions ?? [];

    const keywordScore = analysisData.sectionScores?.find((s: any) => s.name === "Keyword Match");
    const keywordMatchCount: number = keywordScore
        ? keywordScore.score
        : (analysisData.keywordMatch?.matchRate ?? 0);

    // Derive a readable evaluation from the score
    const evaluation: string =
        analysisData.evaluation ??
        (score >= 80 ? "Excellent! Your resume is highly ATS optimized." :
         score >= 60 ? "Good, but there are areas that can be improved." :
         score >= 40 ? "Needs work. Several important sections are missing or weak." :
                       "Poor. Your resume needs significant improvements for ATS systems.");

    const getScoreColor = (scoreNum: number) => {
        if (scoreNum >= 80) return "text-green-500";
        if (scoreNum >= 60) return "text-yellow-500";
        return "text-red-500";
    };

    const getScoreBgColor = (scoreNum: number) => {
        if (scoreNum >= 80) return "bg-green-50";
        if (scoreNum >= 60) return "bg-yellow-50";
        return "bg-red-50";
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <header className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Your Resume Analysis</h2>
                <p className="text-gray-500 mt-2">Here is how your resume currently performs against ATS systems.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <div className={`col-span-1 p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center ${getScoreBgColor(score)}`}>
                    <div className="relative mb-4">
                        <svg className="w-40 h-40 transform -rotate-90">
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-gray-200"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="70"
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={440}
                                strokeDashoffset={440 - (440 * score) / 100}
                                className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <span className={`text-4xl font-extrabold ${getScoreColor(score)}`}>{score}</span>
                            <span className="text-sm font-medium text-gray-500">/ 100</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">ATS Score</h3>
                    <p className="text-sm text-gray-600 mt-2 px-4 leading-relaxed">{evaluation}</p>
                </div>

                {/* Details Card */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-blue-500" /> Key Insights
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-sm text-gray-500 mb-1">Keyword Match</p>
                                <p className="text-2xl font-bold text-gray-900">{keywordMatchCount}%</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-sm text-gray-500 mb-1">Missing Keywords</p>
                                <p className="text-2xl font-bold text-gray-900">{missingKeywords?.length || 0}</p>
                            </div>
                        </div>

                        {missingKeywords && missingKeywords.length > 0 && (
                            <div className="mt-6">
                                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-500" /> 
                                    Consider adding these skills
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {missingKeywords.slice(0, 10).map((kw: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-100">
                                            {kw}
                                        </span>
                                    ))}
                                    {missingKeywords.length > 10 && (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                                            +{missingKeywords.length - 10} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-green-500" /> Expert Suggestions
                        </h3>
                        <ul className="space-y-3">
                            {suggestions?.map((sugg: string, i: number) => (
                                <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>{sugg}</span>
                                </li>
                            ))}
                            {(!suggestions || suggestions.length === 0) && (
                                <li className="text-sm text-gray-500 italic">No specific suggestions at this time.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center mt-12 pt-8 border-t border-gray-100">
                <button 
                    onClick={onMakeSuperClick}
                    className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 font-pj rounded-2xl hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                >
                    <Sparkles className="w-6 h-6 mr-3 text-yellow-300 group-hover:rotate-12 transition-transform" />
                    Make My Resume Super
                </button>
            </div>
        </div>
    );
}
