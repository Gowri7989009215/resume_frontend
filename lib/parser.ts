// Resume parser - extracts structured data from raw PDF text using robust code logic

import {
    ExtractedData,
    ExperienceEntry,
    EducationEntry,
    ProjectEntry,
} from "./types";
import {
    SKILLS_KEYWORDS,
    EDUCATION_KEYWORDS,
    PROJECT_VERBS,
    SECTION_HEADERS,
} from "./constants";
import { cleanText, extractLines, deduplicate } from "./utils";

// --- HELPERS ---

function extractEmail(text: string): string {
    const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : "";
}

function extractPhone(text: string): string {
    const phoneRegex =
        /(?:\+?91[-.\s]?)?(?:\(?\d{3,5}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}(?:[-.\s]?\d{2,4})?/g;
    const matches = text.match(phoneRegex);
    if (!matches) return "";
    const valid = matches.filter((m) => {
        const digits = m.replace(/\D/g, "");
        return digits.length >= 10;
    });
    return valid.length > 0 ? valid[0].trim() : "";
}

function extractLinkedIn(text: string): string {
    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_%]+\/?/gi;
    const matches = text.match(linkedinRegex);
    return matches ? matches[0] : "";
}

function extractGitHub(text: string): string {
    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9\-_.]+\/?/gi;
    const matches = text.match(githubRegex);
    return matches ? matches[0] : "";
}

function extractPortfolio(text: string): string {
    const urlRegex =
        /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;
    const matches = text.match(urlRegex);
    if (!matches) return "";
    const portfolio = matches.find(
        (url) =>
            !url.toLowerCase().includes("linkedin.com") &&
            !url.toLowerCase().includes("github.com")
    );
    return portfolio || "";
}

function extractName(text: string): string {
    const lines = extractLines(text);
    for (const line of lines.slice(0, 15)) {
        // Exclude lines that look like emails, urls, dates, or contact info
        if (line.match(/[@:|+\d]/) || line.toLowerCase().includes("github.com") || line.toLowerCase().includes("linkedin.com")) continue; 
        
        let cleanLine = line.trim();
        // Remove trailing punctuation that might exist like a comma
        cleanLine = cleanLine.replace(/[,;-]+$/, "").trim();
        
        if (cleanLine.length < 2 || cleanLine.length > 40) continue;
        
        // Exclude obvious non-names like states, headers, addresses, roles
        const lower = cleanLine.toLowerCase();
        if (lower.includes("pradesh") || lower.includes("india") || lower.includes("street") || lower.includes("city")) continue;
        if (lower.includes("resume") || lower.includes("cv") || lower.includes("curriculum vitae") || lower.includes("portfolio")) continue;
        if (lower.includes("engineer") || lower.includes("developer") || lower.includes("designer") || lower.includes("architect") || lower.includes("manager") || lower.includes("specialist") || lower.includes("intern")) continue;
        if (lower.includes("student") || lower.includes("freelancer") || lower.includes("consultant") || lower.includes("analyst") || lower.includes("professional")) continue;
        
        // Exclude section headers
        const isHeader = SECTION_HEADERS.some(h => lower === h.toLowerCase() || lower.includes(h.toLowerCase() + " "));
        if (isHeader) continue;

        const words = cleanLine.split(/\s+/);
        // Ensure words only contain letters and common name punctuation
        if (words.length >= 1 && words.length <= 5 && words.every((w) => /^[A-Za-zÀ-ÿ.'-]+$/.test(w))) {
            return words.map(w => {
                if (w.length === 1) return w.toUpperCase();
                return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
            }).join(" ");
        }
    }
    return "";
}

function extractSkills(text: string): string[] {
    const found: string[] = [];
    const lower = text.toLowerCase();
    for (const skill of SKILLS_KEYWORDS) {
        if (lower.includes(skill.toLowerCase())) {
            found.push(skill);
        }
    }
    return deduplicate(found);
}

// --- ADVANCED SECTION PARSING ---

function identifySections(lines: string[]): Record<string, number> {
    const sections: Record<string, number> = {};
    const alternateHeaders = {
        "EMPLOYMENT": "EXPERIENCE",
        "WORK EXPERIENCE": "EXPERIENCE",
        "PROFESSIONAL EXPERIENCE": "EXPERIENCE",
        "ACADEMIC": "EDUCATION",
        "ACADEMICS": "EDUCATION",
    };

    lines.forEach((line, idx) => {
        let upper = line.toUpperCase().trim();
        if (upper.endsWith(":")) upper = upper.slice(0, -1).trim();

        if (alternateHeaders[upper as keyof typeof alternateHeaders]) {
            sections[alternateHeaders[upper as keyof typeof alternateHeaders]] = idx;
        } else {
            for (const header of SECTION_HEADERS) {
                if (upper === header || upper === `${header}S`) {
                    sections[header] = idx;
                }
            }
        }
    });
    return sections;
}

function getSectionLines(lines: string[], start: number, sectionsMap: Record<string, number>): string[] {
    const allIndices = Object.values(sectionsMap).sort((a, b) => a - b);
    const nextSectionIdx = allIndices.find((idx) => idx > start);
    const end = nextSectionIdx !== undefined ? nextSectionIdx : lines.length;
    return lines.slice(start + 1, end).filter(line => line.trim().length > 0);
}

function extractDate(line: string): string | null {
    const dateRegex = /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,-]*\d{2,4}\s*(?:-|to|–)\s*(?:Present|Current|Now|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,-]*\d{2,4})\b/i;
    const yearRegex = /\b(19|20)\d{2}\s*(?:-|to|–)\s*(?:(19|20)\d{2}|Present|Current|Now)\b/i;
    const singleYearRegex = /\b(19|20)\d{2}\b/;
    
    const m1 = line.match(dateRegex);
    if (m1) return m1[0];
    const m2 = line.match(yearRegex);
    if (m2) return m2[0];
    const m3 = line.match(singleYearRegex);
    if (m3) return m3[0];
    return null;
}

