"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AnalysisResult } from "@/lib/types";

interface EnhancedResultsProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export default function EnhancedResults({ result, onNewAnalysis }: EnhancedResultsProps) {
  const [isImproving, setIsImproving] = useState(false);
  const [improvedResume, setImprovedResume] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(false);

  const handleMakeResumeSuper = async () => {
    setIsImproving(true);
    setError(null);

    try {
      const response = await axios.post('/api/make-resume-super', {
        resumeData: result.extractedData,
        useAI: useAI
      });

      setImprovedResume(response.data);
      sessionStorage.setItem('improvedResume', JSON.stringify(response.data.transformedResume));
    } catch (err) {
      setError('Failed to improve resume. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const resumeData = improvedResume?.transformedResume || result.extractedData;
      const response = await axios.post('/api/resume-pdf', resumeData, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.extractedData.fullName.replace(/\s+/g, "_")}_Professional_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download PDF. Please try again.');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-4">
            Resume Analysis Results
          </h1>
          <div className="flex justify-center items-center gap-4">
            <div className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
              {result.overallScore}
            </div>
            <div className="text-left">
              <div className="text-sm text-slate-600">ATS Score</div>
              <div className={`text-sm font-medium px-2 py-1 rounded ${getScoreBgColor(result.overallScore)}`}>
                {result.overallScore >= 80 ? 'Excellent' : 
                 result.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
          </div>
        </div>

        {/* Section Scores */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Section Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.sectionScores.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-slate-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-700">{section.name}</span>
                  <span className={`font-bold ${getScoreColor(section.score)}`}>
                    {section.score}/{section.maxScore}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      section.score >= 8 ? 'bg-green-500' :
                      section.score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(section.score / section.maxScore) * 100}%` }}
                    transition={{ delay: 0.2 + 0.1 * index }}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-2">{section.feedback}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        {result.missingKeywords.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Missing Keywords</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800 mb-3">
                Adding these keywords could improve your ATS score:
              </p>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {result.suggestions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Improvement Suggestions</h2>
            <div className="space-y-3">
              {result.suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg"
                >
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-800 text-sm">{suggestion}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Make Resume Super Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Transform Your Resume</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Make My Resume Super
                </h3>
                <p className="text-slate-600 text-sm">
                  Transform your resume into a professional, ATS-optimized format
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useAI"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="useAI" className="text-sm font-medium text-slate-700">
                  Use AI Enhancement
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: isImproving ? 1 : 1.02 }}
              whileTap={{ scale: isImproving ? 1 : 0.98 }}
              onClick={handleMakeResumeSuper}
              disabled={isImproving}
              className={`w-full py-3 rounded-xl font-semibold text-base transition-all shadow-md flex items-center justify-center gap-3 ${
                isImproving
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
              }`}
            >
              {isImproving ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Transforming Resume...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Make My Resume Super
                </>
              )}
            </motion.button>

            {useAI && (
              <div className="mt-3 text-xs text-slate-600">
                ⚡ AI enhancement will improve action verbs, add metrics, and professionalize your language
              </div>
            )}
          </div>
        </div>

        {/* Improved Results */}
        <AnimatePresence>
          {improvedResume && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-900">
                    ✨ Resume Transformed Successfully!
                  </h3>
                  <div className="text-right">
                    <div className="text-sm text-green-700">New ATS Score:</div>
                    <div className="text-2xl font-bold text-green-600">
                      {improvedResume.newATSScore.overallScore}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">Improvements Made:</h4>
                    <ul className="space-y-1 text-sm text-green-800">
                      {improvedResume.improvements.addedPlaceholders && (
                        <li>• Added professional placeholders for missing sections</li>
                      )}
                      {improvedResume.improvements.enhancedExperience && (
                        <li>• Enhanced experience descriptions with action verbs</li>
                      )}
                      {improvedResume.improvements.professionalSummary && (
                        <li>• Created compelling professional summary</li>
                      )}
                      {improvedResume.improvements.improvedSkills && (
                        <li>• Improved skills categorization and formatting</li>
                      )}
                      {improvedResume.improvements.aiEnhanced && (
                        <li>• Applied AI-powered content improvements</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-900 mb-2">Score Improvement:</h4>
                    <div className="text-2xl font-bold text-green-600">
                      +{improvedResume.newATSScore.overallScore - result.overallScore} points
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadPDF}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.href = '/resume-preview'}
                    className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Preview Resume
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewAnalysis}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Analyze Another Resume
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
