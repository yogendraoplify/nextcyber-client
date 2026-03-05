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
    register,
    formState: { errors },
  } = useFormContext();

  const { user } = useSelector((state) => state.auth);

  const contractType = watch("contractType");
  const skills = watch("skills");
  const domain = watch("domain");
  const certificates = watch("certificates");
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
      {user.role === "MENTOR" ? (
        <div className=" w-1/2 flex flex-col gap-10">
          <div>
            <div>
              <label className="text-g-200 font-medium leading-6 block mb-1">
                Years of Experience
              </label>
              <input
                {...register("yearsOfExperience", {
                  required: "Years of experience required",
                  min: { value: 0, message: "Please enter a valid number" },
                })}
                className="w-full py-4 px-5 rounded-lg border text-g-300 outline-none bg-g-700 border-g-600"
                placeholder="Enter years of experience"
              />
              {errors.yearsOfExperience && (
                <p className="error">{errors.yearsOfExperience.message}</p>
              )}
            </div>
          </div>
          <div>
            <SelectField
              label="Domain"
              name="domain"
              placeholder="Domain"
              showErrors={showErrors}
              multiple
              options={
                ["Web Development", "Data Science", "Cybersecurity"] || []
              }
              rules={{
                validate: (value) =>
                  value.length > 0 || "Please select at least one domain",
              }}
            />
            <div className="flex gap-2 mt-4 flex-wrap">
              {domain?.map((domainOption) => (
                <button key={domainOption} className={`${pillClass(true)}`}>
                  {domainOption}
                </button>
              ))}
            </div>
          </div>
          <div>
            <SelectField
              label="Certificates"
              name="certificates"
              placeholder="Certificates"
              showErrors={showErrors}
              multiple
              options={
                [
                  "CCNA",
                  "AWS Certified Cloud Practitioner",
                  "AWS Certified SysOps Administrator - Associate",
                ] || []
              }
              rules={{
                validate: (value) =>
                  value.length > 0 || "Please select at least one certificate",
              }}
            />
            <div className="flex gap-2 mt-4 flex-wrap">
              {certificates?.map((certificate) => (
                <button key={certificate} className={`${pillClass(true)}`}>
                  {certificate}
                </button>
              ))}
            </div>
          </div>
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
      ) : (
        <>
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
                ),
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
        </>
      )}
    </div>
  );
};

export default Step7;
