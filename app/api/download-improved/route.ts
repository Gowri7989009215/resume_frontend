import { NextRequest, NextResponse } from "next/server";
import { ImprovedResume } from "@/lib/types";
import { getRoleHeadline } from "@/lib/template";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const resumeData: ImprovedResume = body.resumeData;

        if (!resumeData) {
            return NextResponse.json(
                { error: "Missing resumeData in request body" },
                { status: 400 }
            );
        }

        // Generate PDF using pdfkit
        const PDFDocument = (await import("pdfkit")).default;

        const doc = new PDFDocument({
            margin: 60,
            size: "A4",
            info: {
                Title: `${resumeData.fullName} - Resume`,
                Author: resumeData.fullName,
                Subject: "ATS-Optimized Resume",
            },
        });

        const chunks: Uint8Array[] = [];
        doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));

        // ── Colors & Fonts ──────────────────────────────────────────────────
        const primaryColor = "#2563eb";
        const textColor = "#1e293b";
        const mutedColor = "#64748b";
        const separatorColor = "#e2e8f0";
        const pageWidth = 595 - 120; // A4 width minus margins

        // Helper: draw horizontal rule
        const drawRule = (y: number) => {
            doc
                .moveTo(60, y)
                .lineTo(535, y)
                .strokeColor(separatorColor)
                .lineWidth(1)
                .stroke();
        };

        // Helper: section heading
        const sectionHeading = (title: string) => {
            doc.moveDown(0.5);
            doc
                .font("Helvetica-Bold")
                .fontSize(11)
                .fillColor(primaryColor)
                .text(title.toUpperCase(), { characterSpacing: 1.5 });
            drawRule(doc.y + 2);
            doc.moveDown(0.4);
        };

        // ── HEADER ──────────────────────────────────────────────────────────
        doc
            .font("Helvetica-Bold")
            .fontSize(22)
            .fillColor(textColor)
            .text(resumeData.fullName, { align: "center" });

        // Optional role headline under name
        const roleHeadline = getRoleHeadline(resumeData.skills);
        if (roleHeadline) {
            doc.moveDown(0.2);
            doc
                .font("Helvetica")
                .fontSize(11)
                .fillColor(primaryColor)
                .text(roleHeadline, { align: "center" });
        }

        // Contact line
        const contactParts: string[] = [];
        if (resumeData.email) contactParts.push(resumeData.email);
        if (resumeData.phone) contactParts.push(resumeData.phone);
        if (resumeData.linkedin) contactParts.push(resumeData.linkedin);
        if (resumeData.github) contactParts.push(resumeData.github);
        if (resumeData.portfolio) contactParts.push(resumeData.portfolio);

        if (contactParts.length > 0) {
            doc.moveDown(0.3);
            doc
                .font("Helvetica")
                .fontSize(9)
                .fillColor(mutedColor)
                .text(contactParts.join("  •  "), { align: "center", lineGap: 2 });
        }

        doc.moveDown(0.5);
        drawRule(doc.y);
        doc.moveDown(0.6);

        // ── PROFESSIONAL SUMMARY ────────────────────────────────────────────
        sectionHeading("Professional Summary");
        doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor(textColor)
            .text(resumeData.summary, {
                align: "justify",
                lineGap: 3,
                width: pageWidth,
            });

        // ── TECHNICAL SKILLS ────────────────────────────────────────────────
        if (resumeData.skills.length > 0) {
            sectionHeading("Technical Skills");

            // Arrange skills in a 3-column grid
            const skillsPerRow = 3;
            const colWidth = pageWidth / skillsPerRow;
            // col unused — skills are positioned by index
            const startX = 60;
            const startY = doc.y;

            resumeData.skills.forEach((skill, i) => {
                const x = startX + (i % skillsPerRow) * colWidth;
                const y = startY + Math.floor(i / skillsPerRow) * 16;
                doc
                    .font("Helvetica")
                    .fontSize(10)
                    .fillColor(textColor)
                    .text(`• ${skill}`, x, y, { width: colWidth - 10 });
            });

            // Move cursor past the skills grid
            const rows = Math.ceil(resumeData.skills.length / skillsPerRow);
            doc.y = startY + rows * 16 + 4;
        }

        // ── PROJECTS ────────────────────────────────────────────────────────
        if (resumeData.projects.length > 0) {
            sectionHeading("Projects");

            resumeData.projects.forEach((project) => {
                doc
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .fillColor(textColor)
                    .text(project.title);
                doc
                    .font("Helvetica")
                    .fontSize(10)
                    .fillColor(textColor)
                    .text(`• ${project.description}`, {
                        indent: 10,
                        lineGap: 2,
                        width: pageWidth,
                    });
                doc.moveDown(0.4);
            });
        }

        // ── EDUCATION ───────────────────────────────────────────────────────
        if (resumeData.education.length > 0) {
            sectionHeading("Education");

            resumeData.education.forEach((edu) => {
                if (edu.degree) {
                    doc
                        .font("Helvetica-Bold")
                        .fontSize(10)
                        .fillColor(textColor)
                        .text(edu.degree);
                }
                if (edu.institution) {
                    doc
                        .font("Helvetica")
                        .fontSize(10)
                        .fillColor(mutedColor)
                        .text(edu.institution);
                }
                const details: string[] = [];
                if (edu.dates) details.push(edu.dates);
                if (edu.cgpa) details.push(`CGPA: ${edu.cgpa}`);
                if (details.length > 0) {
                    doc
                        .font("Helvetica")
                        .fontSize(9)
                        .fillColor(mutedColor)
                        .text(details.join("  |  "));
                }
                doc.moveDown(0.5);
            });
        }

        doc.end();

        // Wait for PDF to finish generating
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

        const filename = `${resumeData.fullName.replace(/\s+/g, "_")}_ATS_Resume.pdf`;

        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": pdfBuffer.length.toString(),
            },
        });
    } catch (error: unknown) {
        console.error("[/api/download] Error:", error);
        const message =
            error instanceof Error ? error.message : "An unexpected error occurred";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
