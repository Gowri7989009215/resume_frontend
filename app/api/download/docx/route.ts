import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { ExtractedData } from "@/lib/types";

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

        // Generate DOCX
        const doc = new Document({
            creator: "AI Resume Builder",
            title: `${data.personalInfo?.name || "Resume"}`,
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            text: data.personalInfo?.name || "Your Name",
                            heading: HeadingLevel.HEADING_1,
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${data.personalInfo?.email || "email@example.com"} | ${data.personalInfo?.phone || "Phone"} | ${data.personalInfo?.location || "Location"}`,
                                     italics: true,
                                }),
                            ],
                        }),
                        new Paragraph({ text: "" }), // Spacer
                        
                        // Summary
                        ...(data.summary ? [
                            new Paragraph({ text: "Professional Summary", heading: HeadingLevel.HEADING_2 }),
                            new Paragraph({ text: data.summary }),
                            new Paragraph({ text: "" })
                        ] : []),

                        // Experience
                        ...(data.experience && data.experience.length > 0 ? [
                            new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_2 }),
                            ...data.experience.flatMap(exp => [
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: exp.title, bold: true }),
                                        new TextRun({ text: ` at ${exp.company}` }),
                                    ]
                                }),
                                new Paragraph({
                                    children: [
                                         new TextRun({ text: `${exp.date} | ${exp.location}`, italics: true }),
                                    ]
                                }),
                                ...(exp.description || []).map(desc => 
                                    new Paragraph({
                                        text: desc,
                                        bullet: { level: 0 }
                                    })
                                ),
                                new Paragraph({ text: "" })
                            ])
                        ] : []),

                        // Education
                        ...(data.education && data.education.length > 0 ? [
                            new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }),
                            ...data.education.map(edu => 
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: edu.degree, bold: true }),
                                        new TextRun({ text: ` - ${edu.institution} (${edu.date})` }),
                                    ]
                                })
                            ),
                            new Paragraph({ text: "" })
                        ] : []),

                        // Skills
                        ...(data.skills && data.skills.length > 0 ? [
                            new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }),
                            new Paragraph({ text: data.skills.join(", ") }),
                            new Paragraph({ text: "" })
                        ] : []),

                         // Projects
                         ...(data.projects && data.projects.length > 0 ? [
                            new Paragraph({ text: "Projects", heading: HeadingLevel.HEADING_2 }),
                            ...data.projects.flatMap(proj => [
                                new Paragraph({
                                    children: [
                                        new TextRun({ text: proj.title, bold: true }),
                                         ...(proj.technologies ? [new TextRun({ text: ` | ${proj.technologies.join(", ")}`, italics: true })] : [])
                                    ]
                                }),
                                new Paragraph({ text: proj.description || "" }),
                                new Paragraph({ text: "" })
                            ])
                        ] : [])
                    ],
                },
            ],
        });

        const buffer = await Packer.toBuffer(doc);
        const headers = new Headers();
        headers.append("Content-Disposition", 'attachment; filename="resume.docx"');
        headers.append("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

        return new NextResponse(buffer as unknown as BodyInit, {
            status: 200,
            headers,
        });

    } catch (error: unknown) {
        console.error("[/api/download/docx] Error:", error);
        return NextResponse.json({ error: "Failed to generate DOCX" }, { status: 500 });
    }
}
