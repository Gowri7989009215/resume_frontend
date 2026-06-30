import { ExtractedData, ExperienceEntry, ProjectEntry } from "./types";

// AI Content Improver - Google Gemini API Integration
export interface AIImprovementOptions {
  improveGrammar?: boolean;
  enhanceActionVerbs?: boolean;
  addMetrics?: boolean;
  professionalTone?: boolean;
}

export interface AIImprovementResult {
  original: string;
  improved: string;
  improvementType: string;
  confidence: number;
}

export class AIContentImprover {
  private static readonly GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  private static readonly GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  /**
   * Improve resume content using AI
   */
  static async improveResumeContent(
    resumeData: ExtractedData,
    options: AIImprovementOptions = {}
  ): Promise<ExtractedData> {
    const improved = { ...resumeData };

    // Improve experience descriptions
    if (improved.experience && options.enhanceActionVerbs) {
      improved.experience = await this.improveExperience(improved.experience);
    }

    // Improve project descriptions
    if (improved.projects && options.enhanceActionVerbs) {
      improved.projects = await this.improveProjects(improved.projects);
    }

    // Improve summary
    if (improved.summary && options.professionalTone) {
      improved.summary = await this.improveSummary(improved.summary);
    }

    return improved;
  }

  /**
   * Improve experience descriptions
   */
  private static async improveExperience(experience: ExperienceEntry[]): Promise<ExperienceEntry[]> {
    const improvedExperience = [];
    for (const exp of experience) {
      improvedExperience.push({
        ...exp,
        description: await this.improveDescriptions(exp.description, "experience")
      });
      // Small delay to help with rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return improvedExperience;
  }

  /**
   * Improve project descriptions
   */
  private static async improveProjects(projects: ProjectEntry[]): Promise<ProjectEntry[]> {
    const improvedProjects = [];
    for (const project of projects) {
      improvedProjects.push({
        ...project,
        description: await this.improveSingleDescription(project.description, "project")
      });
      // Small delay to help with rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return improvedProjects;
  }

  /**
   * Improve professional summary
   */
  private static async improveSummary(summary: string): Promise<string> {
    const prompt = `
Improve this professional resume summary to make it more impactful and ATS-friendly:

Original: "${summary}"

Requirements:
1. Start with strong professional identity
2. Include quantifiable achievements
3. Use action verbs
4. Keep it concise (2-3 sentences)
5. Make it ATS-optimized with relevant keywords
6. Maintain professional tone

Improved:`;

    try {
      const response = await this.callGemini(prompt);
      return response.trim();
    } catch (error) {
      console.error("Error improving summary:", error);
      return summary;
    }
  }

  /**
   * Improve multiple descriptions
   */
  private static async improveDescriptions(descriptions: string[], context: string): Promise<string[]> {
    const improvedDescriptions = [];
    for (const desc of descriptions) {
      improvedDescriptions.push(await this.improveSingleDescription(desc, context));
      // Small delay to help with rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return improvedDescriptions;
  }

  /**
   * Improve a single description
   */
  private static async improveSingleDescription(description: string, context: string): Promise<string> {
    const prompt = `
Improve this ${context} description to make it more professional and impactful:

Original: "${description}"

Requirements:
1. Start with a strong action verb (Developed, Implemented, Led, Optimized, etc.)
2. Add quantifiable metrics (%, numbers, time saved, etc.)
3. Include technical skills and technologies used
4. Show business impact and results
5. Keep it concise and ATS-friendly
6. Use professional language

Examples:
- "Worked on project" → "Developed and implemented a scalable project using React and Node.js, improving user engagement by 25%"
- "Managed team" → "Led a team of 5 engineers to deliver 3 major projects 2 weeks ahead of schedule"

Improved:`;

    try {
      const response = await this.callGemini(prompt);
      return response.trim();
    } catch (error) {
      console.error("Error improving description:", error);
      return description;
    }
  }

  /**
   * Call Gemini API
   */
  private static async callGemini(prompt: string, retryCount = 0): Promise<string> {
    if (!this.GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are an expert resume writer and career coach. Your task is to improve resume content to make it more professional, ATS-friendly, and impactful. Always provide specific, quantifiable results and use strong action verbs. Return ONLY the improved text, no surrounding quotes or pleasantries." }]
        },
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 429 && retryCount < 3) {
        console.warn(`Gemini API rate limit hit, retrying in ${1000 * Math.pow(2, retryCount)}ms...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        return this.callGemini(prompt, retryCount + 1);
      }
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || prompt;
  }

  /**
   * Generate improvement suggestions without API call
   */
  static generateLocalImprovements(text: string): AIImprovementResult[] {
    const improvements: AIImprovementResult[] = [];

    // Check for weak action verbs
    const weakVerbs = ["worked on", "helped with", "was responsible for", "participated in"];
    weakVerbs.forEach(verb => {
      if (text.toLowerCase().includes(verb)) {
        improvements.push({
          original: verb,
          improved: this.suggestStrongVerb(verb),
          improvementType: "action_verb",
          confidence: 0.8
        });
      }
    });

    // Check for missing metrics
    if (!text.match(/\d+%/)) {
      improvements.push({
        original: text,
        improved: text + " (add quantifiable metrics like % improvement, time saved, or user impact)",
        improvementType: "metrics",
        confidence: 0.9
      });
    }

    // Check for passive voice
    if (text.toLowerCase().includes("was ") || text.toLowerCase().includes("were ")) {
      improvements.push({
        original: text,
        improved: this.convertToActiveVoice(text),
        improvementType: "active_voice",
        confidence: 0.7
      });
    }

    return improvements;
  }

  /**
   * Suggest stronger action verbs
   */
  private static suggestStrongVerb(weakVerb: string): string {
    const verbMap: Record<string, string> = {
      "worked on": "Developed",
      "helped with": "Collaborated on",
      "was responsible for": "Managed",
      "participated in": "Contributed to"
    };

    return verbMap[weakVerb.toLowerCase()] || "Implemented";
  }

  /**
   * Convert to active voice
   */
  private static convertToActiveVoice(text: string): string {
    // Simple transformation - in real implementation, you'd use NLP
    return text
      .replace(/\bwas (\w+)/g, (_, verb) => verb.charAt(0).toUpperCase() + verb.slice(1))
      .replace(/\bwere (\w+)/g, (_, verb) => verb.charAt(0).toUpperCase() + verb.slice(1));
  }

  /**
   * Generate improvement suggestions for resume
   */
  static generateResumeSuggestions(resumeData: ExtractedData): string[] {
    const suggestions: string[] = [];

    // Check experience descriptions
    if (resumeData.experience) {
      resumeData.experience.forEach((exp, index) => {
        if (exp.description) {
          exp.description.forEach((desc, descIndex) => {
            const improvements = this.generateLocalImprovements(desc);
            improvements.forEach(improvement => {
              suggestions.push(
                `Experience ${index + 1}, Point ${descIndex + 1}: ${improvement.improvementType.replace('_', ' ')} - "${improvement.improved}"`
              );
            });
          });
        }
      });
    }

    // Check project descriptions
    if (resumeData.projects) {
      resumeData.projects.forEach((project, index) => {
        const improvements = this.generateLocalImprovements(project.description);
        improvements.forEach(improvement => {
          suggestions.push(
            `Project ${index + 1}: ${improvement.improvementType.replace('_', ' ')} - "${improvement.improved}"`
          );
        });
      });
    }

    // Check skills
    if (resumeData.skills && resumeData.skills.length < 8) {
      suggestions.push("Add more technical skills to strengthen your profile (aim for 8+ skills)");
    }

    // Check summary
    if (!resumeData.summary || resumeData.summary.length < 50) {
      suggestions.push("Add a compelling professional summary (2-3 sentences highlighting your expertise)");
    }

    return suggestions;
  }

  /**
   * Generate professional action verbs based on context
   */
  static generateActionVerbs(context: string): string[] {
    const actionVerbs = {
      development: ["Developed", "Implemented", "Built", "Created", "Architected", "Engineered"],
      management: ["Led", "Managed", "Directed", "Supervised", "Coordinated", "Oversaw"],
      improvement: ["Optimized", "Enhanced", "Improved", "Refactored", "Streamlined", "Automated"],
      analysis: ["Analyzed", "Researched", "Investigated", "Evaluated", "Assessed", "Examined"],
      collaboration: ["Collaborated", "Partnered", "Teamed", "Cooperated", "Worked with"]
    };

    const lowerContext = context.toLowerCase();
    for (const [category, verbs] of Object.entries(actionVerbs)) {
      if (lowerContext.includes(category)) {
        return verbs;
      }
    }

    return actionVerbs.development; // Default
  }

  /**
   * Generate metric suggestions
   */
  static generateMetricSuggestions(): string[] {
    return [
      "increased efficiency by X%",
      "reduced costs by $X",
      "saved X hours per week",
      "improved user satisfaction by X%",
      "served X+ users",
      "achieved X% growth",
      "reduced bugs by X%",
      "improved performance by X%",
      "completed X days ahead of schedule"
    ];
  }
}
