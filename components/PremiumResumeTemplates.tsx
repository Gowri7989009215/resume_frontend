import React from "react";
import type { ExtractedData, EducationEntry, ExperienceEntry } from "@/lib/types";

interface TemplateProps {
    data: ExtractedData;
}

type PremiumLayout = "split-left" | "split-right" | "top-band" | "rail" | "compact" | "executive";

interface PremiumTemplateConfig {
    accent: string;
    dark: string;
    soft: string;
    layout: PremiumLayout;
    font: string;
    label: string;
}

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

function getDate(item: ExperienceEntry | EducationEntry) {
    return item.dates || item.date || "";
}

function getLinks(data: ExtractedData) {
    return [getEmail(data), getPhone(data), getLocation(data), data.linkedin, data.github]
        .filter((item): item is string => Boolean(item));
}

function sectionTitle(title: string, config: PremiumTemplateConfig) {
    return (
        <div className="flex items-center gap-3 mb-3">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: config.accent }} />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: config.dark }}>{title}</h2>
            <span className="h-px flex-1" style={{ backgroundColor: config.soft }} />
        </div>
    );
}

function ContactBlock({ data, inverse = false }: TemplateProps & { inverse?: boolean }) {
    return (
        <div className={`flex flex-wrap gap-x-3 gap-y-1 text-[11px] ${inverse ? "text-white/80" : "text-gray-600"}`}>
            {getLinks(data).map((item, i) => <span key={i}>{item}</span>)}
        </div>
    );
}

function SkillsBlock({ data, config, inverse = false }: TemplateProps & { config: PremiumTemplateConfig; inverse?: boolean }) {
    if (!data.skills?.length) return null;

    return (
        <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: inverse ? "#ffffff" : config.dark }}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, i) => (
                    <span
                        key={i}
                        className="text-[11px] px-2 py-1 rounded-full border"
                        style={{
                            backgroundColor: inverse ? "rgba(255,255,255,0.11)" : config.soft,
                            borderColor: inverse ? "rgba(255,255,255,0.22)" : config.soft,
                            color: inverse ? "#ffffff" : config.dark
                        }}
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </section>
    );
}

