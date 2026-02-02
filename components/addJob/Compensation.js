"use client";

import React from "react";
import SelectField from "@/components/SelectField";

export default function Compensation({ form, showErrors }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // React Hook Form controlled value
  const showSalary = watch("showSalary");

  // Toggle state but keep in sync with RHF
  const handleToggle = () => {
    setValue("showSalary", !showSalary, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const errorClass = (field) =>
    showErrors && errors[field] ? "border-red-600" : "border-g-600";

  return (
    <div className="space-y-10">
      <div className="flex flex-col">
        <span className="text-g-200 text-base leading-6 font-medium mb-2">
          Show Salary
        </span>

        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only"
            checked={!!showSalary}
            onChange={handleToggle}
          />

          <div
            className={`relative w-9 h-5 rounded-full transition-colors ${
              showSalary ? "bg-primary" : "bg-g-300"
            }`}
          >
            <span
              className={`absolute top-1/2 -translate-y-1/2 left-[3px] w-3.5 h-3.5 rounded-full bg-g-50 transition-transform ${
                showSalary ? "translate-x-4" : ""
              }`}
            />
          </div>

          <span className="text-g-200 text-base leading-6">
            {showSalary ? "Enabled" : "Disabled"}
          </span>
        </label>
      </div>

      <div>
        <SelectField
          label="Currency"
          name="currency"
          placeholder="Select Currency"
          options={["INR", "USD", "EUR", "GBP"]}
          showErrors={showErrors}
          rules={{
            validate: (val) => (!val ? "Currency is required" : true),
          }}
        />
      </div>
      <div>
        <label className="block mb-1 text-base leading-6 font-medium text-g-200">
          Salary per month
        </label>

        <div className="flex gap-3">
          <input
            {...register("salaryFrom", {
              validate: (v) => {
                if (!v) return "Required";
                if (v && isNaN(v)) return "Invalid number";
                return true;
              },
            })}
            placeholder="From"
            className={`w-full py-4 px-5 rounded-lg border text-g-300 outline-none bg-g-700 ${errorClass(
              "salaryFrom"
            )}`}
          />

          <div className="flex items-center text-g-200 leading-5 text-sm">
            to
          </div>

          <input
            {...register("salaryTo", {
              validate: (v) => {
                if (!v) return "Required";
                if (v && isNaN(v)) return "Invalid number";
                return true;
              },
            })}
            placeholder="To"
            className={`w-full py-4 px-5 rounded-lg border text-g-300 outline-none bg-g-700 ${errorClass(
              "salaryTo"
            )}`}
          />
        </div>

        {showErrors && (errors.salaryFrom || errors.salaryTo) && (
          <p className="text-red-500 text-sm mt-1">Salary range is required.</p>
        )}
      </div>
    </div>
  );
}
