import React, { useEffect } from "react";
import { X, XCircle } from "lucide-react";
import { timeFormatter } from "@/helper";

export default function ExperienceModal({ isOpen, onClose, data }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  return (
    <div className="fixed z-60 inset-0 flex items-center justify-center bg-g-800/50 bg-opacity-50 p-4">
      <div className="flex flex-col items-start p-5 gap-5 w-full max-w-[718px] max-h-[636px] bg-g-700 border-2 border-g-400 rounded-[10px]">
        <div className="flex flex-row justify-between items-start gap-6 w-full">
          <h2 className="text-base font-semibold text-g-100">Experience</h2>
          <button
            onClick={onClose}
            className="w-5 h-5 flex-shrink-0 text-g-200 hover:text-g-100 transition-colors cursor-pointer"
          >
            <XCircle className="w-5 h-5" strokeWidth={1.67} />
          </button>
        </div>

        <div
          className="relative overflow-y-auto exp-scroll"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute left-[6px] top-0 h-full border border-dashed border-g-400" />

          <div className="space-y-7.5">
            {data.map((exp, index) => (
              <div
                key={index}
                className="flex flex-col items-start gap-[3px] w-full"
              >
                <div className="flex items-start gap-1 relative w-full">
                  <div className="relative z-10 bg-g-400 p-0.5 rounded-full">
                    <span className="w-2.5 h-2.5 bg-primary rounded-full block" />
                  </div>

                  <div className="pl-3 space-y-1 w-full">
                    <p className="text-xs font-medium text- w-full">
                      {timeFormatter(exp.startDate)} -{" "}
                      {timeFormatter(exp.endDate)}
                    </p>

                    <h3 className="text-base font-semibold text-primary w-full">
                      {exp?.jobTitle || exp?.level}
                    </h3>

                    <p className="text-sm font-medium text-g-100 w-full">
                      {exp?.companyName || exp?.institute}
                    </p>

                    <ul className="text-sm font-normal text-g-100 w-full list-disc pl-5 space-y-1">
                      {exp?.description}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
