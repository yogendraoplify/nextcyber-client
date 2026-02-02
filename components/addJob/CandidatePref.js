"use client";

import React, { useEffect } from "react";
import SelectField from "@/components/SelectField";

export default function CandidatePreference({ form, showErrors }) {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = form;

  const selectedQualification = watch("qualifications");
  const selectedGender = watch("genderPreference");
  const selectedSkills = watch("skills");
  const selectedCerts = watch("certifications");

  useEffect(() => {
    register("qualifications", {
      required: "Qualification is required",
    });
  }, [register]);

  const pillClass = (isActive) =>
    `px-2 py-1 rounded-full border transition text-xs leading-4 font-medium ${
      isActive
        ? "bg-primary text-white border-primary"
        : "bg-g-600 text-g-200 border-g-500 hover:bg-g-700"
    }`;

  return (
    <div className="space-y-10">
      <div>
        <label className="block mb-2 text-base leading-6 font-medium text-g-200">
          Candidate’s qualification
        </label>
        <div className="flex gap-4 flex-wrap">
          {["HIGH_SCHOOL", "ASSOCIATE", "BACHELORS", "MASTERS"].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() =>
                setValue("qualifications", q, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className={`${pillClass(
                selectedQualification.includes(q)
              )} capitalize cursor-pointer`}
            >
              {q.replaceAll("_", " ").toLowerCase()}
            </button>
          ))}
        </div>

        {showErrors && errors.qualification && (
          <p className="text-dark-red text-sm mt-1">
            {errors.qualification.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 text-base leading-6 font-medium text-g-200">
          Gender preference
        </label>
        <div className="flex gap-4 flex-wrap">
          {["MALE", "FEMALE", "PREFER_NOT_TO_SAY"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() =>
                setValue("genderPreference", g, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className={`${pillClass(selectedGender === g)} capitalize cursor-pointer`}
            >
              {g.replaceAll("_", " ").toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <SelectField
          label="Skills"
          name="skills"
          placeholder="Select skills"
          multiple
          options={["React", "Node.js", "Express", "Python", "AWS"]}
          showErrors={showErrors}
          rules={{
            validate: (v) =>
              v?.length > 0 ? true : "Select at least one skill",
          }}
        />

        <div className="flex gap-4 mt-4 flex-wrap">
          {selectedSkills.map((s) => (
            <span
              key={s}
              className="px-2 py-1 rounded-full border text-xs font-medium bg-g-600 text-g-200 border-g-500"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div>
        <SelectField
          label="Certifications"
          name="certifications"
          placeholder="Select certifications"
          multiple
          options={["Certified in Cybersecurity", "PenTest+", "Network+"]}
          showErrors={showErrors}
          rules={{
            validate: (v) =>
              v?.length > 0 ? true : "Select at least one certification",
          }}
        />

        <div className="flex gap-4 mt-4 flex-wrap">
          {selectedCerts.map((c) => (
            <span
              key={c}
              className="px-2 py-1 rounded-full border text-xs font-medium bg-g-600 text-g-200 border-g-500"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
