"use client";
import React from "react";
import { useSelector } from "react-redux";
import Modal from "../modal/Modal";
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
function EducationModel({ isOpen, onClose }) {
  const { user } = useSelector((state) => state.auth);
  const profile = user?.studentProfile;
  const education = profile?.education || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={"Education"}>
      {education.length ? (
        <div className="relative">
          <div className="absolute left-[6px] top-0 h-full border border-dashed border-g-400" />

          <div className="space-y-7.5">
            {education.map((edu, i) => (
              <div
                key={edu.id || i}
                className="flex items-start gap-1 py-3 relative"
              >
                <div className="relative z-10 bg-g-400 p-0.5 rounded-full">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full block" />
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
      ) : (
        <p className="text-sm text-g-300">No education added</p>
      )}
    </Modal>
  );
}

export default EducationModel;
