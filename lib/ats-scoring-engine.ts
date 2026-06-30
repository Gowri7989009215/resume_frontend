import { ExtractedData, ExperienceEntry, ProjectEntry, EducationEntry } from "./types";

// ATS Scoring Engine - Advanced Resume Analysis
export interface ATSScoreResult {
  overallScore: number;
  sectionScores: {
    contactInfo: number;
    skills: number;
    experience: number;
    education: number;
    projects: number;
    formatting: number;
    readability: number;
    keywordMatch: number;
  };
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  jobMatchScore?: number;
  jobMatchKeywords?: string[];
}

export interface JobDescription {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
}

const ATS_WEIGHTS = {
  contactInfo: 10,
  skills: 20,
  experience: 25,
  education: 15,
  projects: 15,
  formatting: 10,
  readability: 5,
  keywordMatch: 10,
};

// Common ATS keywords and skills
const ATS_KEYWORDS = {
  technical: [
    "javascript", "python", "java", "react", "node.js", "aws", "docker", "kubernetes",
    "mongodb", "postgresql", "mysql", "redis", "git", "github", "ci/cd", "agile",
    "scrum", "restful", "api", "microservices", "typescript", "html", "css", "tailwind",
    "next.js", "express", "mongodb", "sql", "nosql", "cloud", "devops", "linux",
    "ubuntu", "nginx", "apache", "jenkins", "terraform", "ansible", "helm", "kafka",
    "elasticsearch", "redis", "rabbitmq", "graphql", "websocket", "oauth", "jwt"
  ],
  softSkills: [
    "leadership", "communication", "teamwork", "problem-solving", "critical thinking",
    "collaboration", "project management", "time management", "adaptability", "creativity",
    "innovation", "analytical", "detail-oriented", "organized", "strategic", "mentoring"
  ],
  actionVerbs: [
    "developed", "implemented", "designed", "created", "built", "led", "managed",
    "optimized", "improved", "reduced", "increased", "achieved", "delivered", "launched",
    "deployed", "maintained", "enhanced", "refactored", "architected", "engineered",
    "coordinated", "facilitated", "trained", "mentored", "supervised", "directed"
  ],
  metrics: [
    "%", "increased", "decreased", "reduced", "improved", "achieved", "saved", "generated",
    "users", "customers", "revenue", "cost", "time", "efficiency", "productivity", "growth"
  ]
};

export class ATSScoringEngine {
  /**
   * Comprehensive ATS score calculation
   */
  static calculateATSScore(resumeData: ExtractedData, jobDescription?: JobDescription): ATSScoreResult {
    const sectionScores = {
      contactInfo: this.scoreContactInfo(resumeData),
      skills: this.scoreSkills(resumeData),
      experience: this.scoreExperience(resumeData),
      education: this.scoreEducation(resumeData),
      projects: this.scoreProjects(resumeData),
      formatting: this.scoreFormatting(resumeData),
      readability: this.scoreReadability(resumeData),
      keywordMatch: this.scoreKeywordMatch(resumeData),
    };

    // Calculate overall score
    const overallScore = Object.entries(sectionScores).reduce((total, [section, score]) => {
      return total + (score * ATS_WEIGHTS[section as keyof typeof ATS_WEIGHTS]) / 100;
    }, 0);

    // Generate suggestions
    const suggestions = this.generateSuggestions(sectionScores, resumeData);
    const strengths = this.generateStrengths(sectionScores, resumeData);
    const weaknesses = this.generateWeaknesses(sectionScores, resumeData);

    const result: ATSScoreResult = {
      overallScore: Math.round(overallScore),
      sectionScores,
      missingKeywords: this.findMissingKeywords(resumeData),
      suggestions,
      strengths,
      weaknesses,
    };

    // Add job matching if job description provided
    if (jobDescription) {
      result.jobMatchScore = this.calculateJobMatchScore(resumeData, jobDescription);
      result.jobMatchKeywords = this.findJobMatchKeywords(resumeData, jobDescription);
    }

    return result;
  }

  /**
   * Score contact information completeness
   */
  private static scoreContactInfo(data: ExtractedData): number {
    let score = 0;
    const requiredFields = ['fullName', 'email', 'phone'];
    const optionalFields = ['linkedin', 'github', 'portfolio'];

    // Required fields (70% of score)
    requiredFields.forEach(field => {
      if (data[field as keyof ExtractedData] && data[field as keyof ExtractedData] !== '') {
        score += 7;
      }
    });

    // Optional fields (30% of score)
    optionalFields.forEach(field => {
      if (data[field as keyof ExtractedData] && data[field as keyof ExtractedData] !== '') {
        score += 1;
      }
    });

    return Math.min(score, 10);
  }

