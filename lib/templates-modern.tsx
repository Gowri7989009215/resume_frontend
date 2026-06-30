import React from "react";
import { ExtractedData } from "@/lib/types";

interface TemplateProps {
  data: ExtractedData;
}

// Helper functions
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

// ========== MODERN TEMPLATES ==========

// 1. MODERN CLEAN
export function ModernClean({ data }: TemplateProps) {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", lineHeight: "1.6", color: "#2c3e50" }}>
      <div style={{ paddingBottom: "24px", borderBottom: "2px solid #3498db" }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "32px", fontWeight: "bold", color: "#2c3e50" }}>
          {getName(data)}
        </h1>
        <p style={{ margin: "0", fontSize: "14px", color: "#7f8c8d" }}>
          {[getEmail(data), getPhone(data), getLocation(data)].filter(Boolean).join(" • ")}
        </p>
        {(getLinkedIn(data) || getGitHub(data)) && (
          <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#3498db" }}>
            {[getLinkedIn(data), getGitHub(data)].filter(Boolean).join(" • ")}
          </p>
        )}
      </div>

      {data.summary && (
        <div style={{ margin: "24px 0" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p style={{ margin: "0", fontSize: "14px", color: "#34495e" }}>{data.summary}</p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div style={{ margin: "24px 0" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
            EXPERIENCE
          </h2>
          {data.experience.map((job, idx) => (
            <div key={idx} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <h3 style={{ margin: "0", fontSize: "15px", fontWeight: "bold", color: "#2c3e50" }}>
                  {job.title}
                </h3>
                <span style={{ fontSize: "14px", color: "#7f8c8d" }}>{job.dates}</span>
              </div>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#3498db", fontWeight: "500" }}>
                {job.company} • {job.location}
              </p>
              <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "14px", color: "#34495e" }}>
                {job.description.map((desc, i) => (
                  <li key={i} style={{ marginBottom: "4px" }}>
                    {desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div style={{ margin: "24px 0" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
            EDUCATION
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <h3 style={{ margin: "0", fontSize: "15px", fontWeight: "bold", color: "#2c3e50" }}>
                  {edu.degree}
                </h3>
                <span style={{ fontSize: "14px", color: "#7f8c8d" }}>{edu.dates}</span>
              </div>
              <p style={{ margin: "0", fontSize: "14px", color: "#34495e" }}>{edu.institution}</p>
              {edu.cgpa && <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#7f8c8d" }}>GPA: {edu.cgpa}</p>}
            </div>
          ))}
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div style={{ margin: "24px 0" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
            SKILLS
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.skills.map((skill, idx) => (
              <span
                key={idx}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "#ecf0f1",
                  borderRadius: "4px",
                  fontSize: "13px",
                  color: "#2c3e50",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.projects && data.projects.length > 0 && (
        <div style={{ margin: "24px 0" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
            PROJECTS
          </h2>
          {data.projects.map((project, idx) => (
            <div key={idx} style={{ marginBottom: "16px" }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "bold", color: "#2c3e50" }}>
                {project.title}
              </h3>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#34495e" }}>{project.description}</p>
              {project.technologies && (
                <p style={{ margin: "0", fontSize: "13px", color: "#7f8c8d" }}>
                  Tech: {project.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 2. MODERN MINIMAL
export function ModernMinimal({ data }: TemplateProps) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", lineHeight: "1.5", color: "#1a1a1a", padding: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ margin: "0", fontSize: "36px", fontWeight: "700", letterSpacing: "-1px" }}>
          {getName(data)}
        </h1>
        <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
          {getEmail(data) && (
            <span style={{ fontSize: "13px", color: "#666" }}>{getEmail(data)}</span>
          )}
          {getPhone(data) && (
            <span style={{ fontSize: "13px", color: "#666" }}>{getPhone(data)}</span>
          )}
          {getLocation(data) && (
            <span style={{ fontSize: "13px", color: "#666" }}>{getLocation(data)}</span>
          )}
        </div>
      </div>

      {data.summary && (
        <div style={{ marginBottom: "32px", maxWidth: "600px" }}>
          <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.6", color: "#444" }}>
            {data.summary}
          </p>
        </div>
      )}

      {data.experience && data.experience.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ margin: "0 0 16px 0", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "#000" }}>
            Experience
          </h2>
          {data.experience.map((job, idx) => (
            <div key={idx} style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: idx !== data.experience!.length - 1 ? "1px solid #eee" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <h3 style={{ margin: "0", fontSize: "14px", fontWeight: "600" }}>{job.title}</h3>
                <span style={{ fontSize: "13px", color: "#999" }}>{job.dates}</span>
              </div>
              <p style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#666" }}>
                {job.company}
              </p>
              <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "13px", color: "#555" }}>
                {job.description.slice(0, 3).map((desc, i) => (
                  <li key={i} style={{ marginBottom: "4px" }}>
                    {desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ margin: "0 0 16px 0", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "#000" }}>
            Education
          </h2>
          {data.education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ margin: "0", fontSize: "14px", fontWeight: "600" }}>{edu.degree}</h3>
                <span style={{ fontSize: "13px", color: "#999" }}>{edu.dates}</span>
              </div>
              <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#666" }}>{edu.institution}</p>
            </div>
          ))}
        </div>
      )}

      {data.skills && data.skills.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", color: "#000" }}>
            Skills
          </h2>
          <p style={{ margin: "0", fontSize: "13px", color: "#555", lineHeight: "1.8" }}>
            {data.skills.join(" • ")}
          </p>
        </div>
      )}
    </div>
  );
}

// 3. MODERN BOLD
export function ModernBold({ data }: TemplateProps) {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", lineHeight: "1.7", color: "#1f2937" }}>
      <div style={{ backgroundColor: "#1f2937", color: "white", padding: "40px", marginBottom: "32px" }}>
        <h1 style={{ margin: "0", fontSize: "40px", fontWeight: "900", textTransform: "uppercase" }}>
          {getName(data)}
        </h1>
        <div style={{ display: "flex", gap: "20px", marginTop: "12px", flexWrap: "wrap", fontSize: "14px" }}>
          {getEmail(data) && <span>{getEmail(data)}</span>}
          {getPhone(data) && <span>{getPhone(data)}</span>}
          {getLocation(data) && <span>{getLocation(data)}</span>}
        </div>
      </div>

      <div style={{ padding: "0 40px" }}>
        {data.summary && (
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", color: "#1f2937" }}>
              Professional Summary
            </h2>
            <p style={{ margin: "0", fontSize: "14px", color: "#4b5563", lineHeight: "1.7" }}>
              {data.summary}
            </p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", color: "#1f2937" }}>
              Experience
            </h2>
            {data.experience.map((job, idx) => (
              <div key={idx} style={{ marginBottom: "20px", paddingLeft: "16px", borderLeft: "4px solid #1f2937" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <h3 style={{ margin: "0", fontSize: "15px", fontWeight: "bold", color: "#1f2937" }}>
                    {job.title}
                  </h3>
                  <span style={{ fontSize: "13px", color: "#9ca3af" }}>{job.dates}</span>
                </div>
                <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "#4b5563" }}>
                  {job.company}
                </p>
                <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "13px", color: "#6b7280" }}>
                  {job.description.map((desc, i) => (
                    <li key={i} style={{ marginBottom: "4px" }}>
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.skills && data.skills.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", color: "#1f2937" }}>
              Technical Skills
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {data.skills.map((skill, idx) => (
                <span key={idx} style={{ fontSize: "13px", color: "#4b5563" }}>
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.education && data.education.length > 0 && (
          <div>
            <h2 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", color: "#1f2937" }}>
              Education
            </h2>
            {data.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: "12px", paddingLeft: "16px", borderLeft: "4px solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <h3 style={{ margin: "0", fontSize: "14px", fontWeight: "bold", color: "#1f2937" }}>
                    {edu.degree}
                  </h3>
                  <span style={{ fontSize: "13px", color: "#9ca3af" }}>{edu.dates}</span>
                </div>
                <p style={{ margin: "0", fontSize: "13px", color: "#4b5563" }}>{edu.institution}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 4. MODERN SIDEBAR
export function ModernSidebar({ data }: TemplateProps) {
  return (
    <div style={{ display: "flex", fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", lineHeight: "1.6" }}>
      {/* Sidebar */}
      <div style={{ backgroundColor: "#2c3e50", color: "white", padding: "40px 30px", width: "280px" }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "bold" }}>
          {getName(data).split(" ")[0]}
        </h1>
        <p style={{ margin: "0 0 24px 0", fontSize: "12px", color: "#bdc3c7" }}>
          {getName(data).split(" ").slice(1).join(" ")}
        </p>

        {/* Contact */}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", color: "#95a5a6" }}>
            Contact
          </h3>
          <div style={{ fontSize: "12px", color: "#ecf0f1", lineHeight: "1.8" }}>
            {getEmail(data) && <div>{getEmail(data)}</div>}
            {getPhone(data) && <div>{getPhone(data)}</div>}
            {getLocation(data) && <div>{getLocation(data)}</div>}
          </div>
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", color: "#95a5a6" }}>
              Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#34495e",
                    borderRadius: "3px",
                    fontSize: "11px",
                    color: "#ecf0f1",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", backgroundColor: "white" }}>
        {data.summary && (
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
              PROFESSIONAL SUMMARY
            </h2>
            <p style={{ margin: "0", fontSize: "14px", color: "#34495e", lineHeight: "1.7" }}>
              {data.summary}
            </p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
              EXPERIENCE
            </h2>
            {data.experience.map((job, idx) => (
              <div key={idx} style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <h3 style={{ margin: "0", fontSize: "15px", fontWeight: "bold", color: "#2c3e50" }}>
                    {job.title}
                  </h3>
                  <span style={{ fontSize: "13px", color: "#7f8c8d" }}>{job.dates}</span>
                </div>
                <p style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "#34495e" }}>
                  {job.company}
                </p>
                <ul style={{ margin: "0", paddingLeft: "20px", fontSize: "13px", color: "#34495e" }}>
                  {job.description.slice(0, 4).map((desc, i) => (
                    <li key={i} style={{ marginBottom: "4px" }}>
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.education && data.education.length > 0 && (
          <div>
            <h2 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>
              EDUCATION
            </h2>
            {data.education.map((edu, idx) => (
              <div key={idx} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <h3 style={{ margin: "0", fontSize: "14px", fontWeight: "bold", color: "#2c3e50" }}>
                    {edu.degree}
                  </h3>
                  <span style={{ fontSize: "13px", color: "#7f8c8d" }}>{edu.dates}</span>
                </div>
                <p style={{ margin: "0", fontSize: "13px", color: "#34495e" }}>{edu.institution}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 5. MODERN HYBRID
export function ModernHybrid({ data }: TemplateProps) {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", lineHeight: "1.6", color: "#2c3e50" }}>
      {/* Header with accent */}
      <div style={{ backgroundColor: "#ecf0f1", padding: "30px", marginBottom: "24px", borderLeft: "6px solid #3498db" }}>
        <h1 style={{ margin: "0", fontSize: "34px", fontWeight: "bold", color: "#2c3e50" }}>
          {getName(data)}
        </h1>
        <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#7f8c8d" }}>
          {[getEmail(data), getPhone(data), getLocation(data)].filter(Boolean).join(" • ")}
        </p>
        {(getLinkedIn(data) || getGitHub(data)) && (
          <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#3498db" }}>
            {[getLinkedIn(data), getGitHub(data)].filter(Boolean).join(" • ")}
          </p>
        )}
      </div>

      <div style={{ padding: "0 24px" }}>
        {data.summary && (
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "15px", fontWeight: "bold", textTransform: "uppercase", color: "#2c3e50", borderBottom: "2px solid #3498db", paddingBottom: "6px" }}>
              Summary
            </h2>
            <p style={{ margin: "0", fontSize: "14px", color: "#34495e" }}>{data.summary}</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Left Column */}
          <div>
            {data.experience && data.experience.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: "bold", textTransform: "uppercase", color: "#2c3e50", borderBottom: "2px solid #3498db", paddingBottom: "6px" }}>
                  Experience
                </h2>
                {data.experience.map((job, idx) => (
                  <div key={idx} style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: idx !== data.experience!.length - 1 ? "1px solid #ecf0f1" : "none" }}>
                    <h3 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: "bold", color: "#2c3e50" }}>
                      {job.title}
                    </h3>
                    <p style={{ margin: "0", fontSize: "13px", color: "#3498db", fontWeight: "500" }}>
                      {job.company}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#7f8c8d" }}>
                      {job.dates}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {data.education && data.education.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: "bold", textTransform: "uppercase", color: "#2c3e50", borderBottom: "2px solid #3498db", paddingBottom: "6px" }}>
                  Education
                </h2>
                {data.education.map((edu, idx) => (
                  <div key={idx} style={{ marginBottom: "12px" }}>
                    <h3 style={{ margin: "0 0 2px 0", fontSize: "14px", fontWeight: "bold", color: "#2c3e50" }}>
                      {edu.degree}
                    </h3>
                    <p style={{ margin: "0", fontSize: "13px", color: "#34495e" }}>
                      {edu.institution}
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#7f8c8d" }}>
                      {edu.dates}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {data.skills && data.skills.length > 0 && (
              <div>
                <h2 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: "bold", textTransform: "uppercase", color: "#2c3e50", borderBottom: "2px solid #3498db", paddingBottom: "6px" }}>
                  Skills
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {data.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: "#ecf0f1",
                        borderRadius: "3px",
                        fontSize: "12px",
                        color: "#2c3e50",
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

        {data.projects && data.projects.length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <h2 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: "bold", textTransform: "uppercase", color: "#2c3e50", borderBottom: "2px solid #3498db", paddingBottom: "6px" }}>
              Projects
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {data.projects.map((project, idx) => (
                <div key={idx} style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "13px", fontWeight: "bold", color: "#2c3e50" }}>
                    {project.title}
                  </h3>
                  <p style={{ margin: "0", fontSize: "12px", color: "#34495e" }}>
                    {project.description.substring(0, 60)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const modernTemplates = [
  { name: "ModernClean", component: ModernClean, label: "Clean Modern" },
  { name: "ModernMinimal", component: ModernMinimal, label: "Minimal Modern" },
  { name: "ModernBold", component: ModernBold, label: "Bold Modern" },
  { name: "ModernSidebar", component: ModernSidebar, label: "Sidebar Modern" },
  { name: "ModernHybrid", component: ModernHybrid, label: "Hybrid Modern" },
];
