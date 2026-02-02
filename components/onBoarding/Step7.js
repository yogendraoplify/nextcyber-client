"use client";
import React, { useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import SelectField from "@/components/SelectField";
import { asyncGetDropdown } from "@/store/actions/dropdownAction";
import { useDispatch, useSelector } from "react-redux";

const Step7 = ({ showErrors = true }) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const contractType = watch("contractType");
  const skills = watch("skills");
  const remotePolicy = watch("remotePolicy");
  const dispatch = useDispatch();
  const { skillsDropdown } = useSelector((state) => state.dropdown);

  const fetchDropdowns = useCallback(() => {
    if (skillsDropdown?.length === 0)
      dispatch(asyncGetDropdown({ name: "skills" }));
  }, [skillsDropdown, dispatch]);

  useEffect(() => {
    fetchDropdowns();
  }, [fetchDropdowns]);

  const pillClass = (isActive) =>
    `px-2 py-1 rounded-full border transition text-xs bg-g-600 leading-4 font-medium ${
      isActive
        ? "text-white border-primary "
        : "bg-g-600 text-g-200  border-g-500 hover:bg-g-700"
    }`;

  return (
    <div className="w-full mx-auto bg-g-900 px-20 pt-20 space-y-10 min-h-[calc(100vh-204px)]">
      <div>
        <label className="block mb-2 text-sm font-medium text-g-200 leading-5">
          Contract Type
        </label>
        <div className="flex gap-2 flex-wrap">
          {["FREELANCE", "INTERNSHIP", "TEMPORARY", "PERMANENT"].map(
            (option) => (
              <button
                type="button"
                key={option}
                onClick={() => setValue("contractType", option)}
                className={`px-4 py-2 rounded-full capitalize border bg-g-600 transition text-sm leading-5 font-medium ${
                  contractType == option
                    ? "text-white border-primary "
                    : "text-g-200  border-g-500 hover:bg-g-700"
                }
    `}
              >
                {option.toLocaleLowerCase()}
              </button>
            )
          )}
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-g-200 leading-5">
          Remote Policy
        </label>
        <div className="flex gap-2 flex-wrap">
          {["ONSITE", "REMOTE", "HYBRID"].map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => setValue("remotePolicy", option)}
              className={`px-4 py-2 rounded-full border capitalize bg-g-600 transition text-sm leading-5 font-medium ${
                remotePolicy == option
                  ? "text-white border-primary "
                  : "text-g-200  border-g-500 hover:bg-g-700"
              }
    `}
            >
              {option.toLocaleLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className=" w-1/2 flex flex-col gap-10">
        <div>
          <SelectField
            label="Skills"
            name="skills"
            placeholder="Skills"
            showErrors={showErrors}
            multiple
            options={skillsDropdown || []}
            rules={{
              validate: (value) =>
                value.length > 0 || "Please select at least one skill",
            }}
          />
          <div className="flex gap-2 mt-4 flex-wrap">
            {skills?.map((skill) => (
              <button key={skill} className={`${pillClass(true)}`}>
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step7;