function ExperienceSection({ data, config }: TemplateProps & { config: PremiumTemplateConfig }) {
    if (!data.experience?.length) return null;

    return (
        <section>
            {sectionTitle("Experience", config)}
            <div className="space-y-4">
                {data.experience.map((exp, i) => (
                    <div key={i} className="break-inside-avoid">
                        <div className="flex justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-bold text-gray-950">{exp.title}</h3>
                                <p className="text-xs font-semibold" style={{ color: config.accent }}>{exp.company}{exp.location && ` | ${exp.location}`}</p>
                            </div>
                            <span className="text-[11px] text-gray-500 shrink-0">{getDate(exp)}</span>
                        </div>
                        <ul className="mt-2 list-disc pl-4 text-xs leading-relaxed text-gray-700 space-y-1">
                            {exp.description.map((desc, j) => <li key={j}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}

function ProjectsSection({ data, config }: TemplateProps & { config: PremiumTemplateConfig }) {
    if (!data.projects?.length) return null;

    return (
        <section>
            {sectionTitle("Projects", config)}
            <div className="space-y-3">
                {data.projects.map((proj, i) => (
                    <div key={i} className="break-inside-avoid">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-sm font-bold text-gray-950">{proj.title}</h3>
                            {proj.technologies && <span className="text-[11px] text-gray-500">{proj.technologies.join(" | ")}</span>}
                        </div>
                        <p className="text-xs leading-relaxed text-gray-700">{proj.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function EducationSection({ data, config, inverse = false }: TemplateProps & { config: PremiumTemplateConfig; inverse?: boolean }) {
    if (!data.education?.length) return null;
    const text = inverse ? "text-white/75" : "text-gray-600";
    const strong = inverse ? "text-white" : "text-gray-950";

    return (
        <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: inverse ? "#ffffff" : config.dark }}>Education</h2>
            <div className="space-y-3">
                {data.education.map((edu, i) => (
                    <div key={i} className="text-xs">
                        <h3 className={`font-bold ${strong}`}>{edu.degree}</h3>
                        <p className={text}>{edu.institution}</p>
                        <p className={inverse ? "text-white/55" : "text-gray-500"}>{getDate(edu)}</p>
                        {edu.cgpa && <p className="font-semibold" style={{ color: inverse ? "#ffffff" : config.accent }}>CGPA: {edu.cgpa}</p>}
                    </div>
                ))}
            </div>
        </section>
    );
}

function Sidebar({ data, config }: TemplateProps & { config: PremiumTemplateConfig }) {
    return (
        <aside className="w-60 shrink-0 p-7 space-y-6" style={{ backgroundColor: config.dark, color: "white" }}>
            <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/55">{config.label}</p>
                <h1 className="mt-2 text-3xl font-black uppercase leading-tight">{getName(data)}</h1>
                <p className="mt-2 text-sm text-white/75">{getRole(data)}</p>
            </div>
            <ContactBlock data={data} inverse />
            <SkillsBlock data={data} config={config} inverse />
            <EducationSection data={data} config={config} inverse />
        </aside>
    );
}

function MainSections({ data, config, includeSideContent = true }: TemplateProps & { config: PremiumTemplateConfig; includeSideContent?: boolean }) {
    return (
        <div className="space-y-6">
            {data.summary && (
                <section>
                    {sectionTitle("Profile", config)}
                    <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
                </section>
            )}
            <ExperienceSection data={data} config={config} />
            <ProjectsSection data={data} config={config} />
            {includeSideContent && <EducationSection data={data} config={config} />}
            {includeSideContent && <SkillsBlock data={data} config={config} />}
        </div>
    );
}

function PremiumResumeTemplate({ data, config }: TemplateProps & { config: PremiumTemplateConfig }) {
    if (config.layout === "split-left" || config.layout === "split-right") {
        return (
            <div className="bg-white text-gray-900 w-[794px] min-h-[1123px] flex shadow-2xl" style={{ fontFamily: config.font }}>
                {config.layout === "split-left" && <Sidebar data={data} config={config} />}
                <main className="flex-1 p-8"><MainSections data={data} config={config} includeSideContent={false} /></main>
                {config.layout === "split-right" && <Sidebar data={data} config={config} />}
            </div>
        );
    }

    if (config.layout === "rail") {
        return (
            <div className="bg-white text-gray-900 w-[794px] min-h-[1123px] shadow-2xl flex" style={{ fontFamily: config.font }}>
                <div className="w-5" style={{ backgroundColor: config.accent }} />
                <main className="flex-1 p-10">
                    <header className="pb-6 mb-6 border-b" style={{ borderColor: config.soft }}>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: config.accent }}>{config.label}</p>
                        <h1 className="mt-2 text-4xl font-black uppercase" style={{ color: config.dark }}>{getName(data)}</h1>
                        <p className="text-sm font-semibold text-gray-600">{getRole(data)}</p>
                        <div className="mt-3"><ContactBlock data={data} /></div>
                    </header>
                    <MainSections data={data} config={config} />
                </main>
            </div>
        );
    }

    if (config.layout === "executive") {
        return (
            <div className="bg-white text-gray-900 w-[794px] min-h-[1123px] shadow-2xl" style={{ fontFamily: config.font }}>
                <header className="px-12 pt-10 pb-7 text-center border-b-[6px]" style={{ borderColor: config.dark }}>
                    <p className="text-[10px] uppercase tracking-[0.32em] font-bold" style={{ color: config.accent }}>{config.label}</p>
                    <h1 className="mt-3 text-4xl font-bold uppercase tracking-wide" style={{ color: config.dark }}>{getName(data)}</h1>
                    <p className="text-sm text-gray-600">{getRole(data)}</p>
                    <div className="mt-3 flex justify-center"><ContactBlock data={data} /></div>
                </header>
                <main className="px-12 py-8 grid grid-cols-[1fr_210px] gap-8">
                    <div className="space-y-6">
                        {data.summary && <section>{sectionTitle("Executive Profile", config)}<p className="text-sm leading-relaxed text-gray-700">{data.summary}</p></section>}
                        <ExperienceSection data={data} config={config} />
                        <ProjectsSection data={data} config={config} />
                    </div>
                    <div className="space-y-6">
                        <SkillsBlock data={data} config={config} />
                        <EducationSection data={data} config={config} />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-white text-gray-900 w-[794px] min-h-[1123px] shadow-2xl" style={{ fontFamily: config.font }}>
            <header className="px-10 py-8" style={{ backgroundColor: config.dark, color: "white" }}>
                <div className="flex items-end justify-between gap-6">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/55">{config.label}</p>
                        <h1 className="mt-2 text-4xl font-black uppercase leading-none">{getName(data)}</h1>
                        <p className="mt-2 text-sm text-white/75">{getRole(data)}</p>
                    </div>
                    <div className="max-w-[280px]"><ContactBlock data={data} inverse /></div>
                </div>
            </header>
            <main className={`p-9 ${config.layout === "compact" ? "grid grid-cols-[1fr_220px] gap-8" : ""}`}>
                {config.layout === "compact" ? (
                    <>
                        <div className="space-y-6">
                            {data.summary && <section>{sectionTitle("Profile", config)}<p className="text-sm leading-relaxed text-gray-700">{data.summary}</p></section>}
                            <ExperienceSection data={data} config={config} />
                            <ProjectsSection data={data} config={config} />
                        </div>
                        <div className="space-y-6">
                            <SkillsBlock data={data} config={config} />
                            <EducationSection data={data} config={config} />
                        </div>
                    </>
                ) : <MainSections data={data} config={config} />}
            </main>
        </div>
    );
}

function makePremiumTemplate(config: PremiumTemplateConfig): React.FC<TemplateProps> {
    function PremiumTemplate({ data }: TemplateProps) {
        return <PremiumResumeTemplate data={data} config={config} />;
    }

    return PremiumTemplate;
}

const configs: Record<string, PremiumTemplateConfig> = {
    "modern-clean": { accent: "#2563eb", dark: "#172554", soft: "#dbeafe", layout: "top-band", font: "'Inter', 'Segoe UI', Arial, sans-serif", label: "ATS Elite" },
    "modern-minimal": { accent: "#0f766e", dark: "#134e4a", soft: "#ccfbf1", layout: "rail", font: "'Helvetica Neue', Arial, sans-serif", label: "Minimal Pro" },
    "modern-bold": { accent: "#dc2626", dark: "#111827", soft: "#fee2e2", layout: "split-right", font: "'Segoe UI', Arial, sans-serif", label: "Bold Impact" },
    "modern-sidebar": { accent: "#7c3aed", dark: "#312e81", soft: "#ede9fe", layout: "split-left", font: "'Segoe UI', Arial, sans-serif", label: "Sidebar Pro" },
    "modern-hybrid": { accent: "#ca8a04", dark: "#1f2937", soft: "#fef3c7", layout: "compact", font: "'Arial', sans-serif", label: "Hybrid Grid" },
    "modern-tech-1": { accent: "#0891b2", dark: "#164e63", soft: "#cffafe", layout: "rail", font: "'Consolas', 'Segoe UI', monospace", label: "Tech Stack" },
    "modern-tech-2": { accent: "#16a34a", dark: "#14532d", soft: "#dcfce7", layout: "split-right", font: "'Segoe UI', Arial, sans-serif", label: "Developer" },
    "modern-tech-3": { accent: "#4f46e5", dark: "#1e1b4b", soft: "#e0e7ff", layout: "compact", font: "'Consolas', 'Segoe UI', monospace", label: "Code ATS" },
    "modern-innovative-1": { accent: "#db2777", dark: "#500724", soft: "#fce7f3", layout: "top-band", font: "'Segoe UI', Arial, sans-serif", label: "Innovation" },
    "modern-innovative-2": { accent: "#ea580c", dark: "#431407", soft: "#ffedd5", layout: "rail", font: "'Segoe UI', Arial, sans-serif", label: "Innovation Plus" },
    "corporate-classic": { accent: "#334155", dark: "#0f172a", soft: "#e2e8f0", layout: "executive", font: "'Georgia', 'Times New Roman', serif", label: "Corporate 100" },
    "corporate-professional": { accent: "#1d4ed8", dark: "#1e3a8a", soft: "#dbeafe", layout: "compact", font: "'Arial', sans-serif", label: "Professional" },
    "corporate-executive": { accent: "#92400e", dark: "#292524", soft: "#fef3c7", layout: "executive", font: "'Georgia', serif", label: "Executive" },
    "corporate-formal-1": { accent: "#475569", dark: "#111827", soft: "#f1f5f9", layout: "top-band", font: "'Times New Roman', serif", label: "Formal" },
    "corporate-formal-2": { accent: "#155e75", dark: "#083344", soft: "#cffafe", layout: "split-left", font: "'Georgia', serif", label: "Formal Plus" },
    "corporate-structured-1": { accent: "#166534", dark: "#052e16", soft: "#dcfce7", layout: "rail", font: "'Arial', sans-serif", label: "Structured" },
    "corporate-structured-2": { accent: "#6d28d9", dark: "#2e1065", soft: "#ede9fe", layout: "compact", font: "'Arial', sans-serif", label: "Structured Plus" },
    "corporate-modern-1": { accent: "#0369a1", dark: "#0c4a6e", soft: "#e0f2fe", layout: "split-right", font: "'Segoe UI', Arial, sans-serif", label: "Corporate Modern" },
    "corporate-modern-2": { accent: "#be123c", dark: "#4c0519", soft: "#ffe4e6", layout: "top-band", font: "'Segoe UI', Arial, sans-serif", label: "Modern Pro" },
    "corporate-premium": { accent: "#a16207", dark: "#1c1917", soft: "#fef3c7", layout: "executive", font: "'Georgia', serif", label: "Premium" },
    "executive-standard": { accent: "#1e40af", dark: "#111827", soft: "#dbeafe", layout: "executive", font: "'Georgia', serif", label: "Leadership" },
    "executive-premium": { accent: "#b45309", dark: "#292524", soft: "#fef3c7", layout: "executive", font: "'Georgia', serif", label: "Board Ready" },
    "executive-elite": { accent: "#7f1d1d", dark: "#1f2937", soft: "#fee2e2", layout: "split-left", font: "'Georgia', serif", label: "Elite" },
    "executive-ceo": { accent: "#0f766e", dark: "#042f2e", soft: "#ccfbf1", layout: "executive", font: "'Georgia', serif", label: "CEO" },
    "executive-leadership": { accent: "#4338ca", dark: "#1e1b4b", soft: "#e0e7ff", layout: "rail", font: "'Segoe UI', Arial, sans-serif", label: "Leadership" },
    "executive-strategic": { accent: "#9f1239", dark: "#4c0519", soft: "#ffe4e6", layout: "compact", font: "'Georgia', serif", label: "Strategy" },
    "executive-visionary": { accent: "#0e7490", dark: "#164e63", soft: "#cffafe", layout: "top-band", font: "'Segoe UI', Arial, sans-serif", label: "Visionary" },
    "executive-director": { accent: "#65a30d", dark: "#365314", soft: "#ecfccb", layout: "split-right", font: "'Arial', sans-serif", label: "Director" },
    "executive-manager": { accent: "#c2410c", dark: "#431407", soft: "#ffedd5", layout: "compact", font: "'Arial', sans-serif", label: "Manager" },
    "executive-senior": { accent: "#6b21a8", dark: "#3b0764", soft: "#f3e8ff", layout: "executive", font: "'Georgia', serif", label: "Senior" },
    "minimal-ats": { accent: "#111827", dark: "#111827", soft: "#e5e7eb", layout: "rail", font: "'Arial', sans-serif", label: "ATS 100" },
    "minimal-elegant": { accent: "#64748b", dark: "#334155", soft: "#f1f5f9", layout: "top-band", font: "'Helvetica Neue', Arial, sans-serif", label: "Elegant" },
    "minimal-clean-1": { accent: "#2563eb", dark: "#1e3a8a", soft: "#eff6ff", layout: "compact", font: "'Arial', sans-serif", label: "Clean" },
    "minimal-clean-2": { accent: "#059669", dark: "#064e3b", soft: "#d1fae5", layout: "rail", font: "'Arial', sans-serif", label: "Clean Plus" },
    "minimal-simple-1": { accent: "#525252", dark: "#171717", soft: "#f5f5f5", layout: "top-band", font: "'Arial', sans-serif", label: "Simple" },
    "minimal-simple-2": { accent: "#0284c7", dark: "#0c4a6e", soft: "#e0f2fe", layout: "split-right", font: "'Arial', sans-serif", label: "Simple Plus" },
    "minimal-monochrome-1": { accent: "#000000", dark: "#111111", soft: "#eeeeee", layout: "executive", font: "'Arial', sans-serif", label: "Monochrome" },
    "minimal-monochrome-2": { accent: "#3f3f46", dark: "#18181b", soft: "#f4f4f5", layout: "compact", font: "'Arial', sans-serif", label: "Mono Plus" },
    "minimal-stark-1": { accent: "#7f1d1d", dark: "#111827", soft: "#fee2e2", layout: "rail", font: "'Arial', sans-serif", label: "Stark" },
    "minimal-stark-2": { accent: "#1d4ed8", dark: "#111827", soft: "#dbeafe", layout: "split-left", font: "'Arial', sans-serif", label: "Stark Plus" },
    "creative-colorful": { accent: "#db2777", dark: "#312e81", soft: "#fce7f3", layout: "top-band", font: "'Segoe UI', Arial, sans-serif", label: "Creative ATS" },
    "creative-gradient": { accent: "#9333ea", dark: "#581c87", soft: "#f3e8ff", layout: "split-left", font: "'Segoe UI', Arial, sans-serif", label: "Gradient Pro" },
    "creative-artistic-1": { accent: "#e11d48", dark: "#881337", soft: "#ffe4e6", layout: "rail", font: "'Segoe UI', Arial, sans-serif", label: "Artistic" },
    "creative-artistic-2": { accent: "#0891b2", dark: "#164e63", soft: "#cffafe", layout: "compact", font: "'Segoe UI', Arial, sans-serif", label: "Artistic Plus" },
    "creative-modern-1": { accent: "#16a34a", dark: "#14532d", soft: "#dcfce7", layout: "top-band", font: "'Segoe UI', Arial, sans-serif", label: "Creative Modern" },
    "creative-modern-2": { accent: "#ca8a04", dark: "#422006", soft: "#fef3c7", layout: "executive", font: "'Segoe UI', Arial, sans-serif", label: "Modern Pro" },
    "creative-bold-1": { accent: "#dc2626", dark: "#111827", soft: "#fee2e2", layout: "split-right", font: "'Segoe UI', Arial, sans-serif", label: "Bold" },
    "creative-bold-2": { accent: "#7c2d12", dark: "#1c1917", soft: "#ffedd5", layout: "compact", font: "'Segoe UI', Arial, sans-serif", label: "Bold Pro" },
    "creative-vibrant-1": { accent: "#4f46e5", dark: "#1e1b4b", soft: "#e0e7ff", layout: "rail", font: "'Segoe UI', Arial, sans-serif", label: "Vibrant" },
    "creative-vibrant-2": { accent: "#0d9488", dark: "#134e4a", soft: "#ccfbf1", layout: "split-left", font: "'Segoe UI', Arial, sans-serif", label: "Vibrant Plus" }
,
    "technical-engineer": {"accent":"#0ea5e9","dark":"#0c4a6e","soft":"#e0f2fe","layout":"rail","font":"'Consolas', monospace","label":"Tech Pro"},
    "technical-devops": {"accent":"#10b981","dark":"#064e3b","soft":"#d1fae5","layout":"split-right","font":"'Segoe UI', sans-serif","label":"DevOps"},
    "technical-data": {"accent":"#6366f1","dark":"#312e81","soft":"#e0e7ff","layout":"top-band","font":"'Arial', sans-serif","label":"Data"},
    "technical-security": {"accent":"#ef4444","dark":"#7f1d1d","soft":"#fee2e2","layout":"compact","font":"'Consolas', monospace","label":"Security"},
    "technical-cloud": {"accent":"#3b82f6","dark":"#1e3a8a","soft":"#dbeafe","layout":"executive","font":"'Arial', sans-serif","label":"Cloud"},
    "technical-frontend": {"accent":"#f59e0b","dark":"#78350f","soft":"#fef3c7","layout":"split-left","font":"'Segoe UI', sans-serif","label":"Frontend"},
    "technical-backend": {"accent":"#14b8a6","dark":"#134e4a","soft":"#ccfbf1","layout":"rail","font":"'Consolas', monospace","label":"Backend"},
    "technical-fullstack": {"accent":"#8b5cf6","dark":"#4c1d95","soft":"#ede9fe","layout":"compact","font":"'Arial', sans-serif","label":"Fullstack"},
    "technical-mobile": {"accent":"#06b6d4","dark":"#164e63","soft":"#cffafe","layout":"top-band","font":"'Segoe UI', sans-serif","label":"Mobile"},
    "technical-qa": {"accent":"#84cc16","dark":"#3f6212","soft":"#ecfccb","layout":"executive","font":"'Arial', sans-serif","label":"QA"},
    "medical-doctor": {"accent":"#0284c7","dark":"#082f49","soft":"#e0f2fe","layout":"executive","font":"'Georgia', serif","label":"MD"},
    "medical-nurse": {"accent":"#059669","dark":"#022c22","soft":"#d1fae5","layout":"top-band","font":"'Arial', sans-serif","label":"RN"},
    "medical-research": {"accent":"#4f46e5","dark":"#1e1b4b","soft":"#e0e7ff","layout":"split-left","font":"'Georgia', serif","label":"Research"},
    "medical-surgeon": {"accent":"#be123c","dark":"#4c0519","soft":"#ffe4e6","layout":"rail","font":"'Arial', sans-serif","label":"Surgeon"},
    "medical-admin": {"accent":"#475569","dark":"#0f172a","soft":"#f1f5f9","layout":"compact","font":"'Georgia', serif","label":"Healthcare"},
    "medical-dental": {"accent":"#0891b2","dark":"#164e63","soft":"#cffafe","layout":"executive","font":"'Arial', sans-serif","label":"DDS"},
    "medical-pharmacy": {"accent":"#16a34a","dark":"#14532d","soft":"#dcfce7","layout":"split-right","font":"'Georgia', serif","label":"PharmD"},
    "medical-therapy": {"accent":"#9333ea","dark":"#3b0764","soft":"#f3e8ff","layout":"top-band","font":"'Arial', sans-serif","label":"PT"},
    "medical-tech": {"accent":"#ea580c","dark":"#7c2d12","soft":"#ffedd5","layout":"rail","font":"'Segoe UI', sans-serif","label":"Tech"},
    "medical-specialist": {"accent":"#c026d3","dark":"#701a75","soft":"#fae8ff","layout":"compact","font":"'Georgia', serif","label":"Specialist"},
    "academic-professor": {"accent":"#7c3aed","dark":"#2e1065","soft":"#ede9fe","layout":"executive","font":"'Times New Roman', serif","label":"Ph.D."},
    "academic-research": {"accent":"#2563eb","dark":"#1e3a8a","soft":"#dbeafe","layout":"split-left","font":"'Georgia', serif","label":"Scholar"},
    "academic-teacher": {"accent":"#059669","dark":"#064e3b","soft":"#d1fae5","layout":"top-band","font":"'Arial', sans-serif","label":"Educator"},
    "academic-admin": {"accent":"#475569","dark":"#1e293b","soft":"#f1f5f9","layout":"compact","font":"'Georgia', serif","label":"Admin"},
    "academic-student": {"accent":"#db2777","dark":"#831843","soft":"#fce7f3","layout":"rail","font":"'Arial', sans-serif","label":"Student"},
    "academic-counselor": {"accent":"#ea580c","dark":"#7c2d12","soft":"#ffedd5","layout":"split-right","font":"'Georgia', serif","label":"Counselor"},
    "academic-librarian": {"accent":"#65a30d","dark":"#3f6212","soft":"#ecfccb","layout":"top-band","font":"'Arial', sans-serif","label":"Library"},
    "academic-adjunct": {"accent":"#0891b2","dark":"#164e63","soft":"#cffafe","layout":"executive","font":"'Times New Roman', serif","label":"Adjunct"},
    "academic-dean": {"accent":"#b91c1c","dark":"#7f1d1d","soft":"#fee2e2","layout":"rail","font":"'Georgia', serif","label":"Dean"},
    "academic-fellow": {"accent":"#d97706","dark":"#78350f","soft":"#fef3c7","layout":"compact","font":"'Arial', sans-serif","label":"Fellow"},
    "sales-executive": {"accent":"#1d4ed8","dark":"#1e3a8a","soft":"#dbeafe","layout":"executive","font":"'Arial', sans-serif","label":"Sales Exec"},
    "sales-manager": {"accent":"#b45309","dark":"#78350f","soft":"#fef3c7","layout":"split-left","font":"'Segoe UI', sans-serif","label":"Manager"},
    "sales-rep": {"accent":"#15803d","dark":"#14532d","soft":"#dcfce7","layout":"top-band","font":"'Arial', sans-serif","label":"Sales Rep"},
    "sales-b2b": {"accent":"#6d28d9","dark":"#4c1d95","soft":"#ede9fe","layout":"compact","font":"'Segoe UI', sans-serif","label":"B2B"},
    "sales-retail": {"accent":"#be123c","dark":"#881337","soft":"#ffe4e6","layout":"rail","font":"'Arial', sans-serif","label":"Retail"},
    "sales-account": {"accent":"#0369a1","dark":"#0c4a6e","soft":"#e0f2fe","layout":"split-right","font":"'Segoe UI', sans-serif","label":"Account"},
    "sales-dev": {"accent":"#4338ca","dark":"#312e81","soft":"#e0e7ff","layout":"executive","font":"'Arial', sans-serif","label":"BizDev"},
    "sales-inside": {"accent":"#0f766e","dark":"#134e4a","soft":"#ccfbf1","layout":"top-band","font":"'Segoe UI', sans-serif","label":"Inside"},
    "sales-regional": {"accent":"#a21caf","dark":"#701a75","soft":"#fae8ff","layout":"rail","font":"'Arial', sans-serif","label":"Regional"},
    "sales-vp": {"accent":"#111827","dark":"#000000","soft":"#f3f4f6","layout":"compact","font":"'Georgia', serif","label":"VP Sales"},
    "legal-attorney": {"accent":"#334155","dark":"#0f172a","soft":"#f1f5f9","layout":"executive","font":"'Times New Roman', serif","label":"Attorney"},
    "legal-corporate": {"accent":"#1e3a8a","dark":"#172554","soft":"#eff6ff","layout":"compact","font":"'Georgia', serif","label":"Counsel"},
    "legal-paralegal": {"accent":"#3f6212","dark":"#1a2e05","soft":"#f7fee7","layout":"top-band","font":"'Arial', sans-serif","label":"Paralegal"},
    "legal-partner": {"accent":"#7f1d1d","dark":"#450a0a","soft":"#fef2f2","layout":"rail","font":"'Times New Roman', serif","label":"Partner"},
    "legal-clerk": {"accent":"#312e81","dark":"#1e1b4b","soft":"#eef2ff","layout":"split-left","font":"'Georgia', serif","label":"Clerk"},
    "legal-compliance": {"accent":"#164e63","dark":"#083344","soft":"#ecfeff","layout":"executive","font":"'Arial', sans-serif","label":"Compliance"},
    "legal-litigation": {"accent":"#701a75","dark":"#4a044e","soft":"#fdf4ff","layout":"split-right","font":"'Times New Roman', serif","label":"Litigator"},
    "legal-associate": {"accent":"#57534e","dark":"#292524","soft":"#f5f5f4","layout":"top-band","font":"'Georgia', serif","label":"Associate"},
    "legal-assistant": {"accent":"#065f46","dark":"#022c22","soft":"#f0fdf4","layout":"compact","font":"'Arial', sans-serif","label":"Assistant"},
    "legal-advisor": {"accent":"#86198f","dark":"#4a044e","soft":"#fdf4ff","layout":"rail","font":"'Times New Roman', serif","label":"Advisor"},
};

export const premiumTemplateMap: Record<string, React.FC<TemplateProps>> = Object.fromEntries(
    Object.entries(configs).map(([id, config]) => [id, makePremiumTemplate(config)])
);
