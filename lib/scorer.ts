// ATS Scoring Engine for ResumeIQ

import { ExtractedData, SectionScore, AnalysisResult } from "./types";
import {
    SKILLS_KEYWORDS,
    MEASURABLE_WORDS,
    SCORE_WEIGHTS,
    ATS_IMPORTANT_KEYWORDS,
} from "./constants";
import { clamp } from "./utils";

/**
 * Score contact information section
 */
function scoreContactInfo(data: ExtractedData): SectionScore {
    let score = SCORE_WEIGHTS.contactInfo;
    const feedback: string[] = [];

    if (!data.email) {
        score -= 5;
        feedback.push("Missing email address");
    }
    if (!data.phone) {
        score -= 2;
        feedback.push("Missing phone number");
    }
    if (!data.linkedin) {
        score -= 3;
        feedback.push("Missing LinkedIn profile URL");
    }
    if (!data.fullName) {
        score -= 2;
        feedback.push("Could not detect full name");
    }

    return {
        name: "Contact Information",
        score: clamp(score, 0, SCORE_WEIGHTS.contactInfo),
        maxScore: SCORE_WEIGHTS.contactInfo,
        feedback:
            feedback.length > 0 ? feedback.join(". ") : "All contact details present",
    };
}

/**
 * Score skills section
 */
function scoreSkills(data: ExtractedData): SectionScore {
    let score = SCORE_WEIGHTS.skills;
    const feedback: string[] = [];

    if (data.skills.length === 0) {
        score = 0;
        feedback.push("No recognized skills detected");
    } else if (data.skills.length < 5) {
        score -= 10;
        feedback.push(
            `Only ${data.skills.length} skills detected. Add more relevant technical skills`
        );
    } else if (data.skills.length < 10) {
        score -= 5;
        feedback.push("Consider adding more skills to improve ATS matching");
    } else {
        feedback.push(`${data.skills.length} relevant skills detected`);
    }

    return {
        name: "Technical Skills",
        score: clamp(score, 0, SCORE_WEIGHTS.skills),
        maxScore: SCORE_WEIGHTS.skills,
        feedback: feedback.join(". "),
    };
}

/**
 * Score projects section
 */
function scoreProjects(data: ExtractedData): SectionScore {
    let score = SCORE_WEIGHTS.projects;
    const feedback: string[] = [];

    if (data.projects.length === 0) {
        score -= 20;
        feedback.push("No projects section detected");
    } else {
        if (data.projects.length < 2) {
            score -= 8;
            feedback.push("Add at least 2–3 projects to strengthen your profile");
        }

        // Check for measurable words in project descriptions
        const allProjectText = data.projects
            .map((p) => p.description)
            .join(" ")
            .toLowerCase();
        const hasMeasurable = MEASURABLE_WORDS.some((w) =>
            allProjectText.includes(w.toLowerCase())
        );

        if (!hasMeasurable) {
            score -= 10;
            feedback.push(
                "Add measurable achievements (% improvement, user count, performance gains)"
            );
        } else {
            feedback.push("Projects include measurable outcomes — great!");
        }
    }

    return {
        name: "Projects",
        score: clamp(score, 0, SCORE_WEIGHTS.projects),
        maxScore: SCORE_WEIGHTS.projects,
        feedback: feedback.join(". "),
    };
}

/**
 * Score education section
 */
function scoreEducation(data: ExtractedData): SectionScore {
    let score = SCORE_WEIGHTS.education;
    const feedback: string[] = [];

    if (data.education.length === 0) {
        score -= 10;
        feedback.push("No education section detected");
    } else {
        const hasDegree = data.education.some(
            (e) => e.degree && e.degree.length > 0
        );
        const hasInstitution = data.education.some(
            (e) => e.institution && e.institution.length > 0
        );

        if (!hasDegree) {
            score -= 5;
            feedback.push("Degree type not clearly specified");
        }
        if (!hasInstitution) {
            score -= 3;
            feedback.push("Institution name not clearly formatted");
        }
        if (hasDegree && hasInstitution) {
            feedback.push("Education section is well-structured");
        }
    }

    return {
        name: "Education",
        score: clamp(score, 0, SCORE_WEIGHTS.education),
        maxScore: SCORE_WEIGHTS.education,
        feedback: feedback.join(". "),
    };
}

/**
 * Score keyword matching
 */
