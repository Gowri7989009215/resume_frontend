"use client";

import { motion } from "framer-motion";
import { ExtractedData } from "@/lib/types";

interface ResumePreviewProps {
    data: ExtractedData;
}

function InfoRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-2 text-sm">
            <span className="font-medium text-slate-500 w-24 shrink-0">{label}</span>
            <span className="text-slate-800 break-all">{value}</span>
        </div>
    );
}

export default function ResumePreview({ data }: ResumePreviewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-6"
        >
            <h2 className="text-lg font-bold text-slate-800">Extracted Data</h2>

            {/* Contact Info */}
            <section>
                <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
                    Contact Information
                </h3>
                <div className="space-y-1.5">
                    <InfoRow label="Name" value={data.fullName} />
                    <InfoRow label="Email" value={data.email} />
                    <InfoRow label="Phone" value={data.phone} />
                    <InfoRow label="LinkedIn" value={data.linkedin} />
                    <InfoRow label="GitHub" value={data.github} />
                    <InfoRow label="Portfolio" value={data.portfolio} />
                </div>
                {!data.email && !data.phone && !data.linkedin && (
                    <p className="text-xs text-slate-400 italic">No contact info detected</p>
                )}
            </section>

            {/* Skills */}
            <section>
                <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
                    Skills ({data.skills.length} detected)
                </h3>
                {data.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => (
                            <span
                                key={skill}
                                className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-100 font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic">No skills detected</p>
                )}
            </section>

            {/* Education */}
            <section>
                <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
                    Education
                </h3>
                {data.education.length > 0 ? (
                    <div className="space-y-3">
                        {data.education.map((edu, i) => (
                            <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                {edu.degree && (
                                    <p className="font-semibold text-slate-800 text-sm">{edu.degree}</p>
                                )}
                                {edu.institution && (
                                    <p className="text-sm text-slate-600">{edu.institution}</p>
                                )}
                                <div className="flex gap-3 mt-1">
                                    {edu.dates && (
                                        <span className="text-xs text-slate-400">{edu.dates}</span>
                                    )}
                                    {edu.cgpa && (
                                        <span className="text-xs text-emerald-600 font-medium">
                                            CGPA: {edu.cgpa}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic">No education detected</p>
                )}
            </section>

            {/* Projects */}
            <section>
                <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">
                    Projects ({data.projects.length} detected)
                </h3>
                {data.projects.length > 0 ? (
                    <div className="space-y-3">
                        {data.projects.map((proj, i) => (
                            <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <p className="font-semibold text-slate-800 text-sm">{proj.title}</p>
                                {proj.description && (
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                        {proj.description.slice(0, 200)}
                                        {proj.description.length > 200 ? "…" : ""}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 italic">No projects detected</p>
                )}
            </section>
        </motion.div>
    );
}
