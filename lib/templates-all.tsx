import React from "react";
import { ExtractedData } from "@/lib/types";

interface TemplateProps {
  data: ExtractedData;
}

function getName(data: ExtractedData) {
  return data.fullName || data.personalInfo?.name || "Your Name";
}

function getEmail(data: ExtractedData) {
  return data.email || data.personalInfo?.email || "your.email@example.com";
}

function getPhone(data: ExtractedData) {
  return data.phone || data.personalInfo?.phone || "+1 (555) 000-0000";
}

function getLocation(data: ExtractedData) {
  return data.personalInfo?.location || "City, State";
}

function getLinkedIn(data: ExtractedData) {
  return data.linkedin || "";
}

function getGitHub(data: ExtractedData) {
  return data.github || "";
}

// ========== CORPORATE TEMPLATES ==========

export function CorporateClassic({ data }: TemplateProps) {
  return (
    <div style={{ fontFamily: "'Times New Roman', serif", lineHeight: "1.5", color: "#000" }}>
      <div style={{ textAlign: "center", paddingBottom: "20px", borderBottom: "2px solid #000" }}>
        <h1 style={{ margin: "0", fontSize: "28px", fontWeight: "bold" }}>
          {getName(data)}
        </h1>
        <p style={{ margin: "8px 0 4px 0", fontSize: "12px" }}>
          {getEmail(data)} | {getPhone(data)}
        </p>
        <p style={{ margin: "0", fontSize: "12px" }}>
          {getLocation(data)}
        </p>
      </div>

      {data.summary && (
        <div style={{ margin: "20px 0" }}>
          <h2 style={{ margin: "0", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase" }}>
            Professional Summary
          </h2>
          <p style={{ margin: "8px 0", fontSize: "11px", lineHeight: "1.6" }}>
            {data.summary}
          </p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div style={{ margin: "20px 0" }}>
          <h2 style={{ margin: "0", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase" }}>
            Professional Experience
          </h2>
          {data.experience.map((job, idx) => (
            <div key={idx} style={{ margin: "12px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: "11px" }}>{job.title}</strong>
                <span style={{ fontSize: "11px" }}>{job.dates}</span>
              </div>
              <div style={{ fontSize: "11px", fontStyle: "italic" }}>
                {job.company} | {job.location}
              </div>
              <ul style={{ margin: "6px 0", paddingLeft: "20px", fontSize: "11px" }}>
                {job.description.slice(0, 3).map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div style={{ margin: "20px 0" }}>
          <h2 style={{ margin: "0", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase" }}>
            Education
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} style={{ margin: "8px 0" }}>
              <strong style={{ fontSize: "11px" }}>{edu.degree}</strong>
              <div style={{ fontSize: "11px" }}>
                {edu.institution} | {edu.dates}
              </div>
            </div>
          ))}
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div style={{ margin: "20px 0" }}>
          <h2 style={{ margin: "0", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase" }}>
            Core Competencies
          </h2>
          <p style={{ margin: "8px 0", fontSize: "11px" }}>
            {data.skills.slice(0, 15).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

export function CorporateProfessional({ data }: TemplateProps) {
  return (
    <div style={{ fontFamily: "'Arial', sans-serif", lineHeight: "1.5", color: "#1a1a1a", padding: "40px" }}>
      <table style={{ width: "100%", marginBottom: "30px" }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: "top" }}>
              <h1 style={{ margin: "0", fontSize: "32px", fontWeight: "bold" }}>
                {getName(data)}
              </h1>
            </td>
            <td style={{ textAlign: "right", verticalAlign: "top", fontSize: "12px" }}>
              <div>{getEmail(data)}</div>
              <div>{getPhone(data)}</div>
              <div>{getLocation(data)}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {data.summary && (
        <div style={{ marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #ccc" }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "bold" }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p style={{ margin: "0", fontSize: "12px", lineHeight: "1.6" }}>
            {data.summary}
          </p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "bold" }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          {data.experience.map((job, idx) => (
            <div key={idx} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: idx !== data.experience!.length - 1 ? "1px solid #eee" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ margin: "0", fontSize: "12px", fontWeight: "bold" }}>
                  {job.title}
                </h3>
                <span style={{ fontSize: "11px", color: "#666" }}>{job.dates}</span>
              </div>
              <p style={{ margin: "4px 0 6px 0", fontSize: "11px", color: "#333" }}>
                {job.company} • {job.location}
              </p>
              <ul style={{ margin: "0", paddingLeft: "18px", fontSize: "11px", lineHeight: "1.5" }}>
                {job.description.slice(0, 4).map((desc, i) => (
                  <li key={i} style={{ marginBottom: "3px" }}>
                    {desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "bold" }}>
            EDUCATION
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: "8px", fontSize: "11px" }}>
              <strong>{edu.degree}</strong> • {edu.institution}
              {edu.dates && <span style={{ color: "#666" }}> ({edu.dates})</span>}
            </div>
          ))}
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "bold" }}>
            TECHNICAL SKILLS
          </h2>
          <p style={{ margin: "0", fontSize: "11px", lineHeight: "1.6" }}>
            {data.skills.join(" • ")}
          </p>
        </div>
      )}
    </div>
  );
}

export function CorporateExecutive({ data }: TemplateProps) {
  const bgColor = "#1e3a5f";
  return (
    <div style={{ fontFamily: "'Calibri', sans-serif", lineHeight: "1.5", color: "#333" }}>
      <div style={{ backgroundColor: bgColor, color: "white", padding: "35px", marginBottom: "25px" }}>
        <h1 style={{ margin: "0", fontSize: "36px", fontWeight: "bold", letterSpacing: "-0.5px" }}>
          {getName(data)}
        </h1>
        <div style={{ display: "flex", gap: "15px", marginTop: "10px", fontSize: "13px", flexWrap: "wrap" }}>
          {getEmail(data) && <span>📧 {getEmail(data)}</span>}
          {getPhone(data) && <span>📱 {getPhone(data)}</span>}
          {getLocation(data) && <span>📍 {getLocation(data)}</span>}
        </div>
      </div>

      <div style={{ padding: "0 35px" }}>
        {data.summary && (
          <div style={{ marginBottom: "25px" }}>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "bold", color: bgColor, textTransform: "uppercase", letterSpacing: "1px" }}>
              Executive Profile
            </h2>
            <p style={{ margin: "0", fontSize: "12px", lineHeight: "1.7", color: "#444" }}>
              {data.summary}
            </p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "bold", color: bgColor, textTransform: "uppercase", letterSpacing: "1px" }}>
              Career History
            </h2>
            {data.experience.map((job, idx) => (
              <div key={idx} style={{ marginBottom: "15px", paddingBottom: "12px", borderBottom: idx !== data.experience!.length - 1 ? "1px solid #ddd" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <h3 style={{ margin: "0", fontSize: "12px", fontWeight: "bold", color: "#1a1a1a" }}>
                    {job.title}
                  </h3>
                  <span style={{ fontSize: "11px", color: "#888" }}>{job.dates}</span>
                </div>
                <p style={{ margin: "0 0 6px 0", fontSize: "11px", color: bgColor, fontWeight: "600" }}>
                  {job.company}
                </p>
                <ul style={{ margin: "0", paddingLeft: "18px", fontSize: "11px", color: "#555" }}>
                  {job.description.slice(0, 3).map((desc, i) => (
                    <li key={i} style={{ marginBottom: "2px" }}>
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: "25px" }}>
          <div style={{ flex: 1 }}>
            {data.education && data.education.length > 0 && (
              <div>
                <h2 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "bold", color: bgColor, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Education
                </h2>
                {data.education.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: "8px", fontSize: "11px" }}>
                    <strong>{edu.degree}</strong>
                    <div style={{ color: "#666", fontSize: "10px" }}>
                      {edu.institution}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            {data.skills && data.skills.length > 0 && (
              <div>
                <h2 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: "bold", color: bgColor, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Key Skills
                </h2>
                <div style={{ fontSize: "11px", color: "#555", lineHeight: "1.6" }}>
                  {data.skills.slice(0, 12).join(", ")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== MINIMAL TEMPLATES ==========

export function MinimalATS({ data }: TemplateProps) {
  return (
    <div style={{ fontFamily: "'Arial', sans-serif", lineHeight: "1.4", color: "#000", padding: "20px" }}>
      <h1 style={{ margin: "0", fontSize: "18px", fontWeight: "bold" }}>
        {getName(data)}
      </h1>
      <p style={{ margin: "4px 0 0 0", fontSize: "11px" }}>
        {getEmail(data)} | {getPhone(data)} | {getLocation(data)}
      </p>

      {data.summary && (
        <div style={{ margin: "12px 0" }}>
          <h2 style={{ margin: "0", fontSize: "12px", fontWeight: "bold" }}>
            SUMMARY
          </h2>
          <p style={{ margin: "4px 0", fontSize: "11px" }}>{data.summary}</p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div style={{ margin: "12px 0" }}>
          <h2 style={{ margin: "0", fontSize: "12px", fontWeight: "bold" }}>
            EXPERIENCE
          </h2>
          {data.experience.map((job, idx) => (
            <div key={idx} style={{ margin: "4px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                <strong>{job.title}</strong>
                <span>{job.dates}</span>
              </div>
              <div style={{ fontSize: "10px" }}>
                {job.company} | {job.location}
              </div>
              <ul style={{ margin: "2px 0", paddingLeft: "16px", fontSize: "10px" }}>
                {job.description.slice(0, 2).map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div style={{ margin: "12px 0" }}>
          <h2 style={{ margin: "0", fontSize: "12px", fontWeight: "bold" }}>
            EDUCATION
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} style={{ margin: "4px 0", fontSize: "10px" }}>
              <strong>{edu.degree}</strong> - {edu.institution} ({edu.dates})
            </div>
          ))}
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div style={{ margin: "12px 0" }}>
          <h2 style={{ margin: "0", fontSize: "12px", fontWeight: "bold" }}>
            SKILLS
          </h2>
          <p style={{ margin: "4px 0", fontSize: "10px" }}>
            {data.skills.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

export function MinimalElegan({ data }: TemplateProps) {
  return (
    <div style={{ fontFamily: "'Georgia', serif", lineHeight: "1.6", color: "#2c2c2c", padding: "40px" }}>
      <div style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid #ddd" }}>
        <h1 style={{ margin: "0", fontSize: "28px", fontWeight: "normal", letterSpacing: "1px" }}>
          {getName(data)}
        </h1>
        <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#666", letterSpacing: "0.5px" }}>
          {[getEmail(data), getPhone(data), getLocation(data)].filter(Boolean).join(" • ")}
        </p>
      </div>

      {data.summary && (
        <div style={{ marginBottom: "25px" }}>
          <p style={{ margin: "0", fontSize: "12px", lineHeight: "1.8", color: "#555", fontStyle: "italic" }}>
            {data.summary}
          </p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div style={{ marginBottom: "25px" }}>
          <h2 style={{ margin: "0 0 15px 0", fontSize: "12px", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase" }}>
            Experience
          </h2>
          {data.experience.map((job, idx) => (
            <div key={idx} style={{ marginBottom: "15px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <h3 style={{ margin: "0", fontSize: "12px", fontWeight: "bold" }}>
                  {job.title}
                </h3>
                <span style={{ fontSize: "11px", color: "#999" }}>{job.dates}</span>
              </div>
              <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "#666" }}>
                {job.company}
              </p>
            </div>
          ))}
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "12px", fontWeight: "bold", letterSpacing: "1px", textTransform: "uppercase" }}>
            Education
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: "8px", fontSize: "11px" }}>
              <strong>{edu.degree}</strong>, {edu.institution}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ========== CREATIVE TEMPLATES ==========

export function CreativeColorful({ data }: TemplateProps) {
  const accentColor = "#ff6b6b";
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", lineHeight: "1.6", color: "#333" }}>
      <div style={{ backgroundColor: "#f8f9fa", padding: "30px", marginBottom: "25px", borderLeft: "8px solid " + accentColor }}>
        <h1 style={{ margin: "0", fontSize: "32px", fontWeight: "bold", color: accentColor }}>
          {getName(data)}
        </h1>
        <p style={{ margin: "10px 0 0 0", fontSize: "13px", color: "#666" }}>
          {[getEmail(data), getPhone(data), getLocation(data)].filter(Boolean).join(" • ")}
        </p>
      </div>

      <div style={{ padding: "0 30px" }}>
        {data.summary && (
          <div style={{ marginBottom: "25px", padding: "15px", backgroundColor: "#fff8dc", borderRadius: "4px" }}>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "bold", color: accentColor }}>
              About Me
            </h2>
            <p style={{ margin: "0", fontSize: "12px", color: "#555" }}>
              {data.summary}
            </p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "bold", color: accentColor, paddingBottom: "6px", borderBottom: "2px solid " + accentColor }}>
              Experience
            </h2>
            {data.experience.map((job, idx) => (
              <div key={idx} style={{ marginBottom: "12px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
                <h3 style={{ margin: "0 0 2px 0", fontSize: "12px", fontWeight: "bold", color: "#000" }}>
                  {job.title}
                </h3>
                <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: accentColor, fontWeight: "600" }}>
                  {job.company}
                </p>
                <p style={{ margin: "0", fontSize: "10px", color: "#999" }}>
                  {job.dates}
                </p>
              </div>
            ))}
          </div>
        )}

        {data.skills && data.skills.length > 0 && (
          <div style={{ marginBottom: "25px" }}>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "bold", color: accentColor, paddingBottom: "6px", borderBottom: "2px solid " + accentColor }}>
              Skills
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: accentColor,
                    color: "white",
                    borderRadius: "16px",
                    fontSize: "11px",
                    fontWeight: "500",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.education && data.education.length > 0 && (
          <div>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "bold", color: accentColor, paddingBottom: "6px", borderBottom: "2px solid " + accentColor }}>
              Education
            </h2>
            {data.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: "8px", padding: "8px", backgroundColor: "#f0f0f0", borderRadius: "4px", fontSize: "11px" }}>
                <strong>{edu.degree}</strong>
                <div style={{ color: "#666", fontSize: "10px" }}>{edu.institution}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CreativeGradient({ data }: TemplateProps) {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", lineHeight: "1.6", color: "#333" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          padding: "40px",
          marginBottom: "30px",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ margin: "0", fontSize: "36px", fontWeight: "bold" }}>
          {getName(data)}
        </h1>
        <div style={{ display: "flex", gap: "20px", marginTop: "12px", fontSize: "13px", flexWrap: "wrap" }}>
          {getEmail(data) && <span>{getEmail(data)}</span>}
          {getPhone(data) && <span>{getPhone(data)}</span>}
          {getLocation(data) && <span>{getLocation(data)}</span>}
        </div>
      </div>

      <div style={{ padding: "0 40px" }}>
        {data.summary && (
          <div style={{ marginBottom: "25px" }}>
            <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.7", color: "#555" }}>
              {data.summary}
            </p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
          <div>
            {data.experience && data.experience.length > 0 && (
              <div>
                <h2 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "bold", color: "#667eea" }}>
                  Experience
                </h2>
                {data.experience.slice(0, 2).map((job, idx) => (
                  <div key={idx} style={{ marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid #eee" }}>
                    <h3 style={{ margin: "0", fontSize: "12px", fontWeight: "bold" }}>
                      {job.title}
                    </h3>
                    <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#666" }}>
                      {job.company}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {data.skills && data.skills.length > 0 && (
              <div>
                <h2 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "bold", color: "#667eea" }}>
                  Skills
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {data.skills.slice(0, 10).map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "3px",
                        fontSize: "11px",
                        color: "#667eea",
                        fontWeight: "500",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const allTemplates = [
  // Corporate
  { id: "corporate-classic", name: "Corporate Classic", category: "Corporate", component: CorporateClassic },
  { id: "corporate-professional", name: "Corporate Professional", category: "Corporate", component: CorporateProfessional },
  { id: "corporate-executive", name: "Corporate Executive", category: "Corporate", component: CorporateExecutive },

  // Minimal
  { id: "minimal-ats", name: "Minimal ATS", category: "Minimal", component: MinimalATS },
  { id: "minimal-elegant", name: "Minimal Elegant", category: "Minimal", component: MinimalElegan },

  // Creative
  { id: "creative-colorful", name: "Creative Colorful", category: "Creative", component: CreativeColorful },
  { id: "creative-gradient", name: "Creative Gradient", category: "Creative", component: CreativeGradient },
];
