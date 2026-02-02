import React, { useEffect } from "react";
import { XCircle } from "lucide-react";

export default function ProfileScoringModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const { overallPercentage, sections } = data;

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

  const Section = ({ title, section }) => (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-[#69EDFE]">{title}</h3>
        <div className="px-2 py-0.5 bg-dark-green rounded-full">
          <span className="text-xs font-medium text-white">
            {section.percentage}%
          </span>
        </div>
      </div>

      {section.items.map((item) => (
        <SectionItem
          key={item.key}
          label={item.label}
          weight={item.weight}
          completed={item.completed}
        />
      ))}
    </div>
  );

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
        <Section title="Account Details" section={sections.accountDetails} />
        <Section title="Profile" section={sections.profile} />
        <Section title="Technical" section={sections.technical} />
      </div>
    </div>
  );
}
