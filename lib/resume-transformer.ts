import { ExtractedData, ImprovedResume, ExperienceEntry, ProjectEntry, EducationEntry } from "./types";

// Professional Resume Transformer - "Make My Resume Super" Feature
export class ResumeTransformer {
  /**
   * Transform basic resume data into professional ATS-optimized format
   */
  static transformResume(resumeData: ExtractedData): ImprovedResume {
    return {
      fullName: resumeData.fullName || "Your Name",
      email: resumeData.email || "your.email@example.com",
      phone: resumeData.phone || "+91 XXXXXXXXXX",
      linkedin: resumeData.linkedin || "linkedin.com/in/yourprofile",
      github: resumeData.github || "github.com/yourusername",
      portfolio: resumeData.portfolio || "yourportfolio.com",
      summary: this.generateProfessionalSummary(resumeData),
      skills: this.enhanceSkills(resumeData.skills || []),
      experience: this.transformExperience(resumeData.experience || []),
      education: this.transformEducation(resumeData.education || []),
      projects: this.transformProjects(resumeData.projects || [])
    };
  }

  /**
   * Generate professional summary
   */
  private static generateProfessionalSummary(data: ExtractedData): string {
    const hasExperience = data.experience && data.experience.length > 0;
    const hasProjects = data.projects && data.projects.length > 0;
    const skills = data.skills || [];
    const technicalSkills = skills.filter(skill => 
      ['javascript', 'python', 'react', 'node.js', 'aws', 'docker', 'kubernetes', 'mongodb', 'postgresql'].some(tech =>
        skill.toLowerCase().includes(tech)
      )
    );

    let summary = "";
    
    if (hasExperience) {
      const years = this.estimateExperience(data.experience);
      summary += `Results-oriented professional with ${years}+ years of experience in `;
      summary += this.generateSkillDescription(technicalSkills);
      summary += `. `;
    } else {
      summary += `Passionate and skilled professional specializing in `;
      summary += this.generateSkillDescription(technicalSkills);
      summary += `. `;
    }

    if (hasProjects) {
      summary += `Developed ${data.projects.length}+ successful projects delivering measurable business value. `;
    }

    summary += `Proven track record of implementing scalable solutions, optimizing performance, and collaborating effectively with cross-functional teams. `;
    
    if (hasExperience) {
      summary += `Seeking to leverage technical expertise and problem-solving abilities to drive innovation and deliver exceptional results in a challenging role.`;
    } else {
      summary += `Eager to apply strong technical foundation and continuous learning mindset to contribute to innovative projects and grow professionally.`;
    }

    return summary;
  }

  /**
   * Estimate years of experience
   */
  private static estimateExperience(experience: ExperienceEntry[]): number {
    // Simple estimation - in real implementation, you'd parse dates properly
    return Math.max(1, experience.length * 2);
  }

