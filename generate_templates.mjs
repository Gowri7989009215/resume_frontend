import fs from 'fs';
import path from 'path';

const newTemplates = [
    // TECHNICAL - 10 templates
    { id: "technical-engineer", name: "Engineer Pro", category: "Technical", description: "Technical engineering layout", isATS: true, isResponsive: true },
    { id: "technical-devops", name: "DevOps", category: "Technical", description: "Infrastructure and DevOps focus", isATS: true, isResponsive: true },
    { id: "technical-data", name: "Data Scientist", category: "Technical", description: "Data and analytics layout", isATS: true, isResponsive: true },
    { id: "technical-security", name: "Security Analyst", category: "Technical", description: "Cybersecurity focused", isATS: true, isResponsive: true },
    { id: "technical-cloud", name: "Cloud Architect", category: "Technical", description: "Cloud and architecture design", isATS: true, isResponsive: true },
    { id: "technical-frontend", name: "Frontend Developer", category: "Technical", description: "UI/UX focused tech layout", isATS: true, isResponsive: true },
    { id: "technical-backend", name: "Backend Developer", category: "Technical", description: "Server-side and API focus", isATS: true, isResponsive: true },
    { id: "technical-fullstack", name: "Full Stack", category: "Technical", description: "Comprehensive tech layout", isATS: true, isResponsive: true },
    { id: "technical-mobile", name: "Mobile Developer", category: "Technical", description: "iOS and Android focus", isATS: true, isResponsive: true },
    { id: "technical-qa", name: "QA Engineer", category: "Technical", description: "Quality assurance template", isATS: true, isResponsive: true },

    // MEDICAL - 10 templates
    { id: "medical-doctor", name: "Physician", category: "Medical", description: "Clinical and medical layout", isATS: true, isResponsive: true },
    { id: "medical-nurse", name: "Nursing Professional", category: "Medical", description: "Nursing and patient care focus", isATS: true, isResponsive: true },
    { id: "medical-research", name: "Clinical Research", category: "Medical", description: "Medical research focused", isATS: true, isResponsive: true },
    { id: "medical-surgeon", name: "Surgeon", category: "Medical", description: "Surgical and specialized care", isATS: true, isResponsive: true },
    { id: "medical-admin", name: "Healthcare Admin", category: "Medical", description: "Healthcare management layout", isATS: true, isResponsive: true },
    { id: "medical-dental", name: "Dental Professional", category: "Medical", description: "Dentistry and oral care", isATS: true, isResponsive: true },
    { id: "medical-pharmacy", name: "Pharmacist", category: "Medical", description: "Pharmacy and medication focus", isATS: true, isResponsive: true },
    { id: "medical-therapy", name: "Physical Therapist", category: "Medical", description: "Rehabilitation layout", isATS: true, isResponsive: true },
    { id: "medical-tech", name: "Medical Technician", category: "Medical", description: "Lab and technology focus", isATS: true, isResponsive: true },
    { id: "medical-specialist", name: "Medical Specialist", category: "Medical", description: "Specialized clinical layout", isATS: true, isResponsive: true },

    // ACADEMIC - 10 templates
    { id: "academic-professor", name: "Professor", category: "Academic", description: "Higher education focus", isATS: true, isResponsive: true },
    { id: "academic-research", name: "Postdoc Researcher", category: "Academic", description: "Research and publications layout", isATS: true, isResponsive: true },
    { id: "academic-teacher", name: "Educator", category: "Academic", description: "K-12 teaching focused", isATS: true, isResponsive: true },
    { id: "academic-admin", name: "Academic Admin", category: "Academic", description: "Education management layout", isATS: true, isResponsive: true },
    { id: "academic-student", name: "Graduate Student", category: "Academic", description: "Student and fellowship layout", isATS: true, isResponsive: true },
    { id: "academic-counselor", name: "School Counselor", category: "Academic", description: "Student services focus", isATS: true, isResponsive: true },
    { id: "academic-librarian", name: "Librarian", category: "Academic", description: "Library and information science", isATS: true, isResponsive: true },
    { id: "academic-adjunct", name: "Adjunct Faculty", category: "Academic", description: "Part-time teaching layout", isATS: true, isResponsive: true },
    { id: "academic-dean", name: "Dean of Students", category: "Academic", description: "Executive academic layout", isATS: true, isResponsive: true },
    { id: "academic-fellow", name: "Research Fellow", category: "Academic", description: "Fellowship and grant focus", isATS: true, isResponsive: true },

    // SALES - 10 templates
    { id: "sales-executive", name: "Sales Executive", category: "Sales", description: "High-level sales layout", isATS: true, isResponsive: true },
    { id: "sales-manager", name: "Sales Manager", category: "Sales", description: "Team management focus", isATS: true, isResponsive: true },
    { id: "sales-rep", name: "Sales Representative", category: "Sales", description: "Direct sales focused", isATS: true, isResponsive: true },
    { id: "sales-b2b", name: "B2B Sales", category: "Sales", description: "Business to business layout", isATS: true, isResponsive: true },
    { id: "sales-retail", name: "Retail Manager", category: "Sales", description: "Retail and store management", isATS: true, isResponsive: true },
    { id: "sales-account", name: "Account Executive", category: "Sales", description: "Client relationship focus", isATS: true, isResponsive: true },
    { id: "sales-dev", name: "Business Development", category: "Sales", description: "Growth and strategy layout", isATS: true, isResponsive: true },
    { id: "sales-inside", name: "Inside Sales", category: "Sales", description: "Inbound sales focus", isATS: true, isResponsive: true },
    { id: "sales-regional", name: "Regional Director", category: "Sales", description: "Territory management layout", isATS: true, isResponsive: true },
    { id: "sales-vp", name: "VP of Sales", category: "Sales", description: "Executive sales layout", isATS: true, isResponsive: true },

    // LEGAL - 10 templates
    { id: "legal-attorney", name: "Attorney", category: "Legal", description: "Classic law practice layout", isATS: true, isResponsive: true },
    { id: "legal-corporate", name: "Corporate Counsel", category: "Legal", description: "In-house legal focus", isATS: true, isResponsive: true },
    { id: "legal-paralegal", name: "Paralegal", category: "Legal", description: "Legal support focused", isATS: true, isResponsive: true },
    { id: "legal-partner", name: "Law Partner", category: "Legal", description: "Executive law firm layout", isATS: true, isResponsive: true },
    { id: "legal-clerk", name: "Law Clerk", category: "Legal", description: "Clerkship and judicial focus", isATS: true, isResponsive: true },
    { id: "legal-compliance", name: "Compliance Officer", category: "Legal", description: "Regulatory compliance layout", isATS: true, isResponsive: true },
    { id: "legal-litigation", name: "Litigator", category: "Legal", description: "Trial and litigation focus", isATS: true, isResponsive: true },
    { id: "legal-associate", name: "Associate Attorney", category: "Legal", description: "Law firm associate layout", isATS: true, isResponsive: true },
    { id: "legal-assistant", name: "Legal Assistant", category: "Legal", description: "Administrative legal focus", isATS: true, isResponsive: true },
    { id: "legal-advisor", name: "Legal Advisor", category: "Legal", description: "Consulting legal layout", isATS: true, isResponsive: true },
];

const newConfigs = {
    "technical-engineer": { accent: "#0ea5e9", dark: "#0c4a6e", soft: "#e0f2fe", layout: "rail", font: "'Consolas', monospace", label: "Tech Pro" },
    "technical-devops": { accent: "#10b981", dark: "#064e3b", soft: "#d1fae5", layout: "split-right", font: "'Segoe UI', sans-serif", label: "DevOps" },
    "technical-data": { accent: "#6366f1", dark: "#312e81", soft: "#e0e7ff", layout: "top-band", font: "'Arial', sans-serif", label: "Data" },
    "technical-security": { accent: "#ef4444", dark: "#7f1d1d", soft: "#fee2e2", layout: "compact", font: "'Consolas', monospace", label: "Security" },
    "technical-cloud": { accent: "#3b82f6", dark: "#1e3a8a", soft: "#dbeafe", layout: "executive", font: "'Arial', sans-serif", label: "Cloud" },
    "technical-frontend": { accent: "#f59e0b", dark: "#78350f", soft: "#fef3c7", layout: "split-left", font: "'Segoe UI', sans-serif", label: "Frontend" },
    "technical-backend": { accent: "#14b8a6", dark: "#134e4a", soft: "#ccfbf1", layout: "rail", font: "'Consolas', monospace", label: "Backend" },
    "technical-fullstack": { accent: "#8b5cf6", dark: "#4c1d95", soft: "#ede9fe", layout: "compact", font: "'Arial', sans-serif", label: "Fullstack" },
    "technical-mobile": { accent: "#06b6d4", dark: "#164e63", soft: "#cffafe", layout: "top-band", font: "'Segoe UI', sans-serif", label: "Mobile" },
    "technical-qa": { accent: "#84cc16", dark: "#3f6212", soft: "#ecfccb", layout: "executive", font: "'Arial', sans-serif", label: "QA" },

    "medical-doctor": { accent: "#0284c7", dark: "#082f49", soft: "#e0f2fe", layout: "executive", font: "'Georgia', serif", label: "MD" },
    "medical-nurse": { accent: "#059669", dark: "#022c22", soft: "#d1fae5", layout: "top-band", font: "'Arial', sans-serif", label: "RN" },
    "medical-research": { accent: "#4f46e5", dark: "#1e1b4b", soft: "#e0e7ff", layout: "split-left", font: "'Georgia', serif", label: "Research" },
    "medical-surgeon": { accent: "#be123c", dark: "#4c0519", soft: "#ffe4e6", layout: "rail", font: "'Arial', sans-serif", label: "Surgeon" },
    "medical-admin": { accent: "#475569", dark: "#0f172a", soft: "#f1f5f9", layout: "compact", font: "'Georgia', serif", label: "Healthcare" },
    "medical-dental": { accent: "#0891b2", dark: "#164e63", soft: "#cffafe", layout: "executive", font: "'Arial', sans-serif", label: "DDS" },
    "medical-pharmacy": { accent: "#16a34a", dark: "#14532d", soft: "#dcfce7", layout: "split-right", font: "'Georgia', serif", label: "PharmD" },
    "medical-therapy": { accent: "#9333ea", dark: "#3b0764", soft: "#f3e8ff", layout: "top-band", font: "'Arial', sans-serif", label: "PT" },
    "medical-tech": { accent: "#ea580c", dark: "#7c2d12", soft: "#ffedd5", layout: "rail", font: "'Segoe UI', sans-serif", label: "Tech" },
    "medical-specialist": { accent: "#c026d3", dark: "#701a75", soft: "#fae8ff", layout: "compact", font: "'Georgia', serif", label: "Specialist" },

    "academic-professor": { accent: "#7c3aed", dark: "#2e1065", soft: "#ede9fe", layout: "executive", font: "'Times New Roman', serif", label: "Ph.D." },
    "academic-research": { accent: "#2563eb", dark: "#1e3a8a", soft: "#dbeafe", layout: "split-left", font: "'Georgia', serif", label: "Scholar" },
    "academic-teacher": { accent: "#059669", dark: "#064e3b", soft: "#d1fae5", layout: "top-band", font: "'Arial', sans-serif", label: "Educator" },
    "academic-admin": { accent: "#475569", dark: "#1e293b", soft: "#f1f5f9", layout: "compact", font: "'Georgia', serif", label: "Admin" },
    "academic-student": { accent: "#db2777", dark: "#831843", soft: "#fce7f3", layout: "rail", font: "'Arial', sans-serif", label: "Student" },
    "academic-counselor": { accent: "#ea580c", dark: "#7c2d12", soft: "#ffedd5", layout: "split-right", font: "'Georgia', serif", label: "Counselor" },
    "academic-librarian": { accent: "#65a30d", dark: "#3f6212", soft: "#ecfccb", layout: "top-band", font: "'Arial', sans-serif", label: "Library" },
    "academic-adjunct": { accent: "#0891b2", dark: "#164e63", soft: "#cffafe", layout: "executive", font: "'Times New Roman', serif", label: "Adjunct" },
    "academic-dean": { accent: "#b91c1c", dark: "#7f1d1d", soft: "#fee2e2", layout: "rail", font: "'Georgia', serif", label: "Dean" },
    "academic-fellow": { accent: "#d97706", dark: "#78350f", soft: "#fef3c7", layout: "compact", font: "'Arial', sans-serif", label: "Fellow" },

    "sales-executive": { accent: "#1d4ed8", dark: "#1e3a8a", soft: "#dbeafe", layout: "executive", font: "'Arial', sans-serif", label: "Sales Exec" },
    "sales-manager": { accent: "#b45309", dark: "#78350f", soft: "#fef3c7", layout: "split-left", font: "'Segoe UI', sans-serif", label: "Manager" },
    "sales-rep": { accent: "#15803d", dark: "#14532d", soft: "#dcfce7", layout: "top-band", font: "'Arial', sans-serif", label: "Sales Rep" },
    "sales-b2b": { accent: "#6d28d9", dark: "#4c1d95", soft: "#ede9fe", layout: "compact", font: "'Segoe UI', sans-serif", label: "B2B" },
    "sales-retail": { accent: "#be123c", dark: "#881337", soft: "#ffe4e6", layout: "rail", font: "'Arial', sans-serif", label: "Retail" },
    "sales-account": { accent: "#0369a1", dark: "#0c4a6e", soft: "#e0f2fe", layout: "split-right", font: "'Segoe UI', sans-serif", label: "Account" },
    "sales-dev": { accent: "#4338ca", dark: "#312e81", soft: "#e0e7ff", layout: "executive", font: "'Arial', sans-serif", label: "BizDev" },
    "sales-inside": { accent: "#0f766e", dark: "#134e4a", soft: "#ccfbf1", layout: "top-band", font: "'Segoe UI', sans-serif", label: "Inside" },
    "sales-regional": { accent: "#a21caf", dark: "#701a75", soft: "#fae8ff", layout: "rail", font: "'Arial', sans-serif", label: "Regional" },
    "sales-vp": { accent: "#111827", dark: "#000000", soft: "#f3f4f6", layout: "compact", font: "'Georgia', serif", label: "VP Sales" },

    "legal-attorney": { accent: "#334155", dark: "#0f172a", soft: "#f1f5f9", layout: "executive", font: "'Times New Roman', serif", label: "Attorney" },
    "legal-corporate": { accent: "#1e3a8a", dark: "#172554", soft: "#eff6ff", layout: "compact", font: "'Georgia', serif", label: "Counsel" },
    "legal-paralegal": { accent: "#3f6212", dark: "#1a2e05", soft: "#f7fee7", layout: "top-band", font: "'Arial', sans-serif", label: "Paralegal" },
    "legal-partner": { accent: "#7f1d1d", dark: "#450a0a", soft: "#fef2f2", layout: "rail", font: "'Times New Roman', serif", label: "Partner" },
    "legal-clerk": { accent: "#312e81", dark: "#1e1b4b", soft: "#eef2ff", layout: "split-left", font: "'Georgia', serif", label: "Clerk" },
    "legal-compliance": { accent: "#164e63", dark: "#083344", soft: "#ecfeff", layout: "executive", font: "'Arial', sans-serif", label: "Compliance" },
    "legal-litigation": { accent: "#701a75", dark: "#4a044e", soft: "#fdf4ff", layout: "split-right", font: "'Times New Roman', serif", label: "Litigator" },
    "legal-associate": { accent: "#57534e", dark: "#292524", soft: "#f5f5f4", layout: "top-band", font: "'Georgia', serif", label: "Associate" },
    "legal-assistant": { accent: "#065f46", dark: "#022c22", soft: "#f0fdf4", layout: "compact", font: "'Arial', sans-serif", label: "Assistant" },
    "legal-advisor": { accent: "#86198f", dark: "#4a044e", soft: "#fdf4ff", layout: "rail", font: "'Times New Roman', serif", label: "Advisor" },
};

