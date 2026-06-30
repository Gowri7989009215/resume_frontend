import { NextRequest, NextResponse } from "next/server";
import { ExtractedData } from "@/lib/types";
import PDFDocument from "pdfkit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data: ExtractedData = body.resumeData;

        if (!data) {
            return NextResponse.json(
                { error: "Missing resumeData in request body" },
                { status: 400 }
            );
        }

        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
            const doc = new PDFDocument({ margin: 50 });
            const buffers: Buffer[] = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
            doc.on('error', reject);

            const { name, email, phone, location } = data.personalInfo || {};

            // Header
            doc.fontSize(24).font('Helvetica-Bold').text(name || "Your Name", { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica').text(
                `${email || "email@example.com"} | ${phone || "Phone"} | ${location || "Location"}`,
                { align: 'center' }
            );
            doc.moveDown(2);

            // Summary
            if (data.summary) {
                doc.fontSize(14).font('Helvetica-Bold').text("Professional Summary");
                doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();
                doc.moveDown(0.5);
                doc.fontSize(10).font('Helvetica').text(data.summary, { align: 'justify' });
                doc.moveDown(1.5);
            }

            // Experience
            if (data.experience && data.experience.length > 0) {
                doc.fontSize(14).font('Helvetica-Bold').text("Experience");
                doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();
                doc.moveDown(0.5);

                data.experience.forEach(exp => {
                    doc.fontSize(12).font('Helvetica-Bold').text(exp.title, { continued: true });
                    doc.font('Helvetica').text(` at ${exp.company}`);
                    doc.fontSize(10).font('Helvetica-Oblique').text(`${exp.date} | ${exp.location}`);
                    doc.moveDown(0.5);
                    
                    if (exp.description) {
                        exp.description.forEach(desc => {
                            doc.font('Helvetica').text(`• ${desc}`, { indent: 15, align: 'justify' });
                        });
                    }
                    doc.moveDown(1);
                });
            }

            // Education
            if (data.education && data.education.length > 0) {
                doc.fontSize(14).font('Helvetica-Bold').text("Education");
                doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();
                doc.moveDown(0.5);

                data.education.forEach(edu => {
                    doc.fontSize(11).font('Helvetica-Bold').text(edu.degree, { continued: true });
                    doc.font('Helvetica').text(` - ${edu.institution} (${edu.date})`);
                    doc.moveDown(0.5);
                });
                doc.moveDown(1);
            }

            // Skills
            if (data.skills && data.skills.length > 0) {
                doc.fontSize(14).font('Helvetica-Bold').text("Skills");
                doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();
                doc.moveDown(0.5);
                doc.fontSize(10).font('Helvetica').text(data.skills.join(", "));
                doc.moveDown(1.5);
            }

            // Projects
            if (data.projects && data.projects.length > 0) {
                doc.fontSize(14).font('Helvetica-Bold').text("Projects");
                doc.moveTo(50, doc.y + 2).lineTo(550, doc.y + 2).stroke();
                doc.moveDown(0.5);

                data.projects.forEach(proj => {
                    doc.fontSize(11).font('Helvetica-Bold').text(proj.title, { continued: proj.technologies ? true : false });
                    if (proj.technologies) {
                        doc.font('Helvetica-Oblique').fontSize(9).text(` | ${proj.technologies.join(", ")}`);
                    }
                    doc.moveDown(0.5);
                    if (proj.description) {
                        doc.fontSize(10).font('Helvetica').text(proj.description, { align: 'justify' });
                    }
                    doc.moveDown(1);
                });
            }

            doc.end();
        });

        const headers = new Headers();
        headers.append("Content-Disposition", 'attachment; filename="resume.pdf"');
        headers.append("Content-Type", "application/pdf");

        return new NextResponse(pdfBuffer as unknown as BodyInit, {
            status: 200,
            headers,
        });

    } catch (error: unknown) {
        console.error("[/api/download/pdf] Error:", error);
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}