  /**
   * Score skills section
   */
  private static scoreSkills(data: ExtractedData): number {
    let score = 0;
    
    if (!data.skills || data.skills.length === 0) return 0;

    // Skill quantity (40%)
    const skillCount = data.skills.length;
    if (skillCount >= 10) score += 4;
    else if (skillCount >= 7) score += 3;
    else if (skillCount >= 5) score += 2;
    else if (skillCount >= 3) score += 1;

    // Technical skills diversity (30%)
    const technicalSkills = ATS_KEYWORDS.technical.filter(skill => 
      data.skills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
    );
    if (technicalSkills.length >= 8) score += 3;
    else if (technicalSkills.length >= 5) score += 2;
    else if (technicalSkills.length >= 3) score += 1;

    // Action verbs in skills (30%)
    const actionVerbs = ATS_KEYWORDS.actionVerbs.filter(verb =>
      data.skills.some(skill => skill.toLowerCase().includes(verb.toLowerCase()))
    );
    if (actionVerbs.length >= 3) score += 3;
    else if (actionVerbs.length >= 2) score += 2;
    else if (actionVerbs.length >= 1) score += 1;

    return Math.min(score, 10);
  }

  /**
   * Score experience section
   */
  private static scoreExperience(data: ExtractedData): number {
    let score = 0;
    
    if (!data.experience || data.experience.length === 0) return 0;

    // Experience entries (20%)
    const expCount = data.experience.length;
    if (expCount >= 3) score += 2;
    else if (expCount >= 2) score += 1.5;
    else if (expCount >= 1) score += 1;

    // Detailed descriptions (40%)
    let totalDescScore = 0;
    data.experience.forEach(exp => {
      if (exp.description && exp.description.length >= 3) {
        totalDescScore += 1;
      }
    });
    score += (totalDescScore / data.experience.length) * 4;

    // Quantifiable achievements (40%)
    let totalMetricScore = 0;
    data.experience.forEach(exp => {
      if (exp.description) {
        const hasMetrics = exp.description.some(desc => 
          ATS_KEYWORDS.metrics.some(metric => 
            desc.toLowerCase().includes(metric.toLowerCase())
          )
        );
        if (hasMetrics) totalMetricScore += 1;
      }
    });
    score += (totalMetricScore / data.experience.length) * 4;

    return Math.min(score, 10);
  }

  /**
   * Score education section
   */
  private static scoreEducation(data: ExtractedData): number {
    let score = 0;
    
    if (!data.education || data.education.length === 0) return 0;

    // Education entries (40%)
    const eduCount = data.education.length;
    if (eduCount >= 2) score += 4;
    else if (eduCount >= 1) score += 3;

    // Detailed information (30%)
    let totalDetailScore = 0;
    data.education.forEach(edu => {
      if (edu.degree && edu.institution && edu.dates) {
        totalDetailScore += 1;
      }
    });
    score += (totalDetailScore / data.education.length) * 3;

    // GPA/Achievements (30%)
    let totalAchievementScore = 0;
    data.education.forEach(edu => {
      if (edu.cgpa || edu.achievements) {
        totalAchievementScore += 1;
      }
    });
    score += (totalAchievementScore / data.education.length) * 3;

    return Math.min(score, 10);
  }

  /**
   * Score projects section
   */
  private static scoreProjects(data: ExtractedData): number {
    let score = 0;
    
    if (!data.projects || data.projects.length === 0) return 0;

    // Project count (30%)
    const projectCount = data.projects.length;
    if (projectCount >= 3) score += 3;
    else if (projectCount >= 2) score += 2;
    else if (projectCount >= 1) score += 1;

    // Project descriptions (40%)
    let totalDescScore = 0;
    data.projects.forEach(project => {
      if (project.description && project.description.length > 50) {
        totalDescScore += 1;
      }
    });
    score += (totalDescScore / data.projects.length) * 4;

    // Technologies mentioned (30%)
    let totalTechScore = 0;
    data.projects.forEach(project => {
      if (project.technologies && project.technologies.length > 0) {
        totalTechScore += 1;
      }
    });
    score += (totalTechScore / data.projects.length) * 3;

    return Math.min(score, 10);
  }