  /**
   * Generate skill description
   */
  private static generateSkillDescription(skills: string[]): string {
    if (skills.length === 0) return "software development";
    
    const categories = {
      frontend: ['react', 'angular', 'vue', 'html', 'css', 'javascript', 'typescript'],
      backend: ['node.js', 'express', 'python', 'java', 'c++', 'php'],
      database: ['mongodb', 'postgresql', 'mysql', 'redis', 'oracle'],
      cloud: ['aws', 'azure', 'google cloud', 'docker', 'kubernetes'],
      mobile: ['react native', 'flutter', 'ios', 'android']
    };

    const categorized = skills.reduce((acc, skill) => {
      const lowerSkill = skill.toLowerCase();
      for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => lowerSkill.includes(keyword))) {
          acc[category] = (acc[category] || 0) + 1;
          break;
        }
      }
      return acc;
    }, {} as Record<string, number>);

    const descriptions = Object.keys(categorized).map(cat => {
      switch (cat) {
        case 'frontend': return 'frontend development';
        case 'backend': return 'backend development';
        case 'database': return 'database management';
        case 'cloud': return 'cloud technologies';
        case 'mobile': return 'mobile development';
        default: return 'software engineering';
      }
    });

    return descriptions.length > 0 ? descriptions.join(', ') : 'software development';
  }

  /**
   * Enhance skills with professional formatting
   */
  private static enhanceSkills(skills: string[]): string[] {
    const professionalSkills = skills.map(skill => {
      const lowerSkill = skill.toLowerCase().trim();
      
      // Normalize common skill names
      const skillMap: Record<string, string> = {
        'js': 'JavaScript',
        'ts': 'TypeScript',
        'reactjs': 'React.js',
        'nodejs': 'Node.js',
        'aws': 'Amazon Web Services (AWS)',
        'git': 'Git',
        'github': 'GitHub',
        'sql': 'SQL',
        'nosql': 'NoSQL',
        'ci/cd': 'CI/CD',
        'rest': 'RESTful APIs',
        'graphql': 'GraphQL'
      };

      // Capitalize properly
      const normalized = skillMap[lowerSkill] || 
        skill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

      return normalized;
    });

    // Remove duplicates and sort
    return [...new Set(professionalSkills)].sort();
  }

  /**
   * Transform experience with professional descriptions
   */
  private static transformExperience(experience: ExperienceEntry[]): ExperienceEntry[] {
    return experience.map(exp => ({
      ...exp,
      description: this.enhanceExperienceDescription(exp.description || [])
    }));
  }

  /**
   * Enhance experience descriptions with action verbs and metrics
   */
  private static enhanceExperienceDescription(descriptions: string[]): string[] {
    return descriptions.map(desc => {
      let enhanced = desc.trim();
      
      // Start with action verb if not already
      const actionVerbs = [
        'developed', 'implemented', 'designed', 'created', 'built', 'led', 'managed',
        'optimized', 'improved', 'reduced', 'increased', 'achieved', 'delivered', 'launched',
        'deployed', 'maintained', 'enhanced', 'refactored', 'architected', 'engineered'
      ];

      const startsWithAction = actionVerbs.some(verb => 
        enhanced.toLowerCase().startsWith(verb)
      );

      if (!startsWithAction) {
        // Try to infer appropriate action verb
        if (enhanced.toLowerCase().includes('develop') || enhanced.toLowerCase().includes('create')) {
          enhanced = 'Developed ' + enhanced;
        } else if (enhanced.toLowerCase().includes('manage') || enhanced.toLowerCase().includes('lead')) {
          enhanced = 'Managed ' + enhanced;
        } else if (enhanced.toLowerCase().includes('improve') || enhanced.toLowerCase().includes('optimize')) {
          enhanced = 'Optimized ' + enhanced;
        } else {
          enhanced = 'Implemented ' + enhanced;
        }
      }

      // Add quantifiable metrics if missing
      if (!enhanced.match(/\d+%/)) {
        // Add placeholder for metrics
        if (enhanced.toLowerCase().includes('improve') || enhanced.toLowerCase().includes('increase')) {
          enhanced += ', resulting in 15% improvement in efficiency';
        } else if (enhanced.toLowerCase().includes('reduce') || enhanced.toLowerCase().includes('decrease')) {
          enhanced += ', reducing costs by 20%';
        } else if (enhanced.toLowerCase().includes('develop') || enhanced.toLowerCase().includes('create')) {
          enhanced += ', serving 1000+ users with 99.9% uptime';
        }
      }

      return enhanced;
    });
  }

  /**
   * Transform education with professional formatting
   */
  private static transformEducation(education: EducationEntry[]): EducationEntry[] {
    return education.map(edu => ({
      ...edu,
      achievements: edu.achievements || this.generateDefaultAchievements(edu)
    }));
  }

  /**
   * Generate default achievements for education
   */
  private static generateDefaultAchievements(edu: EducationEntry): string[] {
    const achievements = [];
    
    if (edu.cgpa && parseFloat(edu.cgpa) >= 8.0) {
      achievements.push('Academic Excellence Award for high GPA');
    }
    
    achievements.push('Dean\'s List for academic performance');
    achievements.push('Active participation in technical workshops and seminars');
    
    return achievements;
  }

  /**
   * Transform projects with professional descriptions
   */
  private static transformProjects(projects: ProjectEntry[]): ProjectEntry[] {
    return projects.map(project => ({
      ...project,
      description: this.enhanceProjectDescription(project.description),
      technologies: project.technologies || this.inferTechnologies(project.description)
    }));
  }

  /**
   * Enhance project description
   */
  private static enhanceProjectDescription(description: string): string {
    let enhanced = description.trim();
    
    // Add professional language
    if (!enhanced.toLowerCase().includes('developed') && !enhanced.toLowerCase().includes('created')) {
      enhanced = 'Developed ' + enhanced;
    }

    // Add impact statement if missing
    if (!enhanced.toLowerCase().includes('result') && !enhanced.toLowerCase().includes('impact')) {
      enhanced += ', demonstrating strong technical skills and problem-solving abilities';
    }

    return enhanced;
  }

  /**
   * Infer technologies from project description
   */
  private static inferTechnologies(description: string): string[] {
    const techKeywords = [
      'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'html', 'css',
      'mongodb', 'postgresql', 'mysql', 'aws', 'docker', 'kubernetes', 'git',
      'express', 'next.js', 'vue', 'angular', 'redis', 'graphql', 'rest'
    ];

    const found = techKeywords.filter(tech => 
      description.toLowerCase().includes(tech.toLowerCase())
    );

    return found.length > 0 ? found : ['JavaScript', 'React', 'Node.js'];
  }

  /**
   * Add placeholders for missing sections
   */
  static addPlaceholders(resume: ImprovedResume): ImprovedResume {
    const withPlaceholders = { ...resume };

    // Add placeholder experience if missing
    if (withPlaceholders.experience.length === 0) {
      withPlaceholders.experience = [{
        title: "Professional Position",
        company: "Company Name",
        dates: "Month Year - Present",
        location: "City, State",
        description: [
          "Add your key responsibilities and achievements here",
          "Include measurable results and impact on business",
          "Mention technologies and tools you utilized",
          "Highlight leadership and collaboration experiences"
        ]
      }];
    }

    // Add placeholder projects if missing
    if (withPlaceholders.projects.length === 0) {
      withPlaceholders.projects = [{
        title: "Professional Project",
        description: "Describe your project, the problem you solved, and the impact it created. Include specific technologies and measurable outcomes.",
        technologies: ["Technology 1", "Technology 2", "Technology 3"]
      }];
    }

    // Add placeholder education if missing
    if (withPlaceholders.education.length === 0) {
      withPlaceholders.education = [{
        degree: "Degree Name in [Specialization]",
        institution: "University/College Name",
        dates: "Year - Year",
        cgpa: "CGPA: X.XX / Percentage: XX%",
        achievements: ["Academic achievement 1", "Academic achievement 2"]
      }];
    }

    return withPlaceholders;
  }

  /**
   * Generate complete professional resume template
   */
  static generateProfessionalTemplate(): ImprovedResume {
    return {
      fullName: "Your Full Name",
      email: "your.email@example.com",
      phone: "+91 XXXXXXXXXX",
      linkedin: "linkedin.com/in/yourprofile",
      github: "github.com/yourusername",
      portfolio: "yourportfolio.com",
      summary: "Results-oriented professional with X+ years of experience in [your field]. Proven track record of implementing scalable solutions, optimizing performance, and collaborating effectively with cross-functional teams. Seeking to leverage technical expertise and problem-solving abilities to drive innovation and deliver exceptional results.",
      skills: [
        "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java",
        "HTML5", "CSS3", "Tailwind CSS", "MongoDB", "PostgreSQL",
        "AWS", "Docker", "Git", "GitHub", "RESTful APIs"
      ],
      experience: [
        {
          title: "Senior Software Engineer",
          company: "Tech Company Inc.",
          dates: "Month Year - Present",
          location: "City, State",
          description: [
            "Developed and deployed scalable web applications serving 10,000+ users with 99.9% uptime",
            "Implemented CI/CD pipelines reducing deployment time by 60% and improving code quality",
            "Led a team of 4 engineers to deliver 5 major features 2 weeks ahead of schedule",
            "Optimized database queries improving application performance by 40%"
          ]
        }
      ],
      education: [
        {
          degree: "Bachelor of Technology in Computer Science Engineering",
          institution: "University Name",
          dates: "Year - Year",
          cgpa: "CGPA: 8.5/10.0",
          achievements: ["Dean's List", "Academic Excellence Award"]
        }
      ],
      projects: [
        {
          title: "E-Commerce Platform",
          description: "Developed a full-stack e-commerce platform with real-time inventory management, payment processing, and user authentication. Implemented responsive design and optimized for mobile devices.",
          technologies: ["React", "Node.js", "MongoDB", "Stripe API", "JWT"]
        }
      ]
    };
  }
}
