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
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Upload,
  FileText,
  Award,
  Link as LinkIcon,
  User,
  MessageSquare,
  Heart,
  Trash2,
  Save,
} from "lucide-react";
import axios from "@/utils/axios";

// Section configuration
const SECTION_CONFIG = [
  {
    key: "personalDetails",
    title: "Personal Details",
    icon: <User className="w-4 h-4" />,
  },
  {
    key: "socialLinks",
    title: "Social Links",
    icon: <LinkIcon className="w-4 h-4" />,
  },
  {
    key: "professionalSummary",
    title: "Professional Summary",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    key: "workExperience",
    title: "Work Experience",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    key: "skills",
    title: "Skills and Languages",
    icon: <Code className="w-4 h-4" />,
  },
  {
    key: "projects",
    title: "Projects",
    icon: <Code className="w-4 h-4" />,
  },
  {
    key: "education",
    title: "Education",
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    key: "certifications",
    title: "Certifications",
    icon: <Award className="w-4 h-4" />,
  },
  {
    key: "hobbies",
    title: "Hobbies",
    icon: <Heart className="w-4 h-4" />,
  },
];

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

export default function ResumeBuilder({
  promptInput,
  setPromptInput,
  resumeInput,
  setResumeInput,
  setShowResumeBuilder,
  resetAll,
}) {
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState("choice");
  const [prompt, setPrompt] = useState(promptInput);
  const [uploadedFile, setUploadedFile] = useState(resumeInput);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState();
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [expandedSubItems, setExpandedSubItems] = useState({});

  const leftRefs = useRef({});
  const leftContainerRef = useRef(null);
  const leftSubItemRefs = useRef({}); // NEW: For sub-items
  const fileInputRef = useRef();

  // Open modal on mount if no resume
  useEffect(() => {
    if (!resume) {
      setShowModal(true);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const uploadAndGenerate = async () => {
    if (!uploadedFile) return;

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", uploadedFile);
      formData.append(
        "prompt",
        "Analyze this resume file and create an enhanced, professional version. Extract all information accurately and improve the presentation while maintaining truthfulness."
      );
      formData.append("model", "gemini-1.5-pro"); // or dynamic

      const res = await axios.post("/student/resume/generate", formData, {
        withCredentials: true,
        // ❌ do NOT set Content-Type
      });

      const data = res.data;

      if (!data.success) {
        throw new Error(data.message || "Resume generation failed");
      }

      setResume(data.resume);
      setShowModal(false);
      setModalStep("choice");
      setUploadedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Resume error:", err);
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to generate resume"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateFromPrompt = async () => {
    console.log(prompt);
    if (!prompt.trim()) return;

    console.log("reached api call");

    setError(null);
    setLoading(true);

    try {
      const dataPay = {
        prompt: prompt.trim(),
      };
      const res = await axios.post(`/student/resume/generate`, dataPay, {
        withCredentials: true,
      });

      console.log("response", res);

      setResume(res.data.resume);
      setShowModal(false);
      setModalStep("choice");
      setPrompt("");
    } catch (err) {
      console.error("Generation error:", err);
      setError(err?.message || "Failed to generate resume");
    } finally {
      setLoading(false);
    }
  };

  const enhanceSection = async (sectionKey, itemIndex, enhancementPrompt) => {
    if (!resume) return;

    try {
      const res = await axios.post(
        `/student/resume/enhance-section`,
        {
          resume,
          sectionKey,
          prompt: enhancementPrompt || "Improve clarity and impact",
          itemIndex,
        },
        {
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        throw new Error(`Enhancement failed: ${res.statusText}`);
      }

      const data = await res.data;

      setResume(data.resume);
    } catch (err) {
      console.error("Enhancement error:", err);
      alert("Enhancement failed: " + (err?.message || "Unknown error"));
    }
  };

  const updateResume = (newResumeData) => {
    setResume(newResumeData);
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

      // Header - Name
      const headerName = resume.personalDetails
        ? `${resume.personalDetails.firstName || ""} ${
            resume.personalDetails.lastName || ""
          }`.trim()
        : "Your Name";
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 64, 175);
      doc.text(headerName, pageWidth / 2, yPos, { align: "center" });
      yPos += 10;

      // Job Title
      if (resume.personalDetails?.jobTitle) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(resume.personalDetails.jobTitle, pageWidth / 2, yPos, {
          align: "center",
        });
        yPos += 8;
      }

      // Contact Info
      const contactParts = [
        resume.personalDetails?.email,
        resume.personalDetails?.phone,
        [
          resume.personalDetails?.city,
          resume.personalDetails?.state,
          resume.personalDetails?.country,
        ]
          .filter(Boolean)
          .join(", "),
      ].filter(Boolean);

      if (contactParts.length > 0) {
        doc.setFontSize(9);
        doc.text(contactParts.join(" • "), pageWidth / 2, yPos, {
          align: "center",
        });
        yPos += 8;
      }

      // Social Links
      if (resume.socialLinks && resume.socialLinks.length > 0) {
        const socialText = resume.socialLinks
          .map((s) => s.label || s.platform)
          .join(" • ");
        doc.setFontSize(8);
        doc.setTextColor(30, 64, 175);
        doc.text(socialText, pageWidth / 2, yPos, { align: "center" });
        yPos += 8;
      }

      // Divider
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      // Professional Summary
      if (resume.professionalSummary) {
        checkPageBreak();
        addText("PROFESSIONAL SUMMARY", 11, true, [30, 64, 175]);
        addText(resume.professionalSummary, 9);
        addSpace();
      }

      // Skills
      if (resume.skills && resume.skills.length > 0) {
        checkPageBreak();
        addText("SKILLS", 11, true, [30, 64, 175]);
        addText(resume.skills.join(" • "), 9);
        addSpace();
      }

      // Work Experience
      if (resume.workExperience && resume.workExperience.length > 0) {
        checkPageBreak(40);
        addText("WORK EXPERIENCE", 11, true, [30, 64, 175]);

        resume.workExperience.forEach((work, index) => {
          checkPageBreak(30);

          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
          doc.text(work.position || "", margin, yPos);
          yPos += 5;

          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(30, 64, 175);
          doc.text(work.company || "", margin, yPos);

          doc.setTextColor(100, 100, 100);
          const dateText = `${work.startDate || ""} - ${
            work.endDate || "Present"
          }`;
          doc.text(dateText, pageWidth - margin, yPos, { align: "right" });
          yPos += 6;

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

      // Projects
      if (resume.projects && resume.projects.length > 0) {
        checkPageBreak(30);
        addText("PROJECTS", 11, true, [30, 64, 175]);

        resume.projects.forEach((project, index) => {
          checkPageBreak(20);

          doc.setFontSize(10);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
          doc.text(project.name || "", margin, yPos);
          yPos += 5;

          if (project.description) {
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            const lines = doc.splitTextToSize(
              project.description,
              contentWidth
            );
            doc.text(lines, margin, yPos);
            yPos += lines.length * 9 * 0.4 + 2;
          }

          if (project.technologies && project.technologies.length > 0) {
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(
              "Technologies: " + project.technologies.join(", "),
              margin,
              yPos
            );
            yPos += 4;
          }

          if (index < resume.projects.length - 1) {
            addSpace(3);
          }
        });
        addSpace();
      }

      // Education
      if (resume.education && resume.education.length > 0) {
        checkPageBreak(30);
        addText("EDUCATION", 11, true, [30, 64, 175]);

        resume.education.forEach((edu, index) => {
          checkPageBreak(15);

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
            const yearText = `${edu.startYear || ""} - ${edu.endYear || ""}`;
            doc.text(yearText, pageWidth - margin, yPos, { align: "right" });
          }
          yPos += 5;

          if (edu.field) {
            doc.setTextColor(0, 0, 0);
            doc.text(`Field: ${edu.field}`, margin, yPos);
            yPos += 4;
          }

          if (index < resume.education.length - 1) {
            addSpace(2);
          }
        });
        addSpace();
      }

      // Certifications
      if (resume.certifications && resume.certifications.length > 0) {
        checkPageBreak(20);
        addText("CERTIFICATIONS", 11, true, [30, 64, 175]);

        resume.certifications.forEach((cert, index) => {
          checkPageBreak(10);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          const certText = `${cert.name} - ${cert.issuer}${
            cert.year ? ` (${cert.year})` : ""
          }`;
          doc.text(`• ${certText}`, margin, yPos);
          yPos += 5;
        });
        addSpace();
      }

      // Hobbies
      if (resume.hobbies && resume.hobbies.length > 0) {
        checkPageBreak();
        addText("HOBBIES & INTERESTS", 11, true, [30, 64, 175]);
        addText(resume.hobbies.join(" • "), 9);
      }

      doc.save("resume.pdf");
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to export PDF");
    }
  };

  const createResume = () => {
    if (promptInput !== "") {
      generateFromPrompt();
    } else if (resumeInput) {
      uploadAndGenerate();
    }
  };

  useEffect(() => {
    createResume();
    return () => {};
  }, []);

  // final working code is below
  // const scrollLeftTo = (sectionKey) => {
  //   const container = leftContainerRef.current;
  //   const el = leftRefs.current[sectionKey];
  // Updated scroll function to handle both sections and sub-items
  //   if (!container || !el) return;
  //   // Use requestAnimationFrame to wait for layout update
  //   requestAnimationFrame(() => {
  //     const containerTop = container.getBoundingClientRect().top;
  //     const elementTop = el.getBoundingClientRect().top;
  //     const scrollOffset = elementTop - containerTop + container.scrollTop;
  //     container.scrollTo({
  //       top: scrollOffset,
  //       behavior: "smooth",
  //     });
  //   });
  // };
  // const onPreviewSectionClick = (sectionKey) => {
  //   setActiveSection(sectionKey);
  //   scrollLeftTo(sectionKey);
  // };

  const scrollLeftTo = (sectionKey, subItemIndex = null) => {
    const container = leftContainerRef.current;

    // If subItemIndex is provided, scroll to that specific sub-item
    const targetRef =
      subItemIndex !== null
        ? leftSubItemRefs.current[`${sectionKey}-${subItemIndex}`]
        : leftRefs.current[sectionKey];

    if (!container || !targetRef) return;

    requestAnimationFrame(() => {
      const containerTop = container.getBoundingClientRect().top;
      const elementTop = targetRef.getBoundingClientRect().top;
      const scrollOffset = elementTop - containerTop + container.scrollTop;

      container.scrollTo({
        top: scrollOffset,
        behavior: "smooth",
      });
    });
  };

  // Updated click handler
  const onPreviewSectionClick = (sectionKey, subItemIndex = null) => {
    setActiveSection(sectionKey);
    // If clicking on a sub-item, expand only that sub-item
    if (subItemIndex !== null) {
      setExpandedSubItems({
        ...expandedSubItems,
        [`${sectionKey}-${subItemIndex}`]: true,
      });
    }
    setTimeout(() => {
      scrollLeftTo(sectionKey, subItemIndex);
    }, 0);
  };

  return (
    <div className="h-[calc(100vh-60.8px)] flex flex-col overflow-hidden">
      {/* Main Content */}
      {loading ? (
        <LoadingState />
      ) : error ? (
        <div className="flex flex-col gap-5 items-center justify-center h-full w-full">
          <p className="text-g-200 font-medium text-sm">
            Our AI Model is not responding. Please try again later.
          </p>
          {error && (
            <p className="text-red-500 font-medium text-sm">Error - {error}</p>
          )}
          <button
            className={`flex gap-2 items-center text-white px-6 py-3 bg-primary rounded-lg ${
              !(resume || prompt)
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:bg-primary/90 transition-colors opacity-100"
            }`}
            onClick={createResume}
            disabled={!(resume || prompt)}
          >
            <Sparkles size={20} />
            <span>Try Again</span>
          </button>
          <button
            onClick={() => setShowResumeBuilder(false)}
            className={`flex gap-2 items-center text-white px-4 py-2 bg-primary text-sm rounded-lg cursor-pointer hover:bg-primary/90 transition-colors opacity-100`}
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex bg-g-700">
          {/* Left Sidebar - Form Editor */}
          <div className="w-[40%] flex flex-col">
            <div className="w-full flex items-center gap-5 p-5 pb-0 mb-5">
              {resume && (
                <>
                  <button
                    onClick={exportToPDF}
                    className={`flex gap-2 items-center text-white px-4 py-2 bg-primary text-sm rounded-lg ${
                      !(resume || prompt)
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer hover:bg-primary/90 transition-colors opacity-100"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Download as PDF
                  </button>
                  <button
                    onClick={() => setShowResumeBuilder(false)}
                    className={`flex gap-2 items-center text-white px-4 py-2 bg-primary text-sm rounded-lg cursor-pointer hover:bg-primary/90 transition-colors opacity-100`}
                  >
                    Go Back
                  </button>
                </>
              )}
            </div>
            <div
              className="w-full flex h-full flex-col flex-1 gap-3 p-5 pr-0 pt-0 overflow-y-scroll text-g-200"
              ref={leftContainerRef}
            >
              {SECTION_CONFIG.map((section) => (
                <SectionEditor
                  key={section.key}
                  ref={(el) => (leftRefs.current[section.key] = el)}
                  section={section}
                  resume={resume}
                  isActive={activeSection === section.key}
                  onClick={() =>
                    setActiveSection(
                      activeSection === section.key ? null : section.key
                    )
                  }
                  onUpdate={updateResume}
                  onEnhance={enhanceSection}
                  leftSubItemRefs={leftSubItemRefs}
                  expandedSubItems={expandedSubItems} // ADD THIS
                  setExpandedSubItems={setExpandedSubItems} // ADD THIS
                />
              ))}
            </div>
          </div>

          {/* Right Side - Resume Preview */}
          <div className="w-[60%] p-5 h-full overflow-y-scroll">
            <ResumePreview
              resume={resume}
              onSectionClick={onPreviewSectionClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Section Editor Component with Forms
function SectionEditor({
  section,
  resume,
  isActive,
  onClick,
  onUpdate,
  onEnhance,
  ref,
  leftSubItemRefs,
  expandedSubItems, // ADD THIS
  setExpandedSubItems, // ADD THIS
}) {
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!enhancePrompt.trim()) return;

    setIsEnhancing(true);
    try {
      await onEnhance(section.key, enhancePrompt);
      setEnhancePrompt("");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden bg-g-500 shrink-0" ref={ref}>
      <button
        onClick={onClick}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-g-400 transition-colors text-g-200 font-semibold border-b border-g-600"
      >
        <span className="leading-6">{section.title}</span>

        {isActive ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isActive && (
        <div className="p-4">
          <div>
            <SectionForm
              sectionKey={section.key}
              data={resume[section.key]}
              onUpdate={(newData) => {
                const updatedResume = { ...resume, [section.key]: newData };
                onUpdate(updatedResume);
              }}
              leftSubItemRefs={leftSubItemRefs}
              expandedSubItems={expandedSubItems} // ADD THIS
              setExpandedSubItems={setExpandedSubItems} // ADD THIS
            />
          </div>

          {section.key === "professionalSummary" && (
            <div className="flex items-center gap-4 mt-4">
              <input
                type="text"
                value={enhancePrompt}
                onChange={(e) => setEnhancePrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEnhance()}
                placeholder="Give prompt"
                className="flex-1 px-4 py-3 text-sm leading-5 outline-none bg-g-700 text-g-200 rounded-lg "
              />
              <button
                onClick={handleEnhance}
                disabled={!enhancePrompt.trim() || isEnhancing}
                className="px-4 py-3 text-sm leading-5 outline-none bg-primary rounded-lg hover:bg-primary/75 transition-colors disabled:opacity-75  text-white disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {isEnhancing ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Sparkles size={20} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Section Form Component
function SectionForm({
  sectionKey,
  data,
  onUpdate,
  leftSubItemRefs,
  expandedSubItems, // ADD THIS
  setExpandedSubItems, // ADD THIS
}) {
  const inputClass =
    "w-full px-4 py-3 text-sm text-g-200 leading-5 hide-scrollbar bg-g-700 rounded-lg outline-none";
  const labelClass = "block text-xs font-medium text-g-200 leading-4 mb-1";

  // Personal Details Form
  if (sectionKey === "personalDetails") {
    const handleChange = (field, value) => {
      onUpdate({ ...data, [field]: value });
    };

    return (
      <div className="space-y-3">
        <h3 className="text-sm leading-5 font-medium text-dark-blue">
          Basic Information
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>First Name</label>
            <input
              type="text"
              value={data?.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={inputClass}
              placeholder="John"
            />
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input
              type="text"
              value={data?.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={inputClass}
              placeholder="Doe"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Job Title</label>
          <input
            type="text"
            value={data?.jobTitle || ""}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            className={inputClass}
            placeholder="Full Stack Developer"
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={data?.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className={inputClass}
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            value={data?.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={inputClass}
            placeholder="+91 0123456789"
          />
        </div>
        <h3 className="text-sm leading-5 font-medium text-dark-blue">
          Address
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={data?.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              className={inputClass}
              placeholder="Pune"
            />
          </div>
          <div>
            <label className={labelClass}>State</label>
            <input
              type="text"
              value={data?.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
              className={inputClass}
              placeholder="Maharashtra"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Country</label>
            <input
              type="text"
              value={data?.country || ""}
              onChange={(e) => handleChange("country", e.target.value)}
              className={inputClass}
              placeholder="India"
            />
          </div>
          <div>
            <label className={labelClass}>Zip Code</label>
            <input
              type="text"
              value={data?.zipCode || ""}
              onChange={(e) => handleChange("zipCode", e.target.value)}
              className={inputClass}
              placeholder="411045"
            />
          </div>
        </div>
      </div>
    );
  }

  // Social Links Form
  if (sectionKey === "socialLinks") {
    const links = Array.isArray(data) ? data : [];
    const [addNewLink, setAddNewLink] = useState(false);
    const [addNewLinkData, setAddNewLinkData] = useState({
      url: "",
      label: "",
    });

    const removeLink = (index) => {
      onUpdate(links.filter((_, i) => i !== index));
    };

    const updateLink = (index, field, value) => {
      const newLinks = [...links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      onUpdate(newLinks);
    };

    return (
      <div className="space-y-3">
        {links.map((link, index) => (
          <div className="w-full" key={index}>
            <label className={labelClass}>{link.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={link.url || ""}
                onChange={(e) => updateLink(index, "url", e.target.value)}
                className={inputClass}
                placeholder="https://linkedin.com/in/iamgauravkha"
              />
              <button
                onClick={() => removeLink(index)}
                className="p-1 cursor-pointer rounded text-g-200 hover:text-g-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {addNewLink && (
          <div className="w-full flex flex-col gap-3 p-4 border border-g-400 rounded-lg">
            <div>
              <label className={labelClass}>Label Name</label>
              <input
                type="text"
                value={addNewLinkData.label || ""}
                onChange={(e) =>
                  setAddNewLinkData({
                    ...addNewLinkData,
                    label: e.target.value,
                  })
                }
                className={inputClass}
                placeholder="LinkedIn"
              />
            </div>
            <div>
              <label className={labelClass}>URL</label>
              <input
                type="url"
                value={addNewLinkData.url || ""}
                onChange={(e) =>
                  setAddNewLinkData({
                    ...addNewLinkData,
                    url: e.target.value,
                  })
                }
                className={inputClass}
                placeholder="https://linkedin.com/in/johndoe"
              />
            </div>
            <div className="flex items-center justify-end gap-3 w-full">
              <button
                className="px-2 py-1 bg-dark-red text-white rounded-lg text-xs leading-4 cursor-pointer"
                onClick={() => {
                  setAddNewLinkData({ url: "", label: "" });
                  setAddNewLink(false);
                }}
              >
                Discard
              </button>
              <button
                className="px-2 py-1 bg-primary text-white rounded-lg text-xs leading-4 cursor-pointer"
                onClick={() => {
                  onUpdate([...links, addNewLinkData]);
                  setAddNewLinkData({ url: "", label: "" });
                  setAddNewLink(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setAddNewLink((prev) => !prev)}
          className="w-full p-2 border border-g-300 border-dashed flex  items-center cursor-pointer justify-center gap-1.5 text-xs leading-4 text-g-200 hover:text-g-100 hover:border-g-100"
        >
          <Plus size={16} />
          Add Link
        </button>
      </div>
    );
  }

  // Professional Summary Form
  if (sectionKey === "professionalSummary") {
    return (
      <div>
        <textarea
          value={data || ""}
          onChange={(e) => onUpdate(e.target.value)}
          className={`${inputClass} min-h-[120px] resize-none`}
          placeholder="Write a compelling professional summary..."
        />
      </div>
    );
  }

  // Work Experience Form
  if (sectionKey === "workExperience") {
    const [enhancePrompt, setEnhancePrompt] = useState("");
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleEnhance = async () => {
      if (!enhancePrompt.trim()) return;

      setIsEnhancing(true);
      try {
        await onEnhance(section.key, enhancePrompt);
        setEnhancePrompt("");
      } finally {
        setIsEnhancing(false);
      }
    };
    const experiences = Array.isArray(data) ? data : [];

    const addExperience = () => {
      onUpdate([
        ...experiences,
        {
          company: "Your company name",
          position: "Your Job Title",
          startDate: "01/2025",
          endDate: "",
          highlights: ["Achievement or responsibility..."],
        },
      ]);
      setExpandedSubItems({
        ...expandedSubItems,
        [`workExperience-${experiences.length}`]: true,
      });
    };

    const removeExperience = (index) => {
      onUpdate(experiences.filter((_, i) => i !== index));
    };

    const updateExperience = (index, field, value) => {
      const newExp = [...experiences];
      newExp[index] = { ...newExp[index], [field]: value };
      onUpdate(newExp);
    };

    const addHighlight = (expIndex) => {
      const newExp = [...experiences];
      newExp[expIndex].highlights = [...newExp[expIndex].highlights, ""];
      onUpdate(newExp);
    };

    const removeHighlight = (expIndex, hlIndex) => {
      const newExp = [...experiences];
      newExp[expIndex].highlights = newExp[expIndex].highlights.filter(
        (_, i) => i !== hlIndex
      );
      onUpdate(newExp);
    };

    const updateHighlight = (expIndex, hlIndex, value) => {
      const newExp = [...experiences];
      newExp[expIndex].highlights[hlIndex] = value;
      onUpdate(newExp);
    };

    return (
      <div className="space-y-3">
        {experiences.map((exp, expIndex) => {
          const isExpanded = expandedSubItems[`workExperience-${expIndex}`];

          return (
            <div
              key={expIndex}
              className="border rounded-lg border-g-400 overflow-hidden"
              ref={(el) =>
                (leftSubItemRefs.current[`workExperience-${expIndex}`] = el)
              }
            >
              <div className="flex justify-between items-center ">
                <button
                  onClick={() =>
                    setExpandedSubItems({
                      ...expandedSubItems,
                      [`workExperience-${expIndex}`]: !isExpanded,
                    })
                  }
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-g-400 transition-colors text-g-200 font-semibold"
                >
                  <div className="leading-6 flex items-center text-sm gap-2.5">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExperience(expIndex);
                      }}
                      className="p-1 cursor-pointer rounded text-g-200 hover:text-g-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </div>
                    {exp.position && `${exp.position}`}
                  </div>

                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
              {isExpanded && (
                <div className="w-full px-4 py-3 space-y-3">
                  <div>
                    <label className={labelClass}>Company</label>
                    <input
                      type="text"
                      value={exp.company || ""}
                      onChange={(e) =>
                        updateExperience(expIndex, "company", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Job Title</label>
                    <input
                      type="text"
                      value={exp.position || ""}
                      onChange={(e) =>
                        updateExperience(expIndex, "position", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Job Title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate || ""}
                        onChange={(e) =>
                          updateExperience(
                            expIndex,
                            "startDate",
                            e.target.value
                          )
                        }
                        className={inputClass}
                        placeholder="2020-01"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>End Date</label>
                      <input
                        type="text"
                        value={exp.endDate || ""}
                        onChange={(e) =>
                          updateExperience(expIndex, "endDate", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Present or 2021-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Details</label>
                    <div className="space-y-2">
                      {exp.highlights &&
                        exp.highlights.map((highlight, hlIndex) => (
                          <div key={hlIndex} className="flex gap-2">
                            <textarea
                              value={highlight}
                              onChange={(e) =>
                                updateHighlight(
                                  expIndex,
                                  hlIndex,
                                  e.target.value
                                )
                              }
                              className={`${inputClass} min-h-[80px] resize-none`}
                              placeholder="Achievement or responsibility..."
                            />
                            <button
                              onClick={() => removeHighlight(expIndex, hlIndex)}
                              className="p-1 cursor-pointer rounded text-g-200 hover:text-g-100"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      <button
                        onClick={() => addHighlight(expIndex)}
                        className="w-full p-2 border border-g-300 border-dashed flex  items-center cursor-pointer justify-center gap-1.5 text-xs leading-4 text-g-200 hover:text-g-100 hover:border-g-100"
                      >
                        + Add Detail
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <input
                      type="text"
                      value={enhancePrompt}
                      onChange={(e) => setEnhancePrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEnhance()}
                      placeholder="Give prompt"
                      className="flex-1 px-4 py-3 text-sm leading-5 outline-none bg-g-700 text-g-300 rounded-lg "
                    />
                    <button
                      onClick={handleEnhance}
                      disabled={!enhancePrompt.trim() || isEnhancing}
                      className="px-4 py-3 text-sm leading-5 outline-none bg-primary rounded-lg hover:bg-primary/75 transition-colors disabled:opacity-75  text-white disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                      {isEnhancing ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <Sparkles size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <button
          onClick={addExperience}
          className="w-full p-2 border border-g-300 border-dashed flex  items-center cursor-pointer justify-center gap-1.5 text-xs leading-4 text-g-200 hover:text-g-100 hover:border-g-100"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>
    );
  }

  // Skills Form
  if (sectionKey === "skills") {
    const skills = Array.isArray(data) ? data : [];

    const addSkill = () => {
      onUpdate([...skills, ""]);
    };

    const removeSkill = (index) => {
      onUpdate(skills.filter((_, i) => i !== index));
    };

    const updateSkill = (index, value) => {
      const newSkills = [...skills];
      newSkills[index] = value;
      onUpdate(newSkills);
    };

    return (
      <div className="space-y-3 grid grid-cols-2 gap-x-2">
        {skills.map((skill, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateSkill(index, e.target.value)}
              className={inputClass}
              placeholder="Skill name"
            />
            <button
              onClick={() => removeSkill(index)}
              className="p-1 cursor-pointer rounded text-g-200 hover:text-g-100"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={addSkill}
          className="w-full p-2 border border-g-300 border-dashed flex  items-center cursor-pointer justify-center gap-1.5 text-xs leading-4 text-g-200 hover:text-g-100 hover:border-g-100 col-span-2"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>
    );
  }

  // Projects Form
  if (sectionKey === "projects") {
    const [enhancePrompt, setEnhancePrompt] = useState("");
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleEnhance = async () => {
      if (!enhancePrompt.trim()) return;

      setIsEnhancing(true);
      try {
        await onEnhance(section.key, enhancePrompt);
        setEnhancePrompt("");
      } finally {
        setIsEnhancing(false);
      }
    };
    const projects = Array.isArray(data) ? data : [];

    const addProject = () => {
      onUpdate([
        ...projects,
        {
          name: "",
          highlights: [""],
          link: "",
          startDate: "",
          endDate: "",
        },
      ]);
      setExpandedSubItems({
        ...expandedSubItems,
        [`projects-${projects.length}`]: true,
      });
    };

    const removeProject = (index) => {
      onUpdate(projects.filter((_, i) => i !== index));
    };

    const updateProject = (index, field, value) => {
      const newProjects = [...projects];
      newProjects[index] = { ...newProjects[index], [field]: value };
      onUpdate(newProjects);
    };

    const addHighlight = (expIndex) => {
      const newExp = [...projects];
      newExp[expIndex].highlights = [...newExp[expIndex].highlights, ""];
      onUpdate(newExp);
    };

    const removeHighlight = (expIndex, hlIndex) => {
      const newExp = [...projects];
      newExp[expIndex].highlights = newExp[expIndex].highlights.filter(
        (_, i) => i !== hlIndex
      );
      onUpdate(newExp);
    };

    const updateHighlight = (expIndex, hlIndex, value) => {
      const newExp = [...projects];
      newExp[expIndex].highlights[hlIndex] = value;
      onUpdate(newExp);
    };

    return (
      <div className="space-y-3">
        {projects.map((project, expIndex) => {
          const isExpanded = expandedSubItems[`projects-${expIndex}`];

          return (
            <div
              key={expIndex}
              className={`border rounded-lg overflow-hidden ${
                isExpanded ? "border-g-400" : "border-g-400"
              }`}
              ref={(el) =>
                (leftSubItemRefs.current[`projects-${expIndex}`] = el)
              }
            >
              <div className="flex justify-between items-center ">
                <button
                  onClick={() =>
                    setExpandedSubItems({
                      ...expandedSubItems,
                      [`projects-${expIndex}`]: !isExpanded,
                    })
                  }
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-g-400 transition-colors text-g-200 font-semibold"
                >
                  <div className="leading-6 flex text-sm items-center gap-2.5">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProject(expIndex);
                      }}
                      className="p-1 cursor-pointer rounded text-g-200 hover:text-g-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </div>
                    {project.name
                      ? project.name.split(" ").slice(0, 3).join(" ") + "..."
                      : "Project " + `${expIndex + 1}`}
                  </div>

                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
              {isExpanded && (
                <div className="w-full px-4 py-3 space-y-3">
                  <div>
                    <label className={labelClass}>Project Title</label>
                    <input
                      type="text"
                      value={project.name || ""}
                      onChange={(e) =>
                        updateProject(expIndex, "name", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Project Name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Project URL</label>
                    <input
                      type="url"
                      value={project.link || ""}
                      onChange={(e) =>
                        updateProject(expIndex, "link", e.target.value)
                      }
                      className={inputClass}
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input
                        type="text"
                        value={project.startDate || ""}
                        onChange={(e) =>
                          updateProject(expIndex, "startDate", e.target.value)
                        }
                        className={inputClass}
                        placeholder="2023-01"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>End Date</label>
                      <input
                        type="text"
                        value={project.endDate || ""}
                        onChange={(e) =>
                          updateProject(expIndex, "endDate", e.target.value)
                        }
                        className={inputClass}
                        placeholder="2023-06"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Details</label>
                    <div className="space-y-2">
                      {project.highlights &&
                        project.highlights.map((highlight, hlIndex) => (
                          <div key={hlIndex} className="flex gap-2">
                            <textarea
                              value={highlight}
                              onChange={(e) =>
                                updateHighlight(
                                  expIndex,
                                  hlIndex,
                                  e.target.value
                                )
                              }
                              className={`${inputClass} min-h-[80px] resize-none`}
                              placeholder="Achievement or responsibility..."
                            />
                            <button
                              onClick={() => removeHighlight(expIndex, hlIndex)}
                              className="p-1 cursor-pointer rounded text-g-200 hover:text-g-100"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      <button
                        onClick={() => addHighlight(expIndex)}
                        className="w-full p-2 border border-g-300 border-dashed flex  items-center cursor-pointer justify-center gap-1.5 text-xs leading-4 text-g-200 hover:text-g-100 hover:border-g-100"
                      >
                        + Add Detail
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <input
                      type="text"
                      value={enhancePrompt}
                      onChange={(e) => setEnhancePrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEnhance()}
                      placeholder="Give prompt"
                      className="flex-1 px-4 py-3 text-sm leading-5 outline-none bg-g-700 text-g-300 rounded-lg "
                    />
                    <button
                      onClick={handleEnhance}
                      disabled={!enhancePrompt.trim() || isEnhancing}
                      className="px-4 py-3 text-sm leading-5 outline-none bg-primary rounded-lg hover:bg-primary/75 transition-colors disabled:opacity-75  text-white disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                      {isEnhancing ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <Sparkles size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={addProject}
          className="w-full p-2 border border-g-300 border-dashed flex  items-center cursor-pointer justify-center gap-1.5 text-xs leading-4 text-g-200 hover:text-g-100 hover:border-g-100"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>
    );
  }

  // Education Form
  if (sectionKey === "education") {
    const [enhancePrompt, setEnhancePrompt] = useState("");
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleEnhance = async () => {
      if (!enhancePrompt.trim()) return;

      setIsEnhancing(true);
      try {
        await onEnhance(section.key, enhancePrompt);
        setEnhancePrompt("");
      } finally {
        setIsEnhancing(false);
      }
    };
    const education = Array.isArray(data) ? data : [];

    const addEducation = () => {
      onUpdate([
        ...education,
        {
          institution: "",
          degree: "",
          field: "",
          startYear: null,
          endYear: null,
          highlights: [""],
        },
      ]);
      setExpandedSubItems({
        ...expandedSubItems,
        [`education-${education.length}`]: true,
      });
    };

    const removeEducation = (index) => {
      onUpdate(education.filter((_, i) => i !== index));
    };

    const updateEducation = (index, field, value) => {
      const newEdu = [...education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      onUpdate(newEdu);
    };

    const addHighlight = (expIndex) => {
      const newExp = [...education];
      newExp[expIndex].highlights = [...newExp[expIndex].highlights, ""];
      onUpdate(newExp);
    };

    const removeHighlight = (expIndex, hlIndex) => {
      const newExp = [...education];
      newExp[expIndex].highlights = newExp[expIndex].highlights.filter(
        (_, i) => i !== hlIndex
      );
      onUpdate(newExp);
    };

    const updateHighlight = (expIndex, hlIndex, value) => {
      const newExp = [...education];
      newExp[expIndex].highlights[hlIndex] = value;
      onUpdate(newExp);
    };

    return (
      <div className="space-y-3">
        {education.map((edu, expIndex) => {
          const isExpanded = expandedSubItems[`education-${expIndex}`];

          return (
            <div
              key={expIndex}
              className={`border rounded-lg overflow-hidden ${
                isExpanded ? "border-g-400" : "border-g-400"
              }`}
              ref={(el) =>
                (leftSubItemRefs.current[`education-${expIndex}`] = el)
              }
            >
              <div className="flex justify-between items-center ">
                <button
                  onClick={() =>
                    setExpandedSubItems({
                      ...expandedSubItems,
                      [`education-${expIndex}`]: !isExpanded,
                    })
                  }
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-g-400 transition-colors text-g-200 font-semibold"
                >
                  <div className="leading-6 flex text-sm items-center gap-2.5">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEducation(expIndex);
                      }}
                      className="p-1 cursor-pointer rounded text-g-200 hover:text-g-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </div>
                    {edu.degree ? edu.degree : "Education " + `${expIndex + 1}`}
                  </div>

                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
              {isExpanded && (
                <div className="w-full px-4 py-3 space-y-3">
                  <div>
                    <label className={labelClass}>Institution</label>
                    <input
                      type="text"
                      value={edu.institution || ""}
                      onChange={(e) =>
                        updateEducation(expIndex, "institution", e.target.value)
                      }
                      className={inputClass}
                      placeholder="University Name"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Degree</label>
                    <input
                      type="text"
                      value={edu.degree || ""}
                      onChange={(e) =>
                        updateEducation(index, "degree", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Bachelor's in Computer Science"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Field of Study</label>
                    <input
                      type="text"
                      value={edu.field || ""}
                      onChange={(e) =>
                        updateEducation(expIndex, "field", e.target.value)
                      }
                      className={inputClass}
                      placeholder="Computer Science"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Start Year</label>
                      <input
                        type="number"
                        value={edu.startYear || ""}
                        onChange={(e) =>
                          updateEducation(
                            expIndex,
                            "startYear",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className={inputClass}
                        placeholder="2015"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>End Year</label>
                      <input
                        type="number"
                        value={edu.endYear || ""}
                        onChange={(e) =>
                          updateEducation(
                            expIndex,
                            "endYear",
                            e.target.value ? parseInt(e.target.value) : null
                          )
                        }
                        className={inputClass}
                        placeholder="2019"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Details</label>
                    <div className="space-y-2">
                      {edu.highlights &&
                        edu.highlights.map((highlight, hlIndex) => (
                          <div key={hlIndex} className="flex gap-2">
                            <textarea
                              value={highlight}
                              onChange={(e) =>
                                updateHighlight(
                                  expIndex,
                                  hlIndex,
                                  e.target.value
                                )
                              }
                              className={`${inputClass} min-h-[80px] resize-none`}
                              placeholder="Achievement or responsibility..."
                            />
                            <button
                              onClick={() => removeHighlight(expIndex, hlIndex)}
                              className="p-1 cursor-pointer rounded text-g-200 hover:text-g-100"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      <button
                        onClick={() => addHighlight(expIndex)}
                        className="w-full p-2 border border-g-300 border-dashed flex  items-center cursor-pointer justify-center gap-1.5 text-xs leading-4 text-g-200 hover:text-g-100 hover:border-g-100"
                      >
                        + Add Detail
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <input
                      type="text"
                      value={enhancePrompt}
                      onChange={(e) => setEnhancePrompt(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEnhance()}
                      placeholder="Give prompt"
                      className="flex-1 px-4 py-3 text-sm leading-5 outline-none bg-g-700 text-g-300 rounded-lg "
                    />
                    <button
                      onClick={handleEnhance}
                      disabled={!enhancePrompt.trim() || isEnhancing}
                      className="px-4 py-3 text-sm leading-5 outline-none bg-primary rounded-lg hover:bg-primary/75 transition-colors disabled:opacity-75  text-white disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                      {isEnhancing ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <Sparkles size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={addEducation}
          className="w-full p-2 border border-g-300 border-dashed flex  items-center cursor-pointer justify-center gap-1.5 text-xs leading-4 text-g-200 hover:text-g-100 hover:border-g-100"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>
    );
  }

  // Certifications Form
  if (sectionKey === "certifications") {
    const certifications = Array.isArray(data) ? data : [];

    const addCertification = () => {
      onUpdate([
        ...certifications,
        {
          name: "",
          url: "",
        },
      ]);
      setExpandedSubItems({
        ...expandedSubItems,
        [`certifications-${certifications.length}`]: true,
      });
    };

    const removeCertification = (index) => {
      onUpdate(certifications.filter((_, i) => i !== index));
    };

    const updateCertification = (index, field, value) => {
      const newCerts = [...certifications];
      newCerts[index] = { ...newCerts[index], [field]: value };
      onUpdate(newCerts);
    };

    return (
      <div className="space-y-3">
        {certifications.map((cert, index) => {
          const isExpanded = expandedSubItems[`certifications-${index}`];

          return (
            <div
              key={index}
              className="border rounded-lg border-g-400 overflow-hidden"
              ref={(el) =>
                (leftSubItemRefs.current[`certifications-${index}`] = el)
              }
            >
              <div className="flex justify-between items-center ">
                <button
                  onClick={() =>
                    setExpandedSubItems({
                      ...expandedSubItems,
                      [`certifications-${index}`]: !isExpanded,
                    })
                  }
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-g-400 transition-colors text-g-200 font-semibold"
                >
                  <div className="leading-6 flex text-sm items-center gap-2.5">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCertification(index);
                      }}
                      className="p-1 cursor-pointer rounded text-g-200 hover:text-g-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </div>
                    {"Certificate " + `${index + 1}`}
                  </div>

                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>
              {isExpanded && (
                <div className="w-full px-4 py-3 space-y-3">
                  <div>
                    <label className={labelClass}>Certification Name</label>
                    <input
                      type="text"
                      value={cert.name || ""}
                      onChange={(e) =>
                        updateCertification(index, "name", e.target.value)
                      }
                      className={inputClass}
                      placeholder="AWS Certified Solutions Architect"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Certification URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={cert.url || ""}
                      onChange={(e) =>
                        updateCertification(index, "url", e.target.value)
                      }
                      className={inputClass}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={addCertification}
          className="w-full p-2 border border-g-300 border-dashed flex  items-center cursor-pointer justify-center gap-1.5 text-xs leading-4 text-g-200 hover:text-g-100 hover:border-g-100"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>
    );
  }

  // Hobbies Form
  if (sectionKey === "hobbies") {
    const hobbies = Array.isArray(data) ? data : [];

    const addHobby = () => {
      onUpdate([...hobbies, ""]);
    };

    const removeHobby = (index) => {
      onUpdate(hobbies.filter((_, i) => i !== index));
    };

    const updateHobby = (index, value) => {
      const newHobbies = [...hobbies];
      newHobbies[index] = value;
      onUpdate(newHobbies);
    };

    return (
      <div className="space-y-2">
        {hobbies.map((hobby, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={hobby}
              onChange={(e) => updateHobby(index, e.target.value)}
              className={inputClass}
              placeholder="Hobby or interest"
            />
            <button
              onClick={() => removeHobby(index)}
              className="p-1 cursor-pointer rounded text-g-200 hover:text-g-100"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={addHobby}
          className="w-full p-2 border border-g-300 border-dashed flex  items-center cursor-pointer justify-center gap-1.5 text-xs leading-4 text-g-200 hover:text-g-100 hover:border-g-100"
        >
          <Plus className="w-4 h-4" />
          Add Hobby
        </button>
      </div>
    );
  }

  return null;
}

// Resume Preview Component - Every element is clickable
function ResumePreview({ resume, onSectionClick }) {
  if (!resume)
    return (
      <div className="flex flex-col items-center gap-2 justify-center w-full h-full">
        <p className="text-g-200 font-medium text-xs">
          Your NextGen AI Curated Resume Preview.
        </p>
        <p className="text-g-200 font-medium text-xs">Not available!</p>
      </div>
    );

  const pd = resume.personalDetails;
  const fullName = pd
    ? `${pd.firstName || ""} ${pd.lastName || ""}`.trim()
    : "Your Name";
  const location = pd
    ? [pd.city, pd.state, pd.country, pd.zipCode].filter(Boolean).join(", ")
    : null;

  return (
    <div className="bg-white p-8">
      {/* Header Section - Clickable */}
      <div
        onClick={() => onSectionClick("personalDetails")}
        className="cursor-pointer hover:bg-light-blue flex flex-col items-center justify-center mb-1 transition-colors group"
      >
        <h1 className="text-3xl text-g-400 group-hover:text-primary font-semibold transition-colors mb-2 leading-8">
          {fullName}
        </h1>
        {pd?.jobTitle && (
          <p className="text-sm leading-5 text-g-300 font-medium group-hover:text-primary transition-colors">
            {pd.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-4 mt-1 text-xs leading-5 text-g-300">
          {location && (
            <div className="flex items-center gap-1.5 group-hover:text-primary transition-colors">
              <MapPin className="w-3 h-3" />
              <span>{location}</span>
            </div>
          )}
          {pd?.email && (
            <div className="flex items-center gap-1.5 group-hover:text-primary transition-colors">
              <Mail className="w-3 h-3" />
              <span>{pd.email}</span>
            </div>
          )}
          {pd?.phone && (
            <div className="flex items-center gap-1.5 group-hover:text-primary transition-colors">
              <Phone className="w-3 h-3" />
              <span>{pd.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Social Links - Clickable */}
      {resume.socialLinks && resume.socialLinks.length > 0 && (
        <div
          onClick={() => onSectionClick("socialLinks")}
          className="cursor-pointer hover:bg-light-blue mb-5 transition-colors group"
        >
          <div className="flex items-center justify-center flex-wrap gap-4">
            {resume.socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-blue-700 hover:underline leading-5"
                onClick={(e) => e.stopPropagation()}
              >
                {link.label || link.platform}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Professional Summary - Clickable */}
      {resume.professionalSummary && (
        <div className="mb-5">
          <h2 className="w-full text-sm font-semibold text-g-400 mb-3 border-b-2 border-g-400 pb-1.5 inline-block">
            SUMMARY
          </h2>
          <p
            className="text-sm leading-5 text-g-300 cursor-pointer hover:bg-light-blue transition-colors"
            onClick={() => onSectionClick("professionalSummary")}
          >
            {resume.professionalSummary}
          </p>
        </div>
      )}

      {/* Work Experience - Every item clickable */}
      {resume.workExperience && resume.workExperience.length > 0 && (
        <div onClick={() => onSectionClick("workExperience")} className="mb-5">
          <h2 className="w-full text-sm font-semibold text-g-400 mb-3 border-b-2 border-g-400 pb-1.5 inline-block">
            EXPERIENCE
          </h2>
          <div className="space-y-3">
            {resume.workExperience.map((exp, i) => (
              <div
                key={i}
                className="cursor-pointer hover:bg-light-blue transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  onSectionClick("workExperience", i); // Pass the index
                }}
              >
                <h3 className="font-semibold text-g-400 leading-5 text-sm mb-1">
                  {exp.position}
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-g-400 leading-5 text-sm">
                    {exp.company}
                  </p>
                  <span className="font-medium text-g-400 leading-5 text-sm">
                    {exp.startDate} — {exp.endDate || "Present"}
                  </span>
                </div>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc ps-7 text-g-300 text-sm">
                    {exp.highlights.map((highlight, j) => (
                      <li key={j} className="leading-5">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects - Every item clickable */}
      {resume.projects && resume.projects.length > 0 && (
        <div onClick={() => onSectionClick("projects")} className="mb-5">
          <h2 className="w-full text-sm font-semibold text-g-400 mb-3 border-b-2 border-g-400 pb-1.5 inline-block">
            PROJECTS
          </h2>
          <div className="space-y-4">
            {resume.projects.map((pro, i) => (
              <div
                key={i}
                className="cursor-pointer hover:bg-light-blue transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  onSectionClick("projects", i); // Pass the index
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-g-400 flex items-center gap-1.5 leading-5 text-sm">
                    {pro.name}
                    {pro.link && (
                      <a
                        className="text-xs leading-5 text-primary hover:underline"
                        href={pro.link}
                      >
                        (Live Link)
                      </a>
                    )}
                  </p>
                  <span className="font-medium text-g-400 leading-5 text-sm">
                    {pro.startDate} — {pro.endDate || "Present"}
                  </span>
                </div>
                {pro.highlights && pro.highlights.length > 0 && (
                  <ul className="list-disc ps-7 text-g-300 text-sm">
                    {pro.highlights.map((highlight, j) => (
                      <li key={j} className="leading-5">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills - Every item clickable */}
      {resume.skills && resume.skills.length > 0 && (
        <div onClick={() => onSectionClick("skills")} className="mb-5">
          <h2 className="w-full text-sm font-semibold text-g-400 mb-3 border-b-2 border-g-400 pb-1.5 inline-block">
            SKILLS
          </h2>
          <ul className="list-disc ps-7 text-g-300 text-sm grid grid-cols-3 cursor-pointer hover:bg-light-blue transition-colors">
            {resume.skills.map((skill, j) => (
              <li key={j} className="leading-5">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education - Every item clickable */}
      {resume.education && resume.education.length > 0 && (
        <div onClick={() => onSectionClick("education")} className="mb-5">
          <h2 className="w-full text-sm font-semibold text-g-400 mb-3 border-b-2 border-g-400 pb-1.5 inline-block">
            EDUCATION
          </h2>
          <div className="space-y-4">
            {resume.education.map((edu, i) => (
              <div
                key={i}
                className="cursor-pointer hover:bg-light-blue transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  onSectionClick("education", i); // Pass the index
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-g-400 flex items-center gap-1.5 leading-5 text-sm">
                    {edu.degree}
                    {" in " + edu.field}
                    {", " + edu.institution}
                  </p>
                  <span className="font-medium text-g-400 leading-5 text-sm">
                    {edu.startYear} — {edu.endYear || "Present"}
                  </span>
                </div>
                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="list-disc ps-7 text-g-300 text-sm">
                    {edu.highlights.map((highlight, j) => (
                      <li key={j} className="leading-5">
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications - Every item clickable */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div onClick={() => onSectionClick("certifications")} className="mb-5">
          <h2 className="w-full text-sm font-semibold text-g-400 mb-3 border-b-2 border-g-400 pb-1.5 inline-block">
            CERTIFICATIONS
          </h2>
          <div className="space-y-4">
            {resume.certifications.map((cert, i) => (
              <div
                key={i}
                className="cursor-pointer hover:bg-light-blue transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click
                  onSectionClick("certifications", i); // Pass the index
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium text-g-400 flex items-center gap-1.5 leading-5 text-sm">
                    {cert.name}
                    {cert.url && (
                      <a
                        className="text-xs leading-5 text-primary hover:underline"
                        href={cert.url}
                      >
                        (Certificate Link)
                      </a>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hobbies - Every item clickable */}
      {resume.hobbies && resume.hobbies.length > 0 && (
        <div onClick={() => onSectionClick("hobbies")} className="mb-5">
          <h2 className="w-full text-sm font-semibold text-g-400 mb-3 border-b-2 border-g-400 pb-1.5 inline-block">
            HOBBIES
          </h2>
          {resume.hobbies && resume.hobbies.length > 0 && (
            <ul className="list-disc ps-7 text-g-300 text-sm grid grid-cols-3 cursor-pointer hover:bg-light-blue transition-colors">
              {resume.hobbies.map((hobby, j) => (
                <li key={j} className="leading-5">
                  {hobby}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Loading State Component (unchanged)
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="relative">
        <div className="w-16 h-16"></div>
        <div className="w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-white absolute top-0 left-0"></div>
      </div>
      <p className="mt-5 text-g-200 font-medium text-sm">
        Please wait! Crafting your resume with our NextGen AI
      </p>
    </div>
  );
}
