"use client";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import EducationModel from "./EducationModel";

const tabs = ["Skills & Experience", "Education", "About Me"];

const formatDateRange = (start, end) => {
  if (!start && !end) return "—";
  const s = start
    ? new Date(start).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Present";
  const e = end
    ? new Date(end).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Present";
  return `${s} - ${e}`;
};

export default function ProfileTabs({openExperienceModal}) {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("Skills & Experience");
  const [educationOpen, setEducationOpen] = useState(false);
  const profile = user?.studentProfile;

  const skills = profile?.skills || [];
  const certificates = profile?.certificates || [];
  const experiences = profile?.workExperience || [];
  const education = profile?.education.slice(0, 2) || [];

  const aboutMe = useMemo(() => {
    return profile?.aboutMe || "No description provided.";
  }, [profile]);

  if (!profile) return null;

  return (
    <>
      <div className="bg-gradient-to-b from-g-500 to-g-600 p-0.5 rounded-[10px] overflow-hidden">
        <div className="bg-g-600 rounded-lg p-5">
          <div className="flex space-x-6 mb-5 overflow-x-auto scrollbar pb-1.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-base leading-6 font-semibold text-g-100 whitespace-nowrap cursor-pointer ${
                  activeTab === tab ? "border-b-2 border-primary" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Skills & Experience" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-g-100 mb-2.5">
                  Skills
                </h3>

                {skills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-g-600 border border-g-500 text-g-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-g-300">No skills added</p>
                )}
              </div>

              <div>
                <h3 className="text-base font-semibold text-g-100 mb-2.5">
                  Certifications
                </h3>

                {certificates.length ? (
                  <div className="flex flex-wrap gap-2">
                    {certificates.map((cert, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-g-600 border border-g-500 text-g-200"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-g-300">No certifications added</p>
                )}
              </div>

              <div>
                <h3 className="text-base font-semibold text-g-100 mb-2.5">
                  Experience
                </h3>

                {experiences.length ? (
                  <>
                    <div className="relative">
                      <div className="absolute left-[6px] top-0 h-full border border-dashed border-g-400" />

                      <div className="space-y-7.5">
                        {experiences.map((exp, i) => (
                          <div
                            key={exp.id || i}
                            className="flex items-start gap-1 py-3 relative"
                          >
                            <div className="relative z-10 bg-g-400 p-0.5 rounded-full">
                              <span className="w-2.5 h-2.5 bg-primary rounded-full block" />
                            </div>

                            <div className="pl-3 space-y-1">
                              <p className="text-sm text-g-200">
                                {formatDateRange(exp.startDate, exp.endDate)}
                              </p>
                              <h4 className="text-primary font-semibold text-base">
                                {exp.role || "—"}
                              </h4>
                              <p className="text-g-100 text-sm font-medium">
                                {exp.company || "—"}
                              </p>
                              <p className="text-g-300 text-sm">
                                {exp.description || "—"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={openExperienceModal} className="mt-4 px-2 py-1 text-xs leading-4 cursor-pointer font-medium rounded-full bg-g-500 text-g-200">
                      explore experience
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-g-300">No work experience added</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Education" && (
            <div>
              <h3 className="text-base font-semibold text-g-100 mb-2.5">
                Education
              </h3>

              {education.length ? (
                <>
                  <div className="relative">
                    <div className="absolute left-[6px] top-0 h-full border border-dashed border-g-400" />

                    <div className="space-y-7.5">
                      {education.map((edu, i) => (
                        <div
                          key={edu.id || i}
                          className="flex items-start gap-1 py-3 relative"
                        >
                          <div className="relative z-10 bg-g-400 p-0.5 rounded-full">
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full block" />
                          </div>

                          <div className="pl-3 space-y-1">
                            <p className="text-sm text-g-200">
                              {formatDateRange(edu.startDate, edu.endDate)}
                            </p>
                            <h4 className="text-primary font-semibold text-base capitalize">
                              {edu.level.toLowerCase()}
                            </h4>
                            <p className="text-g-100 text-sm font-medium">
                              {edu.institute}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className="mt-4 px-2 py-1 text-xs leading-4 cursor-pointer font-medium rounded-full bg-g-500 text-g-200"
                    onClick={() => {
                      setEducationOpen(true);
                    }}
                  >
                    explore education
                  </button>
                </>
              ) : (
                <p className="text-sm text-g-300">No education added</p>
              )}
            </div>
          )}

          {activeTab === "About Me" && (
            <p className="text-g-300 text-sm leading-5">{aboutMe}</p>
          )}
        </div>
      </div>

      <EducationModel
        isOpen={educationOpen}
        onClose={() => {
          setEducationOpen(false);
        }}
      />
    </>
  );
}
