"use client";
import React from "react";

export default function Stepper({ step = 0, onChange }) {
  const steps = ["Account Details", "Profile", "Technical"];
  const stepLabels = {
    account: "Account Details",
    profile: "Profile",
    technical: "Technical Skills",
  };

  return (
    <div className="flex items-center gap-1 p-2 bg-g-700 border border-g-500 rounded-full mx-auto w-fit whitespace-nowrap">
      {steps.map((s, i) => (
        <button
          type="button"
          key={i}
          onClick={() => onChange(i)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition cursor-pointer
              ${
                step === i
                  ? "bg-primary text-g-50"
                  : "text-g-200 hover:text-[#CDCECE]"
              }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
