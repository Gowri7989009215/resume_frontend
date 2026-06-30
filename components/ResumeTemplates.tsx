import React from 'react';
import { ExtractedData } from '@/lib/types';
import { premiumTemplateMap } from "@/components/PremiumResumeTemplates";

interface TemplateProps {
    data: ExtractedData;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

/** Fall back to extracted top-level fields if personalInfo is missing */
function getName(data: ExtractedData) {
    return data.personalInfo?.name || data.fullName || "Your Full Name";
}
function getRole(data: ExtractedData) {
    return data.personalInfo?.role || "Professional Role";
}
function getEmail(data: ExtractedData) {
    return data.personalInfo?.email || data.email || "your@email.com";
}
function getPhone(data: ExtractedData) {
    return data.personalInfo?.phone || data.phone || "Phone Number";
}
function getLocation(data: ExtractedData) {
    return data.personalInfo?.location || "Location";
}
function getLinkedIn(data: ExtractedData) {
    return data.linkedin || "";
}
function getGitHub(data: ExtractedData) {
    return data.github || "";
}

// ─── 1. OJAS ─────────────────────────────────────────────────────────────────
// Modern Clean · Blue/Gray · Dual Column
export function TemplateOjas({ data }: TemplateProps) {
    return (
        <div className="bg-white text-gray-800 font-sans w-[794px] min-h-[1123px] flex flex-col shadow-2xl" style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}>
            {/* Header */}
            <header className="bg-blue-700 text-white px-10 py-8">
                <h1 className="text-4xl font-extrabold tracking-tight uppercase">{getName(data)}</h1>
                <p className="text-blue-200 text-lg mt-1 font-light">{getRole(data)}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-blue-100">
                    <span>✉ {getEmail(data)}</span>
                    <span>📞 {getPhone(data)}</span>
                    <span>📍 {getLocation(data)}</span>
                    {getLinkedIn(data) && <span>🔗 {getLinkedIn(data)}</span>}
                    {getGitHub(data) && <span>💻 {getGitHub(data)}</span>}
                </div>
            </header>

            {/* Body */}
            <div className="flex flex-1">
                {/* Main Column */}
                <div className="flex-1 px-8 py-7 space-y-6">
                    {/* Summary */}
                    {data.summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-700 pb-1 mb-3">Profile</h2>
                            <p className="text-sm text-gray-700 leading-relaxed text-justify">{data.summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-700 pb-1 mb-4">Experience</h2>
                            <div className="space-y-5">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                            <span className="text-xs text-gray-500 italic">{exp.dates || (exp as any).date}</span>
                                        </div>
                                        <p className="text-sm text-blue-600 font-medium mb-2">{exp.company} {exp.location && `| ${exp.location}`}</p>
                                        <ul className="list-disc list-outside pl-4 text-sm text-gray-700 space-y-1">
                                            {(Array.isArray(exp.description) ? exp.description : [exp.description]).map((desc, j) => (
                                                <li key={j} className="leading-relaxed text-justify">{desc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-700 pb-1 mb-4">Projects</h2>
                            <div className="space-y-4">
                                {data.projects.map((proj, i) => (
                                    <div key={i}>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="font-bold text-sm text-gray-900">{proj.title}</h3>
                                            {proj.technologies && (
                                                <span className="text-xs text-blue-600 font-medium">{proj.technologies.join(', ')}</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed mt-1 text-justify">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-56 bg-gray-50 border-l border-gray-200 px-6 py-7 space-y-6 shrink-0">
                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-700 pb-1 mb-3">Skills</h2>
                            <div className="flex flex-wrap gap-1.5">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="bg-blue-100 text-blue-800 text-[11px] px-2 py-0.5 rounded font-medium">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-700 pb-1 mb-3">Education</h2>
                            <div className="space-y-4">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="font-bold text-xs text-gray-900">{edu.degree}</h3>
                                        <p className="text-xs text-gray-600">{edu.institution}</p>
                                        <p className="text-[11px] text-gray-400 italic">{edu.dates || (edu as any).date}</p>
                                        {edu.cgpa && <p className="text-[11px] text-green-600 font-medium">CGPA: {edu.cgpa}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Links */}
                    {(getLinkedIn(data) || getGitHub(data)) && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b-2 border-blue-700 pb-1 mb-3">Links</h2>
                            <div className="space-y-2 text-xs text-blue-600 break-all">
                                {getLinkedIn(data) && <p>{getLinkedIn(data)}</p>}
                                {getGitHub(data) && <p>{getGitHub(data)}</p>}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── 2. GAMBEERA ─────────────────────────────────────────────────────────────
// Professional Bold · Dark Header · Full page two-col body
export function TemplateGambeera({ data }: TemplateProps) {
    return (
        <div className="bg-white text-gray-900 w-[794px] min-h-[1123px] flex flex-col shadow-2xl" style={{ fontFamily: "'Georgia', serif" }}>
            {/* Dark Header */}
            <header className="bg-gray-900 text-white px-10 py-9">
                <h1 className="text-4xl font-extrabold tracking-widest uppercase">{getName(data)}</h1>
                <p className="text-gray-300 text-base font-light tracking-widest mt-1">{getRole(data)}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-400" style={{ fontFamily: 'Arial, sans-serif' }}>
                    <span>{getEmail(data)}</span>
                    <span>|</span>
                    <span>{getPhone(data)}</span>
                    <span>|</span>
                    <span>{getLocation(data)}</span>
                    {getLinkedIn(data) && <><span>|</span><span>{getLinkedIn(data)}</span></>}
                </div>
            </header>

            {/* Two column body */}
            <div className="flex flex-1">
                {/* Left main */}
                <div className="flex-1 px-8 py-7 space-y-6">
                    {data.summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-900 pb-1 mb-3">Professional Statement</h2>
                            <p className="text-sm leading-relaxed text-justify">{data.summary}</p>
                        </section>
                    )}

                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-900 pb-1 mb-4">Work Experience</h2>
                            <div className="space-y-5">
                                {data.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="text-sm font-bold uppercase">{exp.title}</h3>
                                            <span className="text-xs italic text-gray-500" style={{ fontFamily: 'Arial, sans-serif' }}>{exp.dates || (exp as any).date}</span>
                                        </div>
                                        <p className="text-sm font-medium mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>{exp.company}{exp.location && ` — ${exp.location}`}</p>
                                        <ul className="list-disc pl-5 text-sm space-y-1 text-justify" style={{ fontFamily: 'Arial, sans-serif' }}>
                                            {(Array.isArray(exp.description) ? exp.description : [exp.description]).map((desc, j) => (
                                                <li key={j}>{desc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-900 pb-1 mb-4">Notable Projects</h2>
                            <div className="space-y-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                                {data.projects.map((proj, i) => (
                                    <div key={i}>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="font-bold text-sm">{proj.title}</h3>
                                            {proj.technologies && <span className="text-xs text-gray-500 italic">{proj.technologies.join(', ')}</span>}
                                        </div>
                                        <p className="text-xs leading-relaxed mt-1 text-justify">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right sidebar */}
                <div className="w-60 bg-gray-900 text-white px-6 py-7 space-y-6 shrink-0">
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-600 pb-1 mb-3">Core Competencies</h2>
                            <ul className="space-y-1.5" style={{ fontFamily: 'Arial, sans-serif' }}>
                                {data.skills.map((skill, i) => (
                                    <li key={i} className="text-xs text-gray-200 flex items-center gap-1.5">
                                        <span className="text-green-400">✓</span> {skill}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-600 pb-1 mb-3">Education</h2>
                            <div className="space-y-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="font-bold text-xs text-white uppercase">{edu.degree}</h3>
                                        <p className="text-xs text-gray-400">{edu.institution}</p>
                                        <p className="text-[11px] text-gray-500 italic">{edu.dates || (edu as any).date}</p>
                                        {edu.cgpa && <p className="text-[11px] text-green-400">CGPA: {edu.cgpa}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── 3. NOVA ─────────────────────────────────────────────────────────────────
// Minimal Elegant · Light background · Timeline layout
export function TemplateNova({ data }: TemplateProps) {
    return (
        <div className="bg-gray-50 text-gray-800 w-[794px] min-h-[1123px] flex flex-col shadow-2xl" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            {/* Minimal header */}
            <header className="text-center px-14 py-10 border-b border-gray-200">
                <h1 className="text-4xl font-light tracking-widest text-gray-900 mb-1">{getName(data)}</h1>
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400 mb-4">{getRole(data)}</p>
                <div className="flex justify-center flex-wrap gap-5 text-xs text-gray-500">
                    <span>{getEmail(data)}</span>
                    <span>·</span>
                    <span>{getPhone(data)}</span>
                    <span>·</span>
                    <span>{getLocation(data)}</span>
                    {getLinkedIn(data) && <><span>·</span><span>{getLinkedIn(data)}</span></>}
                    {getGitHub(data) && <><span>·</span><span>{getGitHub(data)}</span></>}
                </div>
            </header>

            {/* Body */}
            <div className="flex flex-1 px-14 py-8 gap-10">
                {/* Main content */}
                <div className="flex-1 space-y-8">
                    {data.summary && (
                        <section>
                            <p className="text-sm text-gray-600 leading-relaxed italic text-justify">{data.summary}</p>
                        </section>
                    )}

                    {data.experience && data.experience.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">Experience</h2>
                            <div className="space-y-6">
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="relative pl-5 border-l border-gray-300">
                                        <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-[4.5px] top-2" />
                                        <h3 className="text-base font-semibold text-gray-900">{exp.title}</h3>
                                        <p className="text-xs text-gray-500 tracking-wide uppercase mb-2">{exp.company} {exp.dates || (exp as any).date ? `· ${exp.dates || (exp as any).date}` : ''}</p>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            {(Array.isArray(exp.description) ? exp.description : [exp.description]).map((desc, j) => (
                                                <p key={j} className="text-justify leading-relaxed">• {desc}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.projects && data.projects.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">Projects</h2>
                            <div className="space-y-5">
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="relative pl-5 border-l border-gray-300">
                                        <div className="absolute w-2 h-2 bg-gray-400 rounded-full -left-[4.5px] top-2" />
                                        <h3 className="text-sm font-semibold text-gray-900">{proj.title}</h3>
                                        {proj.technologies && (
                                            <p className="text-[11px] text-gray-400 mb-1">{proj.technologies.join(' · ')}</p>
                                        )}
                                        <p className="text-xs text-gray-600 leading-relaxed text-justify">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-48 shrink-0 space-y-7 border-l border-gray-200 pl-8">
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Expertise</h2>
                            <div className="flex flex-col gap-1.5">
                                {data.skills.map((skill, i) => (
                                    <span key={i} className="text-xs border border-gray-300 text-gray-600 px-2 py-0.5 rounded-full text-center">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.education && data.education.length > 0 && (
                        <section>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Education</h2>
                            <div className="space-y-4">
                                {data.education.map((edu, i) => (
                                    <div key={i}>
                                        <h3 className="text-xs font-semibold text-gray-900">{edu.degree}</h3>
                                        <p className="text-[11px] text-gray-500">{edu.institution}</p>
                                        <p className="text-[11px] text-gray-400">{edu.dates || (edu as any).date}</p>
                                        {edu.cgpa && <p className="text-[11px] text-green-600">CGPA: {edu.cgpa}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── 4. ELITE ────────────────────────────────────────────────────────────────
// Corporate · Dense info · Classic serif full page
export function TemplateElite({ data }: TemplateProps) {
    return (
        <div className="bg-white text-black w-[794px] min-h-[1123px] flex flex-col shadow-2xl" style={{ fontFamily: "'Times New Roman', serif", fontSize: '13px' }}>
            {/* Header */}
            <header className="text-center pt-8 px-10 pb-4 border-b-[3px] border-black">
                <h1 className="text-3xl font-bold uppercase tracking-widest">{getName(data)}</h1>
                <p className="mt-1 text-sm font-medium italic">{getRole(data)}</p>
                <div className="mt-2 text-xs" style={{ fontFamily: 'Arial, sans-serif' }}>
                    {getLocation(data)} · {getPhone(data)} · {getEmail(data)}
                    {getLinkedIn(data) && ` · ${getLinkedIn(data)}`}
                    {getGitHub(data) && ` · ${getGitHub(data)}`}
                </div>
            </header>

            <div className="flex-1 px-10 py-5 space-y-4">
                {data.summary && (
                    <section>
                        <h2 className="font-bold border-b border-black pb-0.5 mb-2 uppercase text-xs tracking-widest">Summary</h2>
                        <p className="text-justify leading-snug">{data.summary}</p>
                    </section>
                )}

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="font-bold border-b border-black pb-0.5 mb-2 uppercase text-xs tracking-widest">Professional Experience</h2>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="mb-3">
                                <div className="flex justify-between font-bold">
                                    <span>{exp.company}</span>
                                    <span>{exp.location}</span>
                                </div>
                                <div className="flex justify-between italic mb-1">
                                    <span>{exp.title}</span>
                                    <span>{exp.dates || (exp as any).date}</span>
                                </div>
                                <ul className="list-disc pl-5 space-y-0.5 text-justify" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>
                                    {(Array.isArray(exp.description) ? exp.description : [exp.description]).map((desc, j) => (
                                        <li key={j}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="font-bold border-b border-black pb-0.5 mb-2 uppercase text-xs tracking-widest">Projects</h2>
                        {data.projects.map((proj, i) => (
                            <div key={i} className="mb-2">
                                <div className="font-bold">
                                    {proj.title}
                                    {proj.technologies && <span className="font-normal italic"> | {proj.technologies.join(', ')}</span>}
                                </div>
                                <p className="text-justify leading-snug" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>{proj.description}</p>
                            </div>
                        ))}
                    </section>
                )}

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="font-bold border-b border-black pb-0.5 mb-2 uppercase text-xs tracking-widest">Education</h2>
                        {data.education.map((edu, i) => (
                            <div key={i} className="flex justify-between mb-1">
                                <div>
                                    <span className="font-bold">{edu.institution}</span>, {edu.degree}
                                    {edu.cgpa && <span className="italic text-xs"> — CGPA: {edu.cgpa}</span>}
                                </div>
                                <span>{edu.dates || (edu as any).date}</span>
                            </div>
                        ))}
                    </section>
                )}

                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h2 className="font-bold border-b border-black pb-0.5 mb-2 uppercase text-xs tracking-widest">Skills</h2>
                        <p className="leading-relaxed">{data.skills.join(' · ')}</p>
                    </section>
                )}
            </div>
        </div>
    );
}

// ─── 5. CLASSIC ──────────────────────────────────────────────────────────────
// Simple ATS-friendly · One column · Full page fill
export function TemplateClassic({ data }: TemplateProps) {
    return (
        <div className="bg-white text-gray-900 w-[794px] min-h-[1123px] flex flex-col shadow-2xl" style={{ fontFamily: "'Calibri', Arial, sans-serif" }}>
            {/* Header bar */}
            <header className="bg-slate-800 text-white px-10 py-8">
                <h1 className="text-3xl font-bold tracking-wide">{getName(data)}</h1>
                <p className="text-slate-300 text-sm mt-1">{getRole(data)}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
                    <span>{getEmail(data)}</span>
                    <span>|</span>
                    <span>{getPhone(data)}</span>
                    <span>|</span>
                    <span>{getLocation(data)}</span>
                    {getLinkedIn(data) && <><span>|</span><span>{getLinkedIn(data)}</span></>}
                    {getGitHub(data) && <><span>|</span><span>{getGitHub(data)}</span></>}
                </div>
            </header>

            <div className="flex-1 px-10 py-7 space-y-6">
                {data.summary && (
                    <section>
                        <h2 className="text-sm font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2 uppercase tracking-wider">Professional Summary</h2>
                        <p className="text-sm text-justify leading-relaxed">{data.summary}</p>
                    </section>
                )}

                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h2 className="text-sm font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-2 uppercase tracking-wider">Technical Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, i) => (
                                <span key={i} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded border border-slate-200">{skill}</span>
                            ))}
                        </div>
                    </section>
                )}

                {data.experience && data.experience.length > 0 && (
                    <section>
                        <h2 className="text-sm font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">Work Experience</h2>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between font-semibold text-sm">
                                    <span>{exp.title}</span>
                                    <span className="text-gray-500 font-normal text-xs italic">{exp.dates || (exp as any).date}</span>
                                </div>
                                <div className="text-sm italic text-slate-500 mb-2">{exp.company}{exp.location && `, ${exp.location}`}</div>
                                <ul className="list-disc pl-5 text-sm space-y-1 text-justify">
                                    {(Array.isArray(exp.description) ? exp.description : [exp.description]).map((desc, j) => (
                                        <li key={j} className="leading-relaxed">{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}

                {data.projects && data.projects.length > 0 && (
                    <section>
                        <h2 className="text-sm font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">Projects</h2>
                        {data.projects.map((proj, i) => (
                            <div key={i} className="mb-3">
                                <div className="flex items-baseline gap-2">
                                    <h3 className="font-semibold text-sm">{proj.title}</h3>
                                    {proj.technologies && <span className="text-xs text-slate-500 italic">{proj.technologies.join(', ')}</span>}
                                </div>
                                <p className="text-sm text-gray-600 mt-1 text-justify leading-relaxed">{proj.description}</p>
                            </div>
                        ))}
                    </section>
                )}

                {data.education && data.education.length > 0 && (
                    <section>
                        <h2 className="text-sm font-semibold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3 uppercase tracking-wider">Education</h2>
                        {data.education.map((edu, i) => (
                            <div key={i} className="mb-2 flex justify-between text-sm">
                                <div>
                                    <div className="font-semibold">{edu.degree}</div>
                                    <div className="text-slate-500">{edu.institution}</div>
                                    {edu.cgpa && <div className="text-xs text-green-600">CGPA: {edu.cgpa}</div>}
                                </div>
                                <div className="text-slate-500 text-xs italic shrink-0 mt-0.5">{edu.dates || (edu as any).date}</div>
                            </div>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
}

// ─── Map helper ───────────────────────────────────────────────────────────────
export const templateMap: Record<string, React.FC<TemplateProps>> = {
    "ojas": TemplateOjas,
    "gambeera": TemplateGambeera,
    "nova": TemplateNova,
    "elite": TemplateElite,
    "classic": TemplateClassic,
    ...premiumTemplateMap
};
