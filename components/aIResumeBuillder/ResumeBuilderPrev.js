"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Download,
  Loader2,
  Briefcase,
  GraduationCap,
  Code,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Wand2,
  CircleX,
} from "lucide-react";
import Link from "next/link";
import {
  enhanceResumeSectionAPIAPIHandler,
  generateResumeAPIHandler,
} from "@/store/actions/resumeActions";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/store/slices/appSettingsSlice";

// Load jsPDF from CDN
const loadJsPDF = () => {
  return new Promise((resolve, reject) => {
    if (window.jspdf) {
      resolve(window.jspdf);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve(window.jspdf);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Helper: default section keys in the LEFT sidebar (Option B: show all)
const SECTION_KEYS = [
  {
    key: "personalInfo",
    title: "Personal Info",
    icon: <Mail className="w-3 h-3" />,
  },
  { key: "summary", title: "Summary", icon: <Briefcase className="w-3 h-3" /> },
  { key: "skills", title: "Skills", icon: <Code className="w-3 h-3" /> },
  {
    key: "workExperience",
    title: "Experience",
    icon: <Briefcase className="w-3 h-3" />,
  },
  {
    key: "education",
    title: "Education",
    icon: <GraduationCap className="w-3 h-3" />,
  },
  { key: "projects", title: "Projects", icon: <Code className="w-3 h-3" /> },
  {
    key: "certifications",
    title: "Certifications",
    icon: <Briefcase className="w-3 h-3" />,
  },
  { key: "contact", title: "Contact", icon: <Mail className="w-3 h-3" /> },
  {
    key: "additional",
    title: "Additional",
    icon: <Wand2 className="w-3 h-3" />,
  },
];

// Main Resume Builder Component
export default function ResumeBuilderPrev({
  promptInput,
  setPromptInput,
  resumeInput,
  setResumeInput,
  setShowResumeBuilder,
  resetAll,
}) {
  const [prompt, setPrompt] = useState(promptInput);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  // left section refs for scroll + highlight
  const leftRefs = useRef({});
  const leftContainerRef = useRef(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const generate = async () => {
    dispatch(
      generateResumeAPIHandler(
        { prompt },
        setError,
        setLoading,
        setResume,
        setSelectedSection
      )
    );
  };

  const enhanceSection = async (sectionKey, enhancementPrompt, setLoading) => {
    const payload = {
      resume,
      sectionKey,
      prompt: enhancementPrompt,
    };
    dispatch(
      enhanceResumeSectionAPIAPIHandler(
        payload,
        setResume,
        setSelectedSection,
        scrollLeftTo,
        setLoading
      )
    );
  };

  const exportToPDF = async () => {
    if (!resume) return;

    try {
      const { jsPDF } = await loadJsPDF();
      const doc = new jsPDF();

      let yPos = 20;
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const contentWidth = pageWidth - 2 * margin;

      // Helper function to add text with wrapping
      const addText = (text, size, isBold = false, color = [0, 0, 0]) => {
        doc.setFontSize(size);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, contentWidth);
        doc.text(lines, margin, yPos);
        yPos += lines.length * size * 0.4 + 2;
      };

      const addSpace = (space = 5) => {
        yPos += space;
      };

      const checkPageBreak = (spaceNeeded = 20) => {
        if (yPos + spaceNeeded > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          yPos = 20;
        }
      };

      // Header - Name using personalInfo
      const headerName = resume?.personalInfo?.fullName || "Your Name";
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175); // Blue color
      doc.text(headerName, pageWidth / 2, yPos, { align: "center" });
      yPos += 10;

      // Contact Info using personalInfo and contact
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      const contactInfoArr = [
        resume?.personalInfo?.email,
        resume?.contact?.phone,
        resume?.personalInfo?.location || resume?.contact?.location,
      ].filter(Boolean);
      const contactInfo = contactInfoArr.join(" • ");
      if (contactInfo) {
        doc.text(contactInfo, pageWidth / 2, yPos, { align: "center" });
        yPos += 8;
      }

      // Divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Summary Section
      if (resume.summary) {
        checkPageBreak();
        addText("PROFESSIONAL SUMMARY", 11, true, [30, 64, 175]);
        addText(resume.summary, 9);
        addSpace();
      }

      // Skills Section
      if (resume.skills && resume.skills.length > 0) {
        checkPageBreak();
        addText("SKILLS", 11, true, [30, 64, 175]);
        addText(resume.skills.join(" • "), 9);
        addSpace();
      }

      // Work Experience Section
      if (resume.workExperience && resume.workExperience.length > 0) {
        checkPageBreak(40);
        addText("WORK EXPERIENCE", 11, true, [30, 64, 175]);

        resume.workExperience.forEach((work, index) => {
          checkPageBreak(30);

          // Position and Company
          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
          doc.text(work.position || "", margin, yPos);
          yPos += 5;

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(30, 64, 175);
          doc.text(work.company || "", margin, yPos);

          // Date (right aligned)
          doc.setTextColor(100, 100, 100);
          const dateText = `${work.startDate || ""} - ${
            work.endDate || "Present"
          }`;
          doc.text(dateText, pageWidth - margin, yPos, { align: "right" });
          yPos += 6;

          // Highlights
          if (work.highlights && work.highlights.length > 0) {
            doc.setTextColor(0, 0, 0);
            work.highlights.forEach((highlight) => {
              checkPageBreak(15);
              const bulletPoint = "• ";
              doc.text(bulletPoint, margin + 2, yPos);
              const lines = doc.splitTextToSize(highlight, contentWidth - 5);
              doc.text(lines, margin + 5, yPos);
              yPos += lines.length * 9 * 0.4 + 2;
            });
          }

          if (index < resume.workExperience.length - 1) {
            addSpace(3);
          }
        });
        addSpace();
      }

      // Education Section
      if (resume.education && resume.education.length > 0) {
        checkPageBreak(30);
        addText("EDUCATION", 11, true, [30, 64, 175]);

        resume.education.forEach((edu) => {
          checkPageBreak(20);

          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
          doc.text(edu.degree || "", margin, yPos);
          yPos += 5;

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(30, 64, 175);
          doc.text(edu.institution || "", margin, yPos);

          if (edu.startYear || edu.endYear) {
            doc.setTextColor(100, 100, 100);
            const eduDate = `${edu.startYear || ""} - ${edu.endYear || ""}`;
            doc.text(eduDate, pageWidth - margin, yPos, { align: "right" });
          }
          yPos += 8;
        });
      }

      // Save the PDF
      const fileName =
        (resume?.personalInfo?.fullName || "resume").replace(/\s+/g, "_") +
        ".pdf";
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Scroll left to a section key
  const scrollLeftTo = (sectionKey) => {
    const el = leftRefs.current[sectionKey];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // also ensure parent container shows it nicely
      if (leftContainerRef.current) {
        // no-op; scrollIntoView handles most cases
      }
    }
  };

  // Called when clicking a section in preview
  const onPreviewSectionClick = (sectionKey) => {
    setSelectedSection(sectionKey);
    scrollLeftTo(sectionKey);
  };

  // Called when clicking left section header
  const onLeftSectionClick = (sectionKey) => {
    setSelectedSection(sectionKey);
    // optionally scroll preview to top or focus - not required
  };

  useEffect(() => {
    if (prompt.length > 0) {
      generate();
    }

    return () => {};
  }, []);

  return (
    <div className="h-[calc(100vh-60.8px)] text-g-900 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - 30% */}
        <div
          className="w-[30%] border-r border-slate-200 bg-white/50 backdrop-blur-sm flex flex-col overflow-hidden"
          ref={leftContainerRef}
        >
          <div className="flex-shrink-0 p-3 border-b border-slate-200">
            {/* AI Prompt Card */}
            <div className="bg-white text-g-900 rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2">
                <h3 className="text-white text-xs font-semibold flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5" />
                  Build with AI
                </h3>
              </div>

              <div className="p-3">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Experienced backend engineer with 4 years Node.js + Prisma, seeking SDE-2 roles'"
                  className="w-full h-20 outline-none px-2.5 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-xs placeholder:text-slate-400"
                />

                <button
                  onClick={generate}
                  disabled={loading || !prompt}
                  className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Generate Resume
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Enhancement - Scrollable */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <h3 className="text-xs font-semibold text-slate-700 px-1 mb-1">
              Enhance Sections
            </h3>

            {/* Render ALL sections (Option B) */}
            {resume &&
              SECTION_KEYS.map((s) => {
                // get the data for this section (may be undefined if API excluded)
                const secData = resume ? resume[s.key] : undefined;
                // determine removed state: section data missing OR (array and length 0) OR (string null/empty)
                const isRemoved =
                  resume &&
                  (secData === undefined ||
                    secData === null ||
                    (Array.isArray(secData) && secData.length === 0) ||
                    (typeof secData === "string" && secData.trim() === ""));

                return (
                  <div
                    key={s.key}
                    ref={(el) => (leftRefs.current[s.key] = el)}
                    onClick={() => onLeftSectionClick(s.key)}
                    className={`transition ${
                      selectedSection === s.key ? "ring-2 ring-blue-200" : ""
                    }`}
                  >
                    <SectionBox
                      title={s.title}
                      icon={s.icon}
                      sectionKey={s.key}
                      value={secData}
                      isRemoved={isRemoved}
                      onEnhance={(p, setLoading) =>
                        enhanceSection(s.key, p, setLoading)
                      }
                    />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Preview - 70% */}
        <div className="flex-1 bg-white overflow-hidden flex flex-col">
          <div className="flex-shrink-0 bg-gradient-to-r from-slate-50 to-blue-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">
              Resume Preview
            </h2>
            <div className="flex items-center gap-2.5">
              {true && (
                <button
                  onClick={exportToPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105"
                >
                  <Download className="w-3 h-3" />
                  <span className="font-medium">Download as PDF</span>
                </button>
              )}
              <button
                onClick={() => {
                  setShowResumeBuilder(false);
                  resetAll();
                  dispatch(toggleSidebar());
                }}
                className="text-g-200 cursor-pointer hover:text-g-200/90 transition-colors"
              >
                <CircleX size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <LoadingState />
            ) : (
              <ResumeView
                resume={resume}
                onSectionClick={onPreviewSectionClick}
                selectedSection={selectedSection}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading State Component (unchanged)
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-slate-600 font-medium text-sm">
        Crafting your resume...
      </p>
      <p className="text-xs text-slate-400 mt-1">
        AI is analyzing your experience
      </p>
    </div>
  );
}

// Resume View Component - Dynamic & clickable sections
function ResumeView({ resume, onSectionClick, selectedSection }) {
  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-base font-semibold text-slate-700 mb-1">
          No Resume Yet
        </h3>
        <p className="text-slate-500 text-xs max-w-md">
          Enter your details and click "Generate Resume"
        </p>
      </div>
    );
  }

  // helper to render clickable container wrapper
  const SectionWrapper = ({ id, children }) => (
    <div
      onClick={() => onSectionClick(id)}
      className={`cursor-pointer ${
        selectedSection === id ? "bg-slate-50 rounded-md p-2" : ""
      }`}
    >
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-4 text-xs">
      {/* Header - uses personalInfo now */}
      <div className="text-center pb-3 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800 mb-1">
          {resume.personalInfo?.fullName || "Your Name"}
        </h1>
        <div className="flex items-center justify-center gap-3 text-[10px] text-slate-600 flex-wrap">
          {resume.personalInfo?.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-2.5 h-2.5 text-blue-600" />
              {resume.personalInfo.email}
            </div>
          )}
          {resume.contact?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-2.5 h-2.5 text-blue-600" />
              {resume.contact.phone}
            </div>
          )}
          {(resume.personalInfo?.location || resume.contact?.location) && (
            <div className="flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-blue-600" />
              {resume.personalInfo?.location || resume.contact?.location}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <SectionWrapper id="summary">
          <section>
            <h2 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed">{resume.summary}</p>
          </section>
        </SectionWrapper>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <SectionWrapper id="skills">
          <section>
            <h2 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 rounded text-[10px] font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </SectionWrapper>
      )}

      {/* Work Experience */}
      {resume.workExperience && resume.workExperience.length > 0 && (
        <SectionWrapper id="workExperience">
          <section>
            <h2 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              Work Experience
            </h2>
            <div className="space-y-3">
              {resume.workExperience.map((work, i) => (
                <div key={i} className="relative pl-3 border-l border-blue-200">
                  <div className="absolute -left-[3px] top-0.5 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-800">
                        {work.position}
                      </h3>
                      <p className="text-blue-600 font-medium text-[10px]">
                        {work.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-full whitespace-nowrap ml-2">
                      <Calendar className="w-2 h-2" />
                      {work.startDate} — {work.endDate || "Present"}
                    </div>
                  </div>
                  <ul className="space-y-0.5 mt-1">
                    {work.highlights?.map((highlight, j) => (
                      <li
                        key={j}
                        className="text-slate-700 flex gap-1.5 leading-tight"
                      >
                        <span className="text-blue-600 text-[10px] mt-0.5">
                          •
                        </span>
                        <span className="text-[10px]">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <SectionWrapper id="education">
          <section>
            <h2 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              Education
            </h2>
            <div className="space-y-2">
              {resume.education.map((edu, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-lg p-2 border border-slate-200"
                >
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-100 p-1 rounded">
                      <GraduationCap className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-[10px]">
                        {edu.degree}
                      </h3>
                      <p className="text-slate-600 text-[9px]">
                        {edu.institution}
                      </p>
                      {(edu.startYear || edu.endYear) && (
                        <p className="text-[9px] text-slate-500 mt-0.5">
                          {edu.startYear} - {edu.endYear}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>
      )}

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <SectionWrapper id="projects">
          <section>
            <h2 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              Projects
            </h2>
            <div className="space-y-2">
              {resume.projects.map((p, i) => (
                <div
                  key={i}
                  className="p-2 border border-slate-100 rounded bg-white"
                >
                  <h3 className="font-semibold text-[10px] text-slate-800">
                    {p.name}
                  </h3>
                  <p className="text-[9px] text-slate-600 mt-0.5">
                    {p.description}
                  </p>
                  {p.link && (
                    <a
                      className="text-[9px] text-blue-600 mt-1 inline-block"
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.link}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <SectionWrapper id="certifications">
          <section>
            <h2 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              Certifications
            </h2>
            <div className="space-y-1">
              {resume.certifications.map((c, i) => (
                <div key={i} className="text-[10px] text-slate-700">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-[9px] text-slate-500">
                    {c.issuer}
                    {c.year ? ` • ${c.year}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>
      )}

      {/* Additional */}
      {resume.additional && (
        <SectionWrapper id="additional">
          <section>
            <h2 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
              <div className="w-0.5 h-4 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
              Additional
            </h2>
            <p className="text-slate-700 text-[10px]">{resume.additional}</p>
          </section>
        </SectionWrapper>
      )}
    </div>
  );
}

// Section Box Component (left) - shows full data for the section and supports enhancement
function SectionBox({ title, icon, sectionKey, value, isRemoved, onEnhance }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Render full value of section (not a summary)
  const renderValue = () => {
    if (!value || isRemoved) {
      return (
        <div className="text-[10px] text-slate-400">
          {/* &lt;section removed&gt; */}
          Not available!
        </div>
      );
    }

    // Different rendering by sectionKey
    if (sectionKey === "personalInfo") {
      return (
        <div className="text-[11px] text-slate-700 space-y-0.5">
          <div>
            <strong className="text-[10px] text-slate-600">Name:</strong>{" "}
            {value.fullName || "-"}
          </div>
          <div>
            <strong className="text-[10px] text-slate-600">Email:</strong>{" "}
            {value.email || "-"}
          </div>
          <div>
            <strong className="text-[10px] text-slate-600">Location:</strong>{" "}
            {value.location || "-"}
          </div>
        </div>
      );
    }

    if (sectionKey === "skills") {
      return (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(value) && value.length > 0 ? (
            value.map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-slate-50 text-[10px] rounded border border-slate-200"
              >
                {s}
              </span>
            ))
          ) : (
            <div className="text-[10px] text-slate-400">&lt;no skills&gt;</div>
          )}
        </div>
      );
    }

    if (sectionKey === "workExperience") {
      return (
        <div className="space-y-2">
          {Array.isArray(value) && value.length > 0 ? (
            value.map((w, i) => (
              <div
                key={i}
                className="text-[10px] border border-slate-100 rounded p-2 bg-white"
              >
                <div className="font-medium text-[11px]">
                  {w.position || "-"}
                </div>
                <div className="text-[9px] text-slate-500">
                  {w.company || ""} • {w.startDate || ""} -{" "}
                  {w.endDate || "Present"}
                </div>
                <ul className="mt-1 text-[10px] list-disc pl-4">
                  {(w.highlights || []).map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-[10px] text-slate-400">
              &lt;no work experience&gt;
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === "education") {
      return (
        <div className="space-y-2">
          {Array.isArray(value) && value.length > 0 ? (
            value.map((e, i) => (
              <div
                key={i}
                className="text-[10px] border border-slate-100 rounded p-2 bg-white"
              >
                <div className="font-medium text-[11px]">{e.degree || "-"}</div>
                <div className="text-[9px] text-slate-500">
                  {e.institution || ""}
                </div>
                <div className="text-[9px] text-slate-500">
                  {e.startYear || ""} - {e.endYear || ""}
                </div>
              </div>
            ))
          ) : (
            <div className="text-[10px] text-slate-400">
              &lt;no education&gt;
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === "projects") {
      return (
        <div className="space-y-2">
          {Array.isArray(value) && value.length > 0 ? (
            value.map((p, i) => (
              <div
                key={i}
                className="text-[10px] border border-slate-100 rounded p-2 bg-white"
              >
                <div className="font-medium text-[11px]">{p.name || "-"}</div>
                <div className="text-[9px] text-slate-500">
                  {p.description || ""}
                </div>
                {p.link && (
                  <div className="text-[9px] text-blue-600">{p.link}</div>
                )}
              </div>
            ))
          ) : (
            <div className="text-[10px] text-slate-400">
              &lt;no projects&gt;
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === "certifications") {
      return (
        <div className="space-y-1">
          {Array.isArray(value) && value.length > 0 ? (
            value.map((c, i) => (
              <div key={i} className="text-[10px]">
                <div className="font-medium text-[11px]">{c.name}</div>
                <div className="text-[9px] text-slate-500">
                  {c.issuer}
                  {c.year ? ` • ${c.year}` : ""}
                </div>
              </div>
            ))
          ) : (
            <div className="text-[10px] text-slate-400">
              &lt;no certifications&gt;
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === "contact") {
      return (
        <div className="text-[11px] text-slate-700">
          <div>
            <strong className="text-[10px] text-slate-600">Email:</strong>{" "}
            {value?.email || "-"}
          </div>
          <div>
            <strong className="text-[10px] text-slate-600">Phone:</strong>{" "}
            {value?.phone || "-"}
          </div>
          <div>
            <strong className="text-[10px] text-slate-600">Location:</strong>{" "}
            {value?.location || "-"}
          </div>
        </div>
      );
    }

    if (sectionKey === "additional") {
      return <div className="text-[10px] text-slate-700">{value || "-"}</div>;
    }

    // fallback: JSON dump
    return (
      <pre className="text-[10px] whitespace-pre-wrap">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  };

  const submit = async () => {
    if (!input || !input.trim()) return;
    onEnhance(input, setLoading);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-2.5 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-1.5 justify-between">
          <div className="flex items-center gap-1.5">
            <div className="text-blue-600">{icon}</div>
            <span className="font-medium text-slate-700 text-xs">{title}</span>
          </div>
        </div>
      </div>

      <div className="p-2.5 space-y-2">
        <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded max-h-32 overflow-auto leading-tight">
          {renderValue()}
        </div>

        <div className="flex gap-1.5">
          <input
            placeholder={`Enhance ${title.toLowerCase()}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={submit}
            disabled={loading || !input.trim()}
            className="px-2.5 py-1.5 bg-blue-600 text-white rounded text-[10px] font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Wand2 className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