function extractExperience(lines: string[], sections: Record<string, number>): ExperienceEntry[] {
    if (sections["EXPERIENCE"] === undefined) return [];
    
    const expLines = getSectionLines(lines, sections["EXPERIENCE"], sections);
    const entries: ExperienceEntry[] = [];
    
    let currentEntry: Partial<ExperienceEntry> = {};
    let bullets: string[] = [];
    
    for (const line of expLines) {
        const isBullet = /^[•\-\*~]/.test(line.trim()) || line.length > 80;
        const date = extractDate(line);
        
        if (!isBullet && date) {
            // Push previous
            if (currentEntry.title || currentEntry.company) {
                entries.push({
                    title: currentEntry.title || "Professional Role",
                    company: currentEntry.company || "",
                    dates: currentEntry.dates || "",
                    location: currentEntry.location || "",
                    description: bullets.length > 0 ? bullets : [currentEntry.company ? `Worked at ${currentEntry.company}` : "Professional experience details."],
                });
                currentEntry = {};
                bullets = [];
            }
            
            currentEntry.dates = date;
            
            const lineWithoutDate = line.replace(date, "").trim();
            const parts = lineWithoutDate.split(/[|\-–,]/).map(p => p.trim()).filter(p => p.length > 2);
            
            if (parts.length >= 2) {
                currentEntry.title = parts[0];
                currentEntry.company = parts[1];
            } else if (parts.length === 1) {
                // Determine if it's a title or company
                if (parts[0].toLowerCase().includes("intern") || parts[0].toLowerCase().includes("engineer") || parts[0].toLowerCase().includes("developer")) {
                    currentEntry.title = parts[0];
                } else {
                    currentEntry.company = parts[0];
                }
            }
        } else if (!isBullet && !date && line.length > 3 && line.length < 80) {
            if (!currentEntry.title) {
                currentEntry.title = line;
            } else if (!currentEntry.company) {
                currentEntry.company = line;
            }
        } else if (isBullet || line.length > 80) {
            bullets.push(line.replace(/^[•\-\*~]\s*/, "").trim());
        }
    }
    
    // Push last entry
    if (currentEntry.title || currentEntry.company) {
        entries.push({
            title: currentEntry.title || "Professional Role",
            company: currentEntry.company || "",
            dates: currentEntry.dates || "",
            location: currentEntry.location || "",
            description: bullets.length > 0 ? bullets : ["Professional experience details."],
        });
    }
    
    return entries;
}