// 1. Update app/api/templates/route.ts
const routePath = path.join(process.cwd(), 'app', 'api', 'templates', 'route.ts');
let routeCode = fs.readFileSync(routePath, 'utf8');

// Find the end of the templates array
const insertIndexRoute = routeCode.indexOf('];', routeCode.indexOf('const templates = ['));
if (insertIndexRoute !== -1) {
    const injectedTemplatesStr = newTemplates.map(t => JSON.stringify(t)).join(',\n            ') + ',\n        ';
    routeCode = routeCode.slice(0, insertIndexRoute) + ',\n            ' + injectedTemplatesStr + routeCode.slice(insertIndexRoute);
    fs.writeFileSync(routePath, routeCode);
    console.log("Updated route.ts");
} else {
    console.log("Could not find templates array in route.ts");
}

// 2. Update components/PremiumResumeTemplates.tsx
const premiumPath = path.join(process.cwd(), 'components', 'PremiumResumeTemplates.tsx');
let premiumCode = fs.readFileSync(premiumPath, 'utf8');

const insertIndexPremium = premiumCode.indexOf('};', premiumCode.indexOf('const configs: Record<string, PremiumTemplateConfig> = {'));
if (insertIndexPremium !== -1) {
    const injectedConfigsStr = Object.entries(newConfigs).map(([k, v]) => `    "${k}": ${JSON.stringify(v)}`).join(',\n') + ',\n';
    premiumCode = premiumCode.slice(0, insertIndexPremium) + ',\n' + injectedConfigsStr + premiumCode.slice(insertIndexPremium);
    fs.writeFileSync(premiumPath, premiumCode);
    console.log("Updated PremiumResumeTemplates.tsx");
} else {
    console.log("Could not find configs object in PremiumResumeTemplates.tsx");
}
