"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface ResumeGeneratorProps {
  resumeData: any;
}

export default function ResumeGenerator({ resumeData }: ResumeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await axios.post("/api/resume-pdf", resumeData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resumeData.contact.name.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Generate Professional Resume PDF
          </h2>
          <p className="text-slate-600">
            Download your optimized resume in a professional PDF format
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <motion.button
          onClick={handleGeneratePDF}
          disabled={isGenerating}
          whileHover={{ scale: isGenerating ? 1 : 1.02 }}
          whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          className={`w-full py-4 rounded-xl font-semibold text-base transition-all shadow-md flex items-center justify-center gap-3 ${
            isGenerating
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 cursor-pointer"
          }`}
        >
          {isGenerating ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Generating Resume PDF...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume PDF
            </>
          )}
        </motion.button>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Your resume will be formatted professionally with sections for:
          </p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {["Contact", "Summary", "Skills", "Experience", "Projects", "Education"].map((section) => (
              <span
                key={section}
                className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-100 font-medium"
              >
                {section}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