function extractEducationAdv(lines: string[], sections: Record<string, number>): EducationEntry[] {
    if (sections["EDUCATION"] === undefined) return [];
    
    const eduLines = getSectionLines(lines, sections["EDUCATION"], sections);
    const entries: EducationEntry[] = [];
    
    let currentEntry: Partial<EducationEntry> = {};
    
    for (const line of eduLines) {
        const date = extractDate(line);
        const hasDegree = EDUCATION_KEYWORDS.some(kw => line.toLowerCase().includes(kw.toLowerCase()));
        
        if (hasDegree || date) {
            if (currentEntry.degree && currentEntry.institution) {
                entries.push({
                    degree: currentEntry.degree || "Degree",
                    institution: currentEntry.institution,
                    dates: currentEntry.dates || "",
                    cgpa: currentEntry.cgpa || "",
                });
                currentEntry = {};
            }
            
            if (date) currentEntry.dates = date;
            
            const lineWithoutDate = date ? line.replace(date, "").trim() : line;
            const parts = lineWithoutDate.split(/[|\-–,]/).map(p => p.trim());
            const instMatch = parts.find(p => p.toLowerCase().includes("university") || p.toLowerCase().includes("college") || p.toLowerCase().includes("institute") || p.toLowerCase().includes("school"));
            
            if (instMatch) currentEntry.institution = instMatch;
            
            if (hasDegree) {
                let degStr = lineWithoutDate;
                if (instMatch) degStr = degStr.replace(instMatch, "");
                currentEntry.degree = degStr.replace(/^[,\-\s]+|[,\-\s]+$/g, "").trim();
            }
            
        } else if (line.toLowerCase().includes("university") || line.toLowerCase().includes("college")) {
            currentEntry.institution = line;
        }
        
        const cgpaMatch = line.match(/(?:CGPA|GPA|Grade)[:\s]*(\d+\.?\d*)/i);
        if (cgpaMatch) currentEntry.cgpa = cgpaMatch[1];
    }
    
    if (currentEntry.degree || currentEntry.institution) {
        entries.push({
            degree: currentEntry.degree || "Degree",
            institution: currentEntry.institution || "Institution",
            dates: currentEntry.dates || "",
            cgpa: currentEntry.cgpa || "",
        });
    }
    
    return entries;
}

function extractProjectsAdv(lines: string[], sections: Record<string, number>): ProjectEntry[] {
    if (sections["PROJECTS"] === undefined) return [];
    
    const projLines = getSectionLines(lines, sections["PROJECTS"], sections);
    const entries: ProjectEntry[] = [];
    
    let currentTitle = "";
    let currentDesc: string[] = [];
    
    for (const line of projLines) {
        const isBullet = /^[•\-\*~]/.test(line.trim());
        const isLink = /github|live|link|url|http/i.test(line);
        const isVerb = PROJECT_VERBS.some(v => line.toLowerCase().startsWith(v.toLowerCase()));
        
        if (!isBullet && !isLink && !isVerb && line.length > 3 && line.length < 80) {
            if (currentTitle) {
                entries.push({
                    title: currentTitle,
                    description: currentDesc.join(" "),
                });
                currentDesc = [];
            }
            currentTitle = line.trim();
        } else {
            currentDesc.push(line.replace(/^[•\-\*~]\s*/, "").trim());
        }
    }
    
    if (currentTitle) {
        entries.push({
            title: currentTitle,
            description: currentDesc.join(" "),
        });
    }
    
    return entries;
}

// --- MAIN PARSER ---

export function parseResume(rawText: string): ExtractedData {
    const text = cleanText(rawText);
    const lines = extractLines(text);
    const sections = identifySections(lines);

    const experience = extractExperience(lines, sections);
    const education = extractEducationAdv(lines, sections);
    const projects = extractProjectsAdv(lines, sections);

    return {
        fullName: extractName(text) || "Antigravity",
        email: extractEmail(text),
        phone: extractPhone(text),
        linkedin: extractLinkedIn(text),
        github: extractGitHub(text),
        portfolio: extractPortfolio(text),
        skills: extractSkills(text),
        experience: experience,
        education: education,
        projects: projects,
        summary: "Passionate professional with a proven track record of solving complex problems and delivering high-quality results. Seeking to leverage skills and experience in a dynamic new role.",
        rawText: text,
    };
}