function scoreKeywordMatch(data: ExtractedData): {
    sectionScore: SectionScore;
    missingKeywords: string[];
} {
    const rawLower = data.rawText.toLowerCase();
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];

    for (const kw of SKILLS_KEYWORDS) {
        if (rawLower.includes(kw.toLowerCase())) {
            matchedKeywords.push(kw);
        } else {
            missingKeywords.push(kw);
        }
    }

    const matchRate = matchedKeywords.length / SKILLS_KEYWORDS.length;
    const score = Math.round(matchRate * SCORE_WEIGHTS.keywordMatch);

    const topMissing = missingKeywords.slice(0, 8);

    return {
        sectionScore: {
            name: "Keyword Match",
            score: clamp(score, 0, SCORE_WEIGHTS.keywordMatch),
            maxScore: SCORE_WEIGHTS.keywordMatch,
            feedback:
                matchedKeywords.length > 0
                    ? `${matchedKeywords.length}/${SKILLS_KEYWORDS.length} ATS keywords matched`
                    : "No ATS keywords matched. Add relevant technical skills",
        },
        missingKeywords: topMissing,
    };
}

/**
 * Score structure and formatting
 */
function scoreStructure(data: ExtractedData, rawText: string): SectionScore {
    let score = SCORE_WEIGHTS.structureFormatting;
    const feedback: string[] = [];
    const rawLower = rawText.toLowerCase();

    // Check for important section headers
    const detectedSections = ATS_IMPORTANT_KEYWORDS.filter((kw) =>
        rawLower.includes(kw)
    );

    if (detectedSections.length < 3) {
        score -= 8;
        feedback.push("Missing clear section headers (Skills, Projects, Education)");
    } else if (detectedSections.length < 5) {
        score -= 4;
        feedback.push("Consider adding more sections like Summary, Certifications");
    } else {
        feedback.push("Good section structure detected");
    }

    // Check for measurable language in overall resume
    const hasMeasurable = MEASURABLE_WORDS.some((w) =>
        rawLower.includes(w.toLowerCase())
    );
    if (!hasMeasurable) {
        score -= 5;
        feedback.push("No measurable achievements found in resume");
    }

    // Check for overly short resume
    if (rawText.length < 500) {
        score -= 5;
        feedback.push("Resume appears too short. Add more detailed content");
    }

    return {
        name: "Structure & Formatting",
        score: clamp(score, 0, SCORE_WEIGHTS.structureFormatting),
        maxScore: SCORE_WEIGHTS.structureFormatting,
        feedback: feedback.join(". "),
    };
}

/**
 * Generate improvement suggestions based on scores
 */
function generateSuggestions(
    sectionScores: SectionScore[],
    data: ExtractedData,
    missingKeywords: string[]
): string[] {
    const suggestions: string[] = [];

    for (const section of sectionScores) {
        const ratio = section.score / section.maxScore;
        if (ratio < 1 && section.feedback) {
            suggestions.push(section.feedback);
        }
    }

    if (missingKeywords.length > 0) {
        suggestions.push(
            `Add these in-demand keywords: ${missingKeywords.slice(0, 5).join(", ")}`
        );
    }

    if (!data.github) {
        suggestions.push("Add your GitHub profile URL to showcase your projects");
    }
    if (!data.portfolio) {
        suggestions.push(
            "Consider adding a portfolio website URL for better visibility"
        );
    }
    if (data.skills.length < 8) {
        suggestions.push(
            "List at least 8–12 technical skills relevant to your target role"
        );
    }

    // Deduplicate
    return [...new Set(suggestions)].slice(0, 8);
}

/**
 * Main scoring function
 */
export function scoreResume(data: ExtractedData): AnalysisResult {
    const contactScore = scoreContactInfo(data);
    const skillsScore = scoreSkills(data);
    const projectsScore = scoreProjects(data);
    const educationScore = scoreEducation(data);
    const { sectionScore: keywordScore, missingKeywords } = scoreKeywordMatch(data);
    const structureScore = scoreStructure(data, data.rawText);

    const sectionScores = [
        contactScore,
        skillsScore,
        projectsScore,
        educationScore,
        keywordScore,
        structureScore,
    ];

    const overallScore = clamp(
        sectionScores.reduce((sum, s) => sum + s.score, 0),
        0,
        100
    );

    const suggestions = generateSuggestions(sectionScores, data, missingKeywords);

    return {
        extractedData: data,
        overallScore,
        sectionScores,
        missingKeywords,
        suggestions,
    };
}
