"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ResumeGenerator from "@/components/ResumeGenerator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sectionCaptions } from "@/lib/resume-templates";

export default function ResumePreviewPage() {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "download">("preview");

  useEffect(() => {
    // Check if user has uploaded a resume
    const storedAnalysis = sessionStorage.getItem("resumeAnalysis");
    const storedImproved = sessionStorage.getItem("improvedResume");
    
    if (!storedAnalysis) {
      // No resume uploaded, redirect to upload page
      router.replace("/upload");
      return;
    }

    try {
      const analysis = JSON.parse(storedAnalysis);
      let data = analysis.extractedData;

      // If there's an improved resume, use that data
      if (storedImproved) {
        const improved = JSON.parse(storedImproved);
        data = {
          ...data,
          summary: improved.summary,
          skills: improved.skills,
          projects: improved.projects,
          education: improved.education,
          experience: improved.experience || data.experience,
          certifications: improved.certifications || data.certifications,
          achievements: improved.achievements || data.achievements,
          languages: improved.languages || data.languages,
          interests: improved.interests || data.interests
        };
      }

      setResumeData(data);
    } catch (error) {
      console.error("Error parsing resume data:", error);
      router.replace("/upload");
    }
  }, [router]);

  if (!resumeData) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading your resume...</p>
        </div>
      </div>
    );
  }

  const renderSection = (title: string, caption: string, children: React.ReactNode) => (
    <div className="mb-8">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
          {title}
        </h3>
        <p className="text-xs text-slate-500 italic">{caption}</p>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Your Professional Resume
          </h1>
          <p className="text-slate-600 text-lg">
            Preview and download your comprehensive resume with all professional sections
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-md p-1 flex gap-1">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === "preview"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Preview Resume
            </button>
            <button
              onClick={() => setActiveTab("download")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === "download"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === "preview" ? (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              {/* Resume Preview */}
              <div className="max-w-5xl mx-auto">
                {/* Contact Information */}
                {renderSection(
                  sectionCaptions.contact.title,
                  sectionCaptions.contact.caption,
                  <div className="text-center mb-8 pb-6 border-b-2 border-slate-200">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                      {resumeData.fullName || "Your Name"}
                    </h2>
                    {resumeData.title && (
                      <p className="text-lg font-medium text-blue-600 mb-3">
                        {resumeData.title}
                      </p>
                    )}
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
                      {resumeData.phone && <span>📱 {resumeData.phone}</span>}
                      {resumeData.email && <span>✉️ {resumeData.email}</span>}
                      {resumeData.linkedin && <span>💼 {resumeData.linkedin}</span>}
                      {resumeData.github && <span>🔗 {resumeData.github}</span>}
                      {resumeData.portfolio && <span>🌐 {resumeData.portfolio}</span>}
                      {resumeData.location && <span>📍 {resumeData.location}</span>}
                    </div>
                  </div>
                )}

                {/* Professional Summary */}
                {resumeData.summary && renderSection(
                  sectionCaptions.summary.title,
                  sectionCaptions.summary.caption,
                  <div className="text-justify">
                    <p className="text-slate-700 leading-relaxed">
                      {resumeData.summary}
                    </p>
                  </div>
                )}

                {/* Professional Experience */}
                {resumeData.experience && resumeData.experience.length > 0 && renderSection(
                  sectionCaptions.experience.title,
                  sectionCaptions.experience.caption,
                  <div className="space-y-6">
                    {resumeData.experience.map((exp: any, index: number) => (
                      <div key={index} className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 text-lg">{exp.title}</h4>
                          <span className="text-sm text-slate-600 font-medium">{exp.dates}</span>
                        </div>
                        <p className="text-slate-700 font-medium mb-2">{exp.company} | {exp.location}</p>
                        <ul className="space-y-2">
                          {exp.description && exp.description.map((desc: string, i: number) => (
                            <li key={i} className="text-slate-600 text-sm flex items-start">
                              <span className="mr-2 text-blue-600">▸</span>
                              <span>{desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Technical Projects */}
                {resumeData.projects && resumeData.projects.length > 0 && renderSection(
                  sectionCaptions.projects.title,
                  sectionCaptions.projects.caption,
                  <div className="space-y-6">
                    {resumeData.projects.map((project: any, index: number) => (
                      <div key={index} className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 text-lg">{project.title}</h4>
                          {project.links && (
                            <div className="flex gap-3">
                              {project.links.live && (
                                <a href={project.links.live} className="text-xs text-blue-600 hover:underline" target="_blank">
                                  🔗 Live Demo
                                </a>
                              )}
                              {project.links.github && (
                                <a href={project.links.github} className="text-xs text-blue-600 hover:underline" target="_blank">
                                  📂 Source Code
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-3 leading-relaxed">{project.description}</p>
                        {project.technologies && (
                          <p className="text-slate-700 text-xs font-medium mb-2">
                            <span className="text-blue-600">Technologies:</span> {Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies}
                          </p>
                        )}
                        {project.highlights && project.highlights.length > 0 && (
                          <ul className="space-y-1">
                            {project.highlights.map((highlight: string, i: number) => (
                              <li key={i} className="text-slate-600 text-xs flex items-start">
                                <span className="mr-2 text-green-600">✓</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Technical Skills */}
                {resumeData.skills && renderSection(
                  sectionCaptions.skills.title,
                  sectionCaptions.skills.caption,
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resumeData.skills.programming && (
                      <div>
                        <h5 className="font-semibold text-slate-800 mb-2 text-sm uppercase">Programming</h5>
                        <p className="text-slate-600 text-sm">{Array.isArray(resumeData.skills.programming) ? resumeData.skills.programming.join(", ") : resumeData.skills.programming}</p>
                      </div>
                    )}
                    {resumeData.skills.webTechnologies && (
                      <div>
                        <h5 className="font-semibold text-slate-800 mb-2 text-sm uppercase">Web Technologies</h5>
                        <p className="text-slate-600 text-sm">{Array.isArray(resumeData.skills.webTechnologies) ? resumeData.skills.webTechnologies.join(", ") : resumeData.skills.webTechnologies}</p>
                      </div>
                    )}
                    {resumeData.skills.databases && (
                      <div>
                        <h5 className="font-semibold text-slate-800 mb-2 text-sm uppercase">Databases</h5>
                        <p className="text-slate-600 text-sm">{Array.isArray(resumeData.skills.databases) ? resumeData.skills.databases.join(", ") : resumeData.skills.databases}</p>
                      </div>
                    )}
                    {resumeData.skills.cloud && (
                      <div>
                        <h5 className="font-semibold text-slate-800 mb-2 text-sm uppercase">Cloud & DevOps</h5>
                        <p className="text-slate-600 text-sm">{Array.isArray(resumeData.skills.cloud) ? resumeData.skills.cloud.join(", ") : resumeData.skills.cloud}</p>
                      </div>
                    )}
                    {resumeData.skills.ai_ml && (
                      <div>
                        <h5 className="font-semibold text-slate-800 mb-2 text-sm uppercase">AI & Machine Learning</h5>
                        <p className="text-slate-600 text-sm">{Array.isArray(resumeData.skills.ai_ml) ? resumeData.skills.ai_ml.join(", ") : resumeData.skills.ai_ml}</p>
                      </div>
                    )}
                    {resumeData.skills.tools && (
                      <div>
                        <h5 className="font-semibold text-slate-800 mb-2 text-sm uppercase">Tools & Software</h5>
                        <p className="text-slate-600 text-sm">{Array.isArray(resumeData.skills.tools) ? resumeData.skills.tools.join(", ") : resumeData.skills.tools}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Education */}
                {resumeData.education && resumeData.education.length > 0 && renderSection(
                  sectionCaptions.education.title,
                  sectionCaptions.education.caption,
                  <div className="space-y-4">
                    {resumeData.education.map((edu: any, index: number) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 text-lg">{edu.degree}</h4>
                          <span className="text-sm text-slate-600 font-medium">{edu.dates}</span>
                        </div>
                        <p className="text-slate-700 font-medium mb-1">{edu.institution}</p>
                        {edu.gpa && <p className="text-slate-600 text-sm">{edu.gpa}</p>}
                        {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                          <p className="text-slate-600 text-xs mt-2">
                            <span className="font-medium">Relevant Coursework:</span> {edu.relevantCoursework.join(", ")}
                          </p>
                        )}
                        {edu.achievements && edu.achievements.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium text-slate-700 text-xs">Achievements:</span>
                            <ul className="mt-1 space-y-1">
                              {edu.achievements.map((achievement: string, i: number) => (
                                <li key={i} className="text-slate-600 text-xs flex items-start">
                                  <span className="mr-2 text-green-600">•</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Certifications */}
                {resumeData.certifications && resumeData.certifications.length > 0 && renderSection(
                  sectionCaptions.certifications.title,
                  sectionCaptions.certifications.caption,
                  <div className="space-y-3">
                    {resumeData.certifications.map((cert: any, index: number) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900">{cert.name}</h4>
                          <span className="text-sm text-slate-600">{cert.date}</span>
                        </div>
                        <p className="text-slate-700 text-sm mb-1">{cert.issuer}</p>
                        {cert.credentialId && (
                          <p className="text-slate-600 text-xs">Credential ID: {cert.credentialId}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Achievements & Awards */}
                {resumeData.achievements && resumeData.achievements.length > 0 && renderSection(
                  sectionCaptions.achievements.title,
                  sectionCaptions.achievements.caption,
                  <div className="space-y-3">
                    {resumeData.achievements.map((achievement: any, index: number) => (
                      <div key={index} className="mb-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900">{achievement.title}</h4>
                          <span className="text-sm text-slate-600">{achievement.date}</span>
                        </div>
                        <p className="text-slate-700 text-sm mb-1">{achievement.organization}</p>
                        <p className="text-slate-600 text-sm">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Languages */}
                {resumeData.languages && resumeData.languages.length > 0 && renderSection(
                  sectionCaptions.languages.title,
                  sectionCaptions.languages.caption,
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeData.languages.map((lang: any, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-medium text-slate-800">{lang.language}</span>
                        <span className="text-slate-600 text-sm bg-slate-100 px-2 py-1 rounded">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Professional Interests */}
                {resumeData.interests && resumeData.interests.length > 0 && renderSection(
                  sectionCaptions.interests.title,
                  sectionCaptions.interests.caption,
                  <div className="flex flex-wrap gap-2">
                    {resumeData.interests.map((interest: string, index: number) => (
                      <span key={index} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ResumeGenerator resumeData={resumeData} />
          )}
        </motion.div>

        {/* Back to Upload */}
        <div className="text-center mt-8">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
          >
            ← Upload Another Resume
          </Link>
        </div>
      </div>
    </div>
  );
}
