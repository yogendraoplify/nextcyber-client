import React, { useEffect } from "react";
import { XCircle } from "lucide-react";

export default function CompanyScoreModel({ isOpen, onClose, profileScore }) {
  console.log("Profile Score Data:", profileScore);
  if (!isOpen || !profileScore) return null;

  const { overallPercentage, sectionPercentages } = profileScore;

  const RadioButton = ({ checked }) => (
    <div className="relative w-4 h-4 flex-shrink-0">
      {checked ? (
        <>
          <div className="absolute w-4 h-4 rounded-full border border-primary" />
          <div className="absolute w-2 h-2 top-1 left-1 rounded-full bg-primary" />
        </>
      ) : (
        <div className="w-4 h-4 rounded-full border border-[#6A6B6C]" />
      )}
    </div>
  );

  const SectionItem = ({ label, weight, completed }) => (
    <div className="flex justify-between items-start gap-2 w-full">
      <div className="flex items-center gap-2">
        <RadioButton checked={completed} />
        <span className="text-sm text-g-100">{label}</span>
      </div>
      <span className="text-sm font-medium text-g-100">{weight}%</span>
    </div>
  );

  const Section = ({ title, percentage, items }) => (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-[#69EDFE]">{title}</h3>
        <div className="px-2 py-0.5 bg-dark-green rounded-full">
          <span className="text-xs font-medium text-white">
            {percentage}%
          </span>
        </div>
      </div>
      {items.map((item, index) => (
        <SectionItem
          key={index}
          label={item.label}
          weight={item.weight}
          completed={item.completed}
        />
      ))}
    </div>
  );

  // Define section configurations
  const sections = [
    {
      title: "Account Details",
      percentage: sectionPercentages.accountDetails,
      items: [
        { label: "Company Name", weight: 10, completed: sectionPercentages.accountDetails >= 10 },
        { label: "Industry", weight: 10, completed: sectionPercentages.accountDetails >= 20 },
        { label: "Company Size", weight: 10, completed: sectionPercentages.accountDetails >= 30 },
        { label: "Location", weight: 10, completed: sectionPercentages.accountDetails >= 40 },
      ],
    },
    {
      title: "Profile",
      percentage: sectionPercentages.profile,
      items: [
        { label: "Company Description", weight: 10, completed: sectionPercentages.profile >= 10 },
        { label: "Logo", weight: 10, completed: sectionPercentages.profile >= 20 },
        { label: "Website", weight: 7, completed: sectionPercentages.profile >= 27 },
        { label: "Social Media", weight: 10, completed: sectionPercentages.profile >= 37 },
      ],
    },
    {
      title: "Cyber Security",
      percentage: sectionPercentages.cyber,
      items: [
        { label: "Security Policy", weight: 15, completed: sectionPercentages.cyber >= 15 },
        { label: "Data Protection", weight: 15, completed: sectionPercentages.cyber >= 30 },
        { label: "Compliance", weight: 15, completed: sectionPercentages.cyber >= 45 },
        { label: "Security Training", weight: 15, completed: sectionPercentages.cyber >= 60 },
      ],
    },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-10 flex items-center justify-center bg-g-900/50 p-4"
    >
      <div
        className="flex flex-col gap-5 w-full max-w-[500px] bg-g-600 border-2 border-g-400 rounded-[10px] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-g-100">
            Profile Scoring Model
          </h2>
          <button
            onClick={onClose}
            className="text-g-200 hover:text-g-100 cursor-pointer"
          >
            <XCircle className="w-5 h-5" strokeWidth={1.67} />
          </button>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <span className="text-xs font-medium text-g-100 text-right">
            {overallPercentage}%
          </span>
          <div className="relative w-full h-1.5 rounded-full bg-g-500">
            <div
              className="absolute h-1.5 rounded-full"
              style={{
                width: `${overallPercentage}%`,
                background: "linear-gradient(90deg, #025BCF 0%, #69EDFE 100%)",
              }}
            />
          </div>
        </div>

        {/* Sections */}
        {sections.map((section, index) => (
          <Section
            key={index}
            title={section.title}
            percentage={section.percentage}
            items={section.items}
          />
        ))}
      </div>
    </div>
  );
}