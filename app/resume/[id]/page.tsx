"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Download, BarChart3 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { AnalysisResult, ExtractedData } from "@/lib/types";

export default function ResumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  
  const resumeId = params.id as string;
  const [resume, setResume] = useState<any>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (resumeId) {
      fetchResume();
    }
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      // In a real app, you'd fetch from the database
      // For now, we'll get from sessionStorage if available
      const stored = sessionStorage.getItem("resumeAnalysis");
      if (stored) {
        const data = JSON.parse(stored);
        setAnalysis(data);
      }
    } catch (error) {
      toast.error("Failed to load resume");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/templates");
        if (response.ok) {
          const data = await response.json();
          setTemplates(data.templates);
        }
      } catch (error) {
        console.error("Failed to fetch templates");
      }
    };

    fetchTemplates();
  }, []);

  const handleDownloadPDF = async () => {
    if (!analysis) return;
    setIsDownloading(true);

    try {
      const response = await fetch("/api/download/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: analysis.extractedData }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume.pdf";
        a.click();
        toast.success("Resume downloaded");
      } else {
        toast.error("Failed to download resume");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsDownloading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Resume Details</h1>
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {analysis ? (
            <>
              {/* ATS Score Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <BarChart3 className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">ATS Score</p>
                            <div className="text-4xl font-bold text-blue-600">
                              {analysis.overallScore}
                              <span className="text-xl text-slate-600 dark:text-slate-400">/100</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                          Section Scores
                        </p>
                        <div className="space-y-2">
                          {analysis.sectionScores.map((score, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">{score.name}</span>
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {score.score}/{score.maxScore}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Improvement Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-blue-600 mt-1">✓</span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {suggestion}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Templates */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Resume Templates</CardTitle>
                    <CardDescription>
                      Select a template to generate your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {templates.slice(0, 12).map((template) => (
                        <motion.button
                          key={template.id}
                          whileHover={{ y: -2 }}
                          onClick={() => {
                            sessionStorage.setItem("selectedTemplate", template.id);
                            router.push(`/templates/${template.id}`);
                          }}
                          className="text-left p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {template.name}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {template.category}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            {template.isATS && (
                              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                                ATS-Friendly
                              </span>
                            )}
                            {template.isResponsive && (
                              <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                                Responsive
                              </span>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Download */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Download Resume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleDownloadPDF} disabled={isDownloading} className="gap-2">
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download as PDF
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                No resume data found. Please upload a resume first.
              </p>
              <Link href="/upload">
                <Button className="mt-4">Upload Resume</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
