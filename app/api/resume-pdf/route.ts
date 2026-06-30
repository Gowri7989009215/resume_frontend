import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const resumeData = await req.json();
        
        const PDFDocument = (await import("pdfkit")).default;
        const doc = new PDFDocument({
            margin: 50,
            size: "A4",
            info: {
                Title: `${resumeData.fullName || "Resume"} - Professional Resume`,
                Author: resumeData.fullName || "Professional",
            },
        });

        const chunks: Uint8Array[] = [];
        doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));

        // Helper functions
        const addHeader = () => {
            doc.fontSize(20).font("Helvetica-Bold").fillColor("#1a1a1a").text(resumeData.fullName || "Your Name", { align: "center" });
            if (resumeData.title) {
                doc.fontSize(12).font("Helvetica-Oblique").fillColor("#666666").text(resumeData.title, { align: "center" });
            }
            doc.moveDown(0.3);
            
            // Contact info line
            const contactInfo = [];
            if (resumeData.phone) contactInfo.push(resumeData.phone);
            if (resumeData.email) contactInfo.push(resumeData.email);
            if (resumeData.linkedin) contactInfo.push(resumeData.linkedin);
            if (resumeData.github) contactInfo.push(resumeData.github);
            if (resumeData.portfolio) contactInfo.push(resumeData.portfolio);
            
            if (contactInfo.length > 0) {
                doc.fontSize(10).font("Helvetica").fillColor("#666666").text(contactInfo.join(" | "), { align: "center" });
            }
            doc.moveDown(1);
        };

        const addSection = (title: string, caption?: string) => {
            doc.moveDown(0.8);
            doc.fontSize(12).font("Helvetica-Bold").fillColor("#1a1a1a").text(title.toUpperCase());
            if (caption) {
                doc.fontSize(8).font("Helvetica-Oblique").fillColor("#888888").text(caption);
            }
            doc.moveTo(50, doc.y).lineTo(550, doc.y).lineWidth(0.5).strokeColor("#cccccc").stroke();
            doc.moveDown(0.3);
        };

        const addBulletPoint = (text: string, indent: number = 20) => {
            doc.fontSize(10).font("Helvetica").fillColor("#333333").text(`• ${text}`, { indent });
            doc.moveDown(0.2);
        };

        const addSubSection = (title: string, content: string) => {
            doc.fontSize(10).font("Helvetica-Bold").fillColor("#444444").text(`${title}:`, { indent: 20 });
            doc.fontSize(10).font("Helvetica").fillColor("#333333").text(content, { indent: 40 });
            doc.moveDown(0.3);
        };

        // Generate resume content
        addHeader();
        
        // Professional Summary
        if (resumeData.summary) {
            addSection("PROFESSIONAL SUMMARY", "Career overview highlighting expertise and objectives");
            doc.fontSize(10).font("Helvetica").fillColor("#333333").text(resumeData.summary, { align: "justify" });
        }
        
        // Professional Experience
        if (resumeData.experience && resumeData.experience.length > 0) {
            addSection("PROFESSIONAL EXPERIENCE", "Work history with quantified achievements and impact");
            resumeData.experience.forEach((exp: any) => {
                doc.fontSize(11).font("Helvetica-Bold").fillColor("#1a1a1a").text(`${exp.title} | ${exp.company}`);
                doc.fontSize(9).font("Helvetica-Oblique").fillColor("#666666").text(`${exp.dates} | ${exp.location}`);
                doc.moveDown(0.2);
                if (exp.description) {
                    exp.description.forEach((desc: string) => addBulletPoint(desc));
                }
                doc.moveDown(0.3);
            });
        }

        // Technical Projects
        if (resumeData.projects && resumeData.projects.length > 0) {
            addSection("TECHNICAL PROJECTS", "Portfolio of development work and technical solutions");
            resumeData.projects.forEach((project: any) => {
                doc.fontSize(11).font("Helvetica-Bold").fillColor("#1a1a1a").text(project.title);
                doc.fontSize(10).font("Helvetica").fillColor("#333333").text(project.description, { align: "justify" });
                if (project.technologies) {
                    const techArray = Array.isArray(project.technologies) ? project.technologies : [project.technologies];
                    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#666666").text(`Technologies: ${techArray.join(", ")}`, { indent: 20 });
                }
                if (project.highlights && project.highlights.length > 0) {
                    project.highlights.forEach((highlight: string) => {
                        doc.fontSize(9).font("Helvetica").fillColor("#333333").text(`✓ ${highlight}`, { indent: 20 });
                        doc.moveDown(0.1);
                    });
                }
                doc.moveDown(0.3);
            });
        }

        // Technical Skills
        if (resumeData.skills) {
            addSection("TECHNICAL SKILLS", "Comprehensive technology stack and proficiencies");
            
            const skillCategories = [
                { key: "programming", label: "Programming" },
                { key: "webTechnologies", label: "Web Technologies" },
                { key: "databases", label: "Databases" },
                { key: "cloud", label: "Cloud & DevOps" },
                { key: "ai_ml", label: "AI & Machine Learning" },
                { key: "tools", label: "Tools & Software" },
                { key: "blockchain", label: "Blockchain" }
            ];

            skillCategories.forEach(category => {
                if (resumeData.skills[category.key]) {
                    const skills = Array.isArray(resumeData.skills[category.key]) 
                        ? resumeData.skills[category.key].join(", ")
                        : resumeData.skills[category.key];
                    addSubSection(category.label, skills);
                }
            });
        }

        // Education
        if (resumeData.education && resumeData.education.length > 0) {
            addSection("EDUCATION", "Academic background and qualifications");
            resumeData.education.forEach((edu: any) => {
                doc.fontSize(11).font("Helvetica-Bold").fillColor("#1a1a1a").text(`${edu.degree} | ${edu.institution}`);
                doc.fontSize(9).font("Helvetica-Oblique").fillColor("#666666").text(`${edu.dates} | ${edu.gpa || ""}`);
                if (edu.relevantCoursework && edu.relevantCoursework.length > 0) {
                    doc.fontSize(9).font("Helvetica").fillColor("#333333").text(`Relevant Coursework: ${edu.relevantCoursework.join(", ")}`, { indent: 20 });
                }
                if (edu.achievements && edu.achievements.length > 0) {
                    doc.fontSize(9).font("Helvetica-Bold").fillColor("#444444").text("Achievements:", { indent: 20 });
                    edu.achievements.forEach((achievement: string) => {
                        doc.fontSize(9).font("Helvetica").fillColor("#333333").text(`• ${achievement}`, { indent: 40 });
                        doc.moveDown(0.1);
                    });
                }
                doc.moveDown(0.3);
            });
        }

        // Certifications
        if (resumeData.certifications && resumeData.certifications.length > 0) {
            addSection("CERTIFICATIONS", "Professional certifications and credentials");
            resumeData.certifications.forEach((cert: any) => {
                doc.fontSize(11).font("Helvetica-Bold").fillColor("#1a1a1a").text(cert.name);
                doc.fontSize(10).font("Helvetica").fillColor("#333333").text(`${cert.issuer} | ${cert.date}`, { indent: 20 });
                if (cert.credentialId) {
                    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#666666").text(`Credential ID: ${cert.credentialId}`, { indent: 20 });
                }
                doc.moveDown(0.3);
            });
        }

        // Achievements & Awards
        if (resumeData.achievements && resumeData.achievements.length > 0) {
            addSection("ACHIEVEMENTS & AWARDS", "Recognition and accomplishments");
            resumeData.achievements.forEach((achievement: any) => {
                doc.fontSize(11).font("Helvetica-Bold").fillColor("#1a1a1a").text(achievement.title);
                doc.fontSize(10).font("Helvetica").fillColor("#333333").text(`${achievement.organization} | ${achievement.date}`, { indent: 20 });
                doc.fontSize(10).font("Helvetica").fillColor("#333333").text(achievement.description, { indent: 20 });
                doc.moveDown(0.3);
            });
        }

        // Languages
        if (resumeData.languages && resumeData.languages.length > 0) {
            addSection("LANGUAGES", "Language proficiencies and communication capabilities");
            resumeData.languages.forEach((lang: any) => {
                doc.fontSize(10).font("Helvetica").fillColor("#333333").text(
                    `${lang.language}: ${lang.proficiency}`,
                    { indent: 20 }
                );
                doc.moveDown(0.2);
            });
        }

        // Professional Interests
        if (resumeData.interests && resumeData.interests.length > 0) {
            addSection("PROFESSIONAL INTERESTS", "Technical interests and continuous learning areas");
            const interests = Array.isArray(resumeData.interests) 
                ? resumeData.interests.join(", ")
                : resumeData.interests;
            doc.fontSize(10).font("Helvetica").fillColor("#333333").text(interests, { indent: 20 });
        }

        doc.end();

        const pdfBuffer = await new Promise<Uint8Array>((resolve, reject) => {
            doc.on("end", () => {
                const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
                const merged = new Uint8Array(totalLength);
                let offset = 0;
                for (const chunk of chunks) {
                    merged.set(chunk, offset);
                    offset += chunk.length;
                }
                resolve(merged);
            });
            doc.on("error", reject);
        });

        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${(resumeData.fullName || "Resume").replace(/\s+/g, "_")}_Professional_Resume.pdf"`,
            },
        });
    } catch (error) {
        console.error("PDF Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}