  /**
   * Score formatting and structure
   */
  private static scoreFormatting(data: ExtractedData): number {
    let score = 0;
    
    // Section organization (40%)
    const hasAllSections = [
      data.fullName,
      data.skills && data.skills.length > 0,
      data.experience && data.experience.length > 0,
      data.education && data.education.length > 0
    ].every(Boolean);
    
    if (hasAllSections) score += 4;
    
    // Consistent formatting (30%)
    const hasConsistentDates = data.experience?.every(exp => exp.dates) &&
                               data.education?.every(edu => edu.dates);
    if (hasConsistentDates) score += 3;
    
    // Professional structure (30%)
    const hasProfessionalStructure = data.experience?.some(exp => 
      exp.description && exp.description.length > 0
    );
    if (hasProfessionalStructure) score += 3;

    return Math.min(score, 10);
  }

  /**
   * Score readability
   */
  private static scoreReadability(data: ExtractedData): number {
    let score = 0;
    
    // Action verb usage (40%)
    let actionVerbCount = 0;
    let totalDescriptions = 0;
    
    [...(data.experience || []), ...(data.projects || [])].forEach(item => {
      if (item.description) {
        totalDescriptions++;
        const descriptions = Array.isArray(item.description) ? item.description : [item.description];
        descriptions.forEach(desc => {
          const hasActionVerb = ATS_KEYWORDS.actionVerbs.some(verb =>
            desc.toLowerCase().startsWith(verb.toLowerCase())
          );
          if (hasActionVerb) actionVerbCount++;
        });
      }
    });
    
    if (totalDescriptions > 0) {
      score += (actionVerbCount / totalDescriptions) * 4;
    }

    // Conciseness (30%)
    let avgLength = 0;
    let descCount = 0;
    
    [...(data.experience || []), ...(data.projects || [])].forEach(item => {
      if (item.description) {
        const descriptions = Array.isArray(item.description) ? item.description : [item.description];
        descriptions.forEach(desc => {
          avgLength += desc.length;
          descCount++;
        });
      }
    });
    
    if (descCount > 0) {
      avgLength /= descCount;
      if (avgLength >= 50 && avgLength <= 200) score += 3;
      else if (avgLength >= 30 && avgLength <= 300) score += 2;
      else score += 1;
    }

    // Professional language (30%)
    let professionalScore = 0;
    const professionalTerms = ['developed', 'implemented', 'managed', 'led', 'designed', 'created'];
    
    [...(data.experience || []), ...(data.projects || [])].forEach(item => {
      if (item.description) {
        const descriptions = Array.isArray(item.description) ? item.description : [item.description];
        descriptions.forEach(desc => {
          const hasProfessionalTerm = professionalTerms.some(term =>
            desc.toLowerCase().includes(term.toLowerCase())
          );
          if (hasProfessionalTerm) professionalScore++;
        });
      }
    });
    
    if (professionalScore > 0) {
      score += Math.min(professionalScore / 2, 3);
    }

    return Math.min(score, 5);
  }

  /**
   * Score keyword match
   */
  private static scoreKeywordMatch(data: ExtractedData): number {
    let score = 0;
    
    const allKeywords = [
      ...ATS_KEYWORDS.technical,
      ...ATS_KEYWORDS.softSkills,
      ...ATS_KEYWORDS.actionVerbs
    ];

    const foundKeywords = allKeywords.filter(keyword => {
      const resumeText = [
        ...(data.skills || []),
        ...(data.experience?.flatMap(exp => exp.description || []) || []),
        ...(data.projects?.flatMap(proj => [proj.description, ...(proj.technologies || [])]) || [])
      ].join(' ').toLowerCase();
      
      return resumeText.includes(keyword.toLowerCase());
    });

    score = (foundKeywords.length / allKeywords.length) * 10;
    return Math.min(score, 10);
  }

  /**
   * Find missing keywords
   */
  private static findMissingKeywords(resumeData: ExtractedData): string[] {
    const resumeText = [
      ...(resumeData.skills || []),
      ...(resumeData.experience?.flatMap((exp: ExperienceEntry) => exp.description || []) || []),
      ...(resumeData.projects?.flatMap((proj: ProjectEntry) => [proj.description, ...(proj.technologies || [])]) || [])
    ].join(' ').toLowerCase();

    const allKeywords = [...ATS_KEYWORDS.technical, ...ATS_KEYWORDS.softSkills];
    
    return allKeywords.filter(keyword => 
      !resumeText.includes(keyword.toLowerCase())
    ).slice(0, 10);
  }

  /**
   * Calculate job match score
   */
  private static calculateJobMatchScore(resumeData: ExtractedData, jobDesc: JobDescription): number {
    const resumeText = [
      ...(resumeData.skills || []),
      ...(resumeData.experience?.flatMap((exp: ExperienceEntry) => exp.description || []) || []),
      ...(resumeData.projects?.flatMap((proj: ProjectEntry) => [proj.description, ...(proj.technologies || [])]) || [])
    ].join(' ').toLowerCase();

    const jobKeywords = [
      ...jobDesc.skills,
      ...jobDesc.requirements,
      ...jobDesc.description.toLowerCase().split(' ')
    ].filter(word => word.length > 3);

    const matchedKeywords = jobKeywords.filter(keyword =>
      resumeText.includes(keyword.toLowerCase())
    );

    return Math.round((matchedKeywords.length / jobKeywords.length) * 100);
  }

