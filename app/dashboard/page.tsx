"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, Trash2, Plus, LogOut, Settings, FileText, TrendingUp } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Resume {
  id: string;
  resumeName: string;
  originalFileName: string;
  fileType: string;
  createdAt: string;
  atsReports: Array<{
    overallScore: number;
    createdAt: string;
  }>;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchResumes();
    }
  }, [status]);

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes");
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      }
    } catch (error) {
      toast.error("Failed to load resumes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const response = await fetch(`/api/resumes?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setResumes(resumes.filter((r) => r.id !== id));
        toast.success("Resume deleted");
      } else {
        toast.error("Failed to delete resume");
      }
    } catch (error) {
      toast.error("An error occurred");
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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">ResumeIQ Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-300">{session?.user?.name || session?.user?.email}</span>
              <Link href="/profile">
                <Button size="sm" variant="ghost">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back, {session?.user?.name?.split(" ")[0]}!
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Upload and analyze your resumes to get ATS-friendly suggestions.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex gap-4"
          >
            <Link href="/upload">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Upload New Resume
              </Button>
            </Link>
          </motion.div>

          {/* Resume Library */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>My Resumes</CardTitle>
                <CardDescription>
                  View and manage all your uploaded resumes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resumes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      No resumes uploaded yet.
                    </p>
                    <Link href="/upload">
                      <Button>Upload Your First Resume</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resumes.map((resume) => (
                      <motion.div
                        key={resume.id}
                        whileHover={{ y: -2 }}
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                              {resume.resumeName}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {resume.originalFileName}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                            {resume.fileType.toUpperCase()}
                          </span>
                        </div>

                        {resume.atsReports.length > 0 && (
                          <div className="mb-3 p-2 bg-green-50 dark:bg-green-900 rounded">
                            <p className="text-xs text-slate-600 dark:text-slate-300">
                              ATS Score:{" "}
                              <span className="font-bold text-green-600 dark:text-green-400">
                                {resume.atsReports[0].overallScore}/100
                              </span>
                            </p>
                          </div>
                        )}

                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </p>

                        <div className="flex gap-2">
                          <Link href={`/resume/${resume.id}`} className="flex-1">
                            <Button size="sm" className="w-full" variant="outline">
                              View
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(resume.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {resumes.length}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Resumes Uploaded
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {resumes.filter((r) => r.atsReports.length > 0).length}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    ATS Reports
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(
                      resumes.reduce((acc, r) => acc + (r.atsReports[0]?.overallScore || 0), 0) /
                        Math.max(resumes.filter((r) => r.atsReports.length > 0).length, 1)
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Avg ATS Score
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analytics Chart */}
          {resumes.filter(r => r.atsReports.length > 0).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    ATS Score History
                  </CardTitle>
                  <CardDescription>
                    Track your resume improvements over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[...resumes].filter(r => r.atsReports.length > 0).reverse().map(r => ({
                          date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                          score: r.atsReports[0]?.overallScore || 0,
                          name: r.resumeName
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" tick={{fontSize: 12}} />
                        <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#2563eb" 
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          name="ATS Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
