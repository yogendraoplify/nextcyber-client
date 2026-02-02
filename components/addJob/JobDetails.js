"use client";

import React from "react";
import { Plus, X } from "lucide-react";
import LocationSearchInput from "../helper/LocationSearchInput";

export default function JobDetails({ form, showErrors }) {
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = form;

  const additionalBenefits = watch("additionalBenefits") || [];

  const errorClass = (field) =>
    showErrors && errors[field] ? "border-dark-red/80" : "border-g-600";

  return (
    <div className="space-y-10">
      <div>
        <label className="text-g-200 font-medium leading-6 block mb-1">
          Job title
        </label>
        <input
          {...register("jobTitle", { required: "Job title is required" })}
          placeholder="e.g. Penetration tester"
          className={`w-full py-4 px-5 rounded-lg border text-g-300 outline-none bg-g-700 ${errorClass(
            "jobTitle"
          )}`}
        />

        {showErrors && errors.jobTitle && (
          <p className="text-dark-red text-sm mt-1">
            {errors.jobTitle.message}
          </p>
        )}
      </div>

      {/* Job Location */}
      <div>
        <label className="text-g-200 font-medium leading-6 block mb-1">
          Job location
        </label>
        <LocationSearchInput
          value={getValues("jobLocation") || ""}
          onSelect={(location) =>
            setValue("jobLocation", location, { shouldDirty: true })
          }
          className={errorClass("jobLocation")}
        />

        {showErrors && errors.jobLocation && (
          <p className="text-dark-red text-sm mt-1">
            {errors.jobLocation.message}
          </p>
        )}
      </div>

      {/* Additional Benefits */}
      <div>
        <label className="text-g-200 font-medium leading-6 block mb-1">
          Additional benefits
        </label>

        <input
          type="text"
          placeholder="Type and press Enter to add"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const v = e.target.value.trim();
              if (!v) return;

              const cur = getValues("additionalBenefits") || [];
              setValue("additionalBenefits", [...cur, v], {
                shouldDirty: true,
              });
              e.target.value = "";
            }
          }}
          className="w-full py-4 px-5 rounded-lg border border-g-600 text-g-300 outline-none bg-g-700"
        />

        <div className="flex gap-2 mt-4 flex-wrap">
          {additionalBenefits.map((b, i) => (
            <div
              key={i}
              className="px-2 py-1 rounded-full border text-xs font-medium bg-g-600 text-g-200 border-g-500 flex items-center gap-2"
            >
              <span>{b}</span>

              <button
                onClick={() => {
                  const cur = getValues("additionalBenefits") || [];
                  setValue(
                    "additionalBenefits",
                    cur.filter((_, idx) => idx !== i),
                    { shouldDirty: true }
                  );
                }}
                type="button"
                className="cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
