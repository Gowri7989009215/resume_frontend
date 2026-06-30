// ATS-friendly resume template generator for ResumeIQ

import { ExtractedData, ImprovedResume } from "./types";
import { PROJECT_VERBS } from "./constants";

/**
 * Infer a primary role label from skills (for a more tailored summary).
 */
export function inferPrimaryRole(skills: string[]): string {
    const lower = skills.map((s) => s.toLowerCase());

    const hasFrontend =
        lower.includes("react") ||
        lower.includes("next.js") ||
        lower.includes("nextjs") ||
        lower.includes("javascript") ||
        lower.includes("html") ||
        lower.includes("css");

    const hasBackend =
        lower.includes("node") ||
        lower.includes("node.js") ||
        lower.includes("express") ||
        lower.includes("sql") ||
        lower.includes("mongodb") ||
        lower.includes("mongo");

    const hasML =
        lower.includes("machine learning") ||
        lower.includes("ml") ||
        lower.includes("python") ||
        lower.includes("pandas") ||
        lower.includes("tensorflow") ||
        lower.includes("pytorch");

    if (hasFrontend && hasBackend) {
        return "Full-Stack Software Engineer";
    }
    if (hasFrontend) {
        return "Frontend Engineer";
    }
    if (hasBackend) {
        return "Backend Engineer";
    }
    if (hasML) {
        return "Machine Learning Engineer";
    }
    return "Software Engineer";
}

/**
 * Build a concise role headline like:
 * "Full-Stack Software Engineer | React, Node, SQL"
 */
export function getRoleHeadline(skills: string[]): string {
    const role = inferPrimaryRole(skills);
    if (!skills || skills.length === 0) {
        return role;
    }
    const topSkills = skills.slice(0, 3).join(", ");
    return `${role} | ${topSkills}`;
}

/**
 * Generate a concise, strong professional summary from skills and projects.
 */
function generateSummary(data: ExtractedData): string {
    const parts: string[] = [];

    if (data.skills.length > 0) {
        const headline = getRoleHeadline(data.skills);
        const skillsList = data.skills.slice(0, 6).join(", ");
        parts.push(
            `${headline} with strong hands-on experience in ${skillsList}.`
        );
    } else {
        parts.push(
            "Detail-oriented technology professional with a solid foundation in software development best practices."
        );
    }

    if (data.projects.length > 0) {
        parts.push(
            `Delivered ${data.projects.length}+ end-to-end project${data.projects.length > 1 ? "s" : ""
            } focusing on clean architecture, performance, and usability.`
        );
    }

    parts.push(
        "Committed to writing maintainable, well-tested code and collaborating effectively with cross-functional teams."
    );

    return parts.join(" ");
}

/**
 * Rewrite project description using strong action verbs and measurable tone
 */
function rewriteProjectDescription(description: string): string {
    if (!description || description.trim().length === 0) {
        // No description detected in the original resume – leave empty so that
        // the template can either skip the section or prompt the user to fill it.
        return "";
    }

    // Check if it already starts with a strong verb
    const startsWithVerb = PROJECT_VERBS.some((verb) =>
        description.trim().toLowerCase().startsWith(verb.toLowerCase())
    );

    const cleaned = description.trim();

    if (startsWithVerb) {
        return cleaned;
    }

    // If the line already mentions an outcome/metric, keep it and just prepend a verb.
    const hasMetric =
        /%/.test(cleaned) ||
        /\b(increased|improved|reduced|boosted|optimized)\b/i.test(cleaned);

    if (hasMetric) {
        return `Implemented ${cleaned}`;
    }

    // Generic but strong phrasing encouraging impact-focused editing.
    return `Designed and implemented ${cleaned} to improve reliability, performance, and overall user experience.`;
}

/**
 * Generate improved resume data
 */
export function generateImprovedResume(data: ExtractedData): ImprovedResume {
    return {
        // Keep original extracted values only – do not invent defaults.
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        linkedin: data.linkedin || "",
        github: data.github || "",
        portfolio: data.portfolio || "",
        summary: generateSummary(data),
        skills: data.skills,
        projects: data.projects
            .map((p) => ({
            title: p.title || "",
            description: rewriteProjectDescription(p.description),
        }))
            // Drop completely empty projects so we don't create fake ones
            .filter((p) => p.title.trim().length > 0 || p.description.trim().length > 0),
        experience: data.experience || [],
        // Use education exactly as extracted, without default values.
        education: data.education,
    };
}

/**
 * Generate ATS-friendly plain text resume
 */
export function generateResumeText(resume: ImprovedResume): string {
    const lines: string[] = [];

    // Name
    if (resume.fullName && resume.fullName.trim().length > 0) {
        lines.push(resume.fullName.toUpperCase());
    } else {
        lines.push("FULL NAME");
        lines.push("");
        lines.push("<< Fill this with your full name >>");
    }
    // Optional role headline based on skills
    if (resume.skills && resume.skills.length > 0) {
        lines.push(getRoleHeadline(resume.skills));
    }
    lines.push("");

    // Contact Information
    lines.push("CONTACT INFORMATION");
    lines.push("─".repeat(50));
    const hasContact =
        !!resume.email ||
        !!resume.phone ||
        !!resume.linkedin ||
        !!resume.github ||
        !!resume.portfolio;
    if (hasContact) {
        if (resume.email) lines.push(`Email: ${resume.email}`);
        if (resume.phone) lines.push(`Phone: ${resume.phone}`);
        if (resume.linkedin) lines.push(`LinkedIn: ${resume.linkedin}`);
        if (resume.github) lines.push(`GitHub: ${resume.github}`);
        if (resume.portfolio) lines.push(`Portfolio: ${resume.portfolio}`);
    } else {
        lines.push("<< Fill this with your email, phone, and links >>");
    }
    lines.push("");

    // Professional Summary
    lines.push("PROFESSIONAL SUMMARY");
    lines.push("─".repeat(50));
    if (resume.summary && resume.summary.trim().length > 0) {
        lines.push(resume.summary);
    } else {
        lines.push("<< Add a 2–3 line professional summary highlighting your experience and key skills >>");
    }
    lines.push("");

    // Technical Skills
    lines.push("TECHNICAL SKILLS");
    lines.push("─".repeat(50));
    if (resume.skills.length > 0) {
        resume.skills.forEach((skill) => {
            lines.push(`• ${skill}`);
        });
    } else {
        lines.push("<< List your technical skills as bullet points >>");
    }
    lines.push("");

    // Projects
    lines.push("PROJECTS");
    lines.push("─".repeat(50));
    if (resume.projects.length > 0) {
        resume.projects.forEach((project) => {
            lines.push(`${project.title}`);
            if (project.description && project.description.trim().length > 0) {
                lines.push(`• ${project.description}`);
            }
            lines.push("");
        });
    } else {
        lines.push("<< Add your key projects here with strong action verbs and measurable impact >>");
        lines.push("");
    }

    // Education
    lines.push("EDUCATION");
    lines.push("─".repeat(50));
    if (resume.education.length > 0) {
        resume.education.forEach((edu) => {
            if (edu.degree) lines.push(edu.degree);
            if (edu.institution) lines.push(edu.institution);
            const details: string[] = [];
            if (edu.dates) details.push(edu.dates);
            if (edu.cgpa) details.push(`CGPA: ${edu.cgpa}`);
            if (details.length > 0) lines.push(details.join(" | "));
            lines.push("");
        });
    } else {
        lines.push("<< Add your degree, institution, year, and CGPA (if applicable) >>");
        lines.push("");
    }

    return lines.join("\n");
}
