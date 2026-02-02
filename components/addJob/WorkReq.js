"use client";

import React, { useEffect } from "react";
import SelectField from "@/components/SelectField";

export default function WorkReq({ form, showErrors }) {
  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = form;

  useEffect(() => {
    register("contractType", {
      required: "Contract type is required",
    });

    register("remotePolicy", {
      required: "Remote policy is required",
    });

    register("languages", {
      required: "Language is required",
    });
  }, [register]);

  const selectedContractTypes = watch("contractType") || [];
  const selectedRemotePolicy = watch("remotePolicy");
  const selectedLanguages = watch("languages") || [];

  const experienceOptions = Array.from({ length: 21 }).map(
    (_, i) => `${i} year`
  );

  const pillClass = (isActive) =>
    `px-2 py-1 rounded-full border transition text-xs leading-4 font-medium ${
      isActive
        ? "bg-primary text-white border-primary"
        : "bg-g-600 text-g-200 border-g-500 hover:bg-g-700"
    }`;

  const toggleSelection = (field, value) => {
    const current = getValues(field) || [];

    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    setValue(field, updated, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-10">
      <div>
        <label className="block mb-1 text-base leading-6 font-medium text-g-200">
          Work experience
        </label>

        <div className="flex gap-3">
          <div className="flex-1">
            <SelectField
              name="minExperience"
              label=""
              options={experienceOptions}
              placeholder="0 year"
              showErrors={showErrors}
              rules={{
                required: "Minimum experience is required",
                validate: (v) => {
                  const min = Number(v?.split(" ")[0]);
                  const max = Number(watch("maxExperience")?.split(" ")[0]);
                  if (min > max) return "Min experience cannot exceed max";
                  return true;
                },
              }}
            />
          </div>

          <div className="flex items-center text-g-200">to</div>

          <div className="flex-1">
            <SelectField
              name="maxExperience"
              label=""
              options={experienceOptions}
              placeholder="2 year"
              showErrors={showErrors}
              rules={{
                required: "Maximum experience is required",
                validate: (v) => {
                  const max = Number(v?.split(" ")[0]);
                  const min = Number(watch("minExperience")?.split(" ")[0]);
                  if (max < min) return "Max experience must be ≥ min";
                  return true;
                },
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-base leading-6 font-medium text-g-200">
          Contract Type
        </label>

        <div className="flex gap-5 flex-wrap">
          {[
            "Freelance",
            "Internship",
            "Temporary",
            "Permanent",
          ].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleSelection("contractType", c)}
              className={`${pillClass(
                selectedContractTypes.includes(c)
              )} cursor-pointer`}
            >
              {c}
            </button>
          ))}
        </div>

        {showErrors && errors.contractType && (
          <p className="text-dark-red text-sm mt-1">
            {errors.contractType.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 text-base leading-6 font-medium text-g-200">
          Remote Policy
        </label>

        <div className="flex gap-5 flex-wrap">
          {["ONSITE", "HYBRID", "REMOTE"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() =>
                setValue("remotePolicy", r, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              className={pillClass(selectedRemotePolicy === r)}
            >
              {r}
            </button>
          ))}
        </div>

        {showErrors && errors.remotePolicy && (
          <p className="text-dark-red text-sm mt-1">
            {errors.remotePolicy.message}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 text-base leading-6 font-medium text-g-200">
          Language Required
        </label>

        <div className="flex gap-5 flex-wrap">
          {["English", "Hindi", "Spanish"].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => toggleSelection("languages", l)}
              className={pillClass(selectedLanguages.includes(l))}
            >
              {l}
            </button>
          ))}
        </div>

        {showErrors && errors.languages && (
          <p className="text-dark-red text-sm mt-1">
            {errors.languages.message}
          </p>
        )}
      </div>
    </div>
  );
}
