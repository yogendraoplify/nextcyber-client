"use client";
import React, { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Pen, Plus, Trash2, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfileForm({
  educationList = [],
  onOpenAddEducation,
  onEditEducation,
  onRemoveEducation,
  experienceList = [],
  onOpenAddExperience,
  onEditExperience,
  onRemoveExperience,
  showErrors = true,
}) {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext();

  const fileRef = useRef(null);
  const file = watch("resume");

  const validateAndSetFile = (f) => {
    if (!f) return;

    if (f.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      toast.error("PDF size must be less than 5MB");
      return;
    }
    setValue("resume", f, { shouldValidate: true });
  };

  const handleSelect = (e) => {
    const f = e.target.files?.[0];
    validateAndSetFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    validateAndSetFile(f);
  };

  const removeFile = () => {
    setValue("resume", null, { shouldValidate: true });
    if (fileRef.current) fileRef.current.value = "";
  };

  useEffect(() => {
    register("resume", {
      required: "Resume is required",
    });
  }, [register]);

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8">
      <div className="w-1/2">
        <label className="text-g-200 font-medium leading-6 block mb-1">
          Resume <span className="text-dark-red">*</span>
        </label>

        <div
          className={`${
            !file && "border border-dashed border-g-200 p-5"
          } rounded text-center cursor-pointer`}
          onClick={() => fileRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex items-center gap-2 bg-g-700 px-3 py-2 rounded w-fit">
              <FileText size={18} className="text-primary" />
              <span className="text-sm text-g-100 max-w-[200px] truncate">
                {file.name}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="bg-dark-red p-1 rounded-full"
              >
                <X size={12} className="text-g-100" />
              </button>
            </div>
          ) : (
            <div className="select-none text-sm font-medium text-g-200 flex flex-col items-center justify-center gap-1">
              <FileText size={20} />
              <p>
                <span className="text-primary">Upload a file</span> or drag and
                drop
              </p>
              <p>PDF • Max 5MB</p>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileRef}
          className="hidden"
          accept="application/pdf"
          onChange={handleSelect}
        />

        {showErrors && errors.resume && (
          <p className="mt-1 text-sm text-red-400">{errors.resume.message}</p>
        )}
      </div>

      <div className="border border-dashed border-g-300"></div>

      <div>
        <label className="text-g-200 font-medium leading-6 block">
          Education
          <button
            type="button"
            onClick={onOpenAddEducation}
            className="p-2 bg-primary text-white rounded-full ml-1.5"
          >
            <Plus size={12} />
          </button>
        </label>

        {educationList.map((edu, idx) => (
          <div
            key={edu.id || idx}
            className="border border-g-600 rounded bg-g-700 p-3 flex justify-between items-start mt-5 w-fit gap-15"
          >
            <div className="flex flex-col gap-y-2.5">
              <div className="font-medium text-g-100 text-sm">
                {edu.institute}
              </div>
              <div className="text-xs text-g-200">{edu.level}</div>
              <div className="text-xs text-g-300">
                {edu.startDate} - {edu.endDate}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEditEducation(idx)}
                className="h-8 w-8 flex items-center justify-center bg-[#025BCF26] rounded-full"
              >
                <Pen size={16} />
              </button>
              <button
                type="button"
                onClick={() => onRemoveEducation(idx)}
                className="h-8 w-8 flex items-center justify-center bg-[#025BCF26] rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-dashed border-g-300"></div>

      <div>
        <label className="text-g-200 font-medium leading-6 block">
          Work Experience
          <button
            type="button"
            onClick={onOpenAddExperience}
            className="p-2 bg-primary text-white rounded-full ml-1.5"
          >
            <Plus size={12} />
          </button>
        </label>

        {experienceList.map((exp, idx) => (
          <div
            key={exp.id || idx}
            className="border border-g-600 rounded bg-g-700 p-3 flex justify-between items-start mt-5 w-fit gap-15"
          >
            <div className="flex flex-col gap-y-2.5">
              <div className="font-medium text-g-100 text-sm">
                {exp.companyName}
              </div>
              <div className="text-xs text-g-200">{exp.jobTitle}</div>
              <div className="text-xs text-g-200">
                {exp.startDate} - {exp.endDate}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEditExperience(idx)}
                className="h-8 w-8 flex items-center justify-center bg-[#025BCF26] rounded-full"
              >
                <Pen size={16} />
              </button>
              <button
                type="button"
                onClick={() => onRemoveExperience(idx)}
                className="h-8 w-8 flex items-center justify-center bg-[#025BCF26] rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