  /**
   * Find job match keywords
   */
  private static findJobMatchKeywords(resumeData: ExtractedData, jobDesc: JobDescription): string[] {
    const resumeText = [
      ...(resumeData.skills || []),
      ...(resumeData.experience?.flatMap((exp: ExperienceEntry) => exp.description || []) || []),
      ...(resumeData.projects?.flatMap((proj: ProjectEntry) => [proj.description, ...(proj.technologies || [])]) || [])
    ].join(' ').toLowerCase();

    const jobKeywords = [
      ...jobDesc.skills,
      ...jobDesc.requirements,
      ...jobDesc.description.toLowerCase().split(' ')
    ].filter(word => word.length > 3);

    return jobKeywords.filter(keyword =>
      resumeText.includes(keyword.toLowerCase())
    );
  }

  /**
   * Generate suggestions for improvement
   */
  private static generateSuggestions(sectionScores: any, resumeData: ExtractedData): string[] {
    const suggestions: string[] = [];

    if (sectionScores.contactInfo < 7) {
      suggestions.push("Add complete contact information including phone, email, and LinkedIn profile");
    }

    if (sectionScores.skills < 7) {
      suggestions.push("Include more technical skills and tools you're proficient with");
      suggestions.push("Add both hard skills (programming languages) and soft skills (communication, teamwork)");
    }

    if (sectionScores.experience < 7) {
      suggestions.push("Add more detailed descriptions of your work experience");
      suggestions.push("Include quantifiable achievements with metrics and results");
      suggestions.push("Start bullet points with strong action verbs");
    }

    if (sectionScores.education < 7) {
      suggestions.push("Include your educational background with degrees and institutions");
      suggestions.push("Add GPA, academic achievements, or relevant coursework");
    }

    if (sectionScores.projects < 7) {
      suggestions.push("Showcase your technical projects with detailed descriptions");
      suggestions.push("Include technologies used and project outcomes");
    }

    if (sectionScores.formatting < 7) {
      suggestions.push("Ensure consistent formatting throughout your resume");
      suggestions.push("Use clear section headings and professional structure");
    }

    if (sectionScores.readability < 4) {
      suggestions.push("Use strong action verbs to start bullet points");
      suggestions.push("Keep descriptions concise but informative (50-200 characters)");
      suggestions.push("Use professional language and avoid jargon");
    }

    return suggestions;
  }

  /**
   * Generate strengths
   */
  private static generateStrengths(sectionScores: any, resumeData: ExtractedData): string[] {
    const strengths: string[] = [];

    if (sectionScores.contactInfo >= 8) {
      strengths.push("Complete and professional contact information");
    }

    if (sectionScores.skills >= 8) {
      strengths.push("Strong technical skills section with diverse technologies");
    }

    if (sectionScores.experience >= 8) {
      strengths.push("Detailed work experience with quantifiable achievements");
    }

    if (sectionScores.education >= 8) {
      strengths.push("Comprehensive educational background");
    }

    if (sectionScores.projects >= 8) {
      strengths.push("Impressive project portfolio with technical details");
    }

    if (sectionScores.formatting >= 8) {
      strengths.push("Professional formatting and structure");
    }

    if (sectionScores.readability >= 4) {
      strengths.push("Clear and professional writing style");
    }

    return strengths;
  }

  /**
   * Generate weaknesses
   */
  private static generateWeaknesses(sectionScores: any, resumeData: ExtractedData): string[] {
    const weaknesses: string[] = [];

    if (sectionScores.contactInfo < 5) {
      weaknesses.push("Incomplete contact information");
    }

    if (sectionScores.skills < 5) {
      weaknesses.push("Limited skills section");
    }

    if (sectionScores.experience < 5) {
      weaknesses.push("Lack of detailed work experience");
    }

    if (sectionScores.education < 5) {
      weaknesses.push("Missing educational details");
    }

    if (sectionScores.projects < 5) {
      weaknesses.push("Insufficient project showcase");
    }

    if (sectionScores.formatting < 5) {
      weaknesses.push("Poor formatting and structure");
    }

    if (sectionScores.readability < 3) {
      weaknesses.push("Weak writing style and clarity");
    }

    return weaknesses;
  }
}
