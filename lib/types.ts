// Core type definitions for ResumeIQ

export interface ExtractedData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  summary?: string;
  rawText: string;
  personalInfo?: {
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
}

export interface ExperienceEntry {
  title: string;
  company: string;
  dates: string;
  location: string;
  date?: string; // added for backward compat
  description: string[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  dates: string;
  cgpa?: string;
  date?: string; // added for backward compat
  achievements?: string[];
}

export interface ProjectEntry {
  title: string;
  description: string;
  technologies?: string[];
}

export interface SectionScore {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface AnalysisResult {
  extractedData: ExtractedData;
  overallScore: number;
  sectionScores: SectionScore[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface ImprovedResume {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  skills: string[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
}

export interface DownloadRequest {
  resumeData: ImprovedResume;
}
