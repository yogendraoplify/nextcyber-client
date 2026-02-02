"use client";
import React, { useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ArrowUpToLine } from "lucide-react";
import SelectField from "@/components/SelectField";
import { useDispatch, useSelector } from "react-redux";
import LocationSearchInput from "../helper/LocationSearchInput";
import { asyncGetDropdown } from "@/store/actions/dropdownAction";

const Step6 = ({ files, setFiles, showErrors = true }) => {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const { user } = useSelector((state) => state.auth);
  const gender = watch("gender");
  const selectedNationalities = watch("nationalities");
  const selectedRole = watch("role");
  const selectedLocation = watch("location");
  const selectedHeadquarter = watch("headquarter");
  const selectedLanguage = watch("languages");
  const profileImage = watch("profilePicture");
  const dispatch = useDispatch();

  const { rolesInCompanyDropdown } = useSelector((state) => state.dropdown);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setFiles({ ...files, profilePicture: file });
      setValue("profilePicture", imageURL);
    }
  };

  const fetchDropdowns = useCallback(() => {
    if (rolesInCompanyDropdown?.length === 0)
      dispatch(asyncGetDropdown({ name: "rolesInCompany" }));
  }, [dispatch]);

  useEffect(() => {
    fetchDropdowns();
  }, [fetchDropdowns]);

  const pillClass = (isActive) =>
    `px-2 py-1 rounded-full border transition text-xs leading-4 font-medium ${
      isActive
        ? "bg-primary text-white border-primary"
        : "bg-g-600 text-g-200 border-g-500 hover:bg-g-700"
    }`;

  return (
    <div className="w-full mx-auto bg-g-900 px-20 pt-20 space-y-10 min-h-[calc(100vh-204px)]">
      {/* Profile Picture */}
      <div className="flex flex-col items-start gap-4">
        <label className="text-sm font-medium text-g-200 leading-5">
          Profile Picture
        </label>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-g-500">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-g-300 text-sm">
                No Img
              </div>
            )}
          </div>
          <label
            htmlFor="upload"
            className="flex items-center gap-2 border border-g-400 text-g-200 px-4 py-2 rounded-full cursor-pointer transition"
          >
            <ArrowUpToLine size={18} />
            <span className="text-base leading-[150%]">Upload Image</span>
          </label>
          <input
            id="upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="block mb-2 text-sm font-medium text-g-200 leading-5">
          Gender preference <span className="text-dark-red">*</span>
        </label>

        {/* register hidden field */}
        <input
          type="hidden"
          {...register("gender", {
            required: "Gender is required",
          })}
        />

        <div className="flex gap-2 flex-wrap">
          {["MALE", "FEMALE", "PREFER_NOT_TO_SAY"].map((option) => (
            <button
              type="button"
              key={option}
              onClick={() =>
                setValue("gender", option, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className={`px-4 py-2 rounded-full border capitalize transition text-sm leading-5 bg-g-600 text-g-200 border-g-500 font-medium ${
                gender === option ? "border-primary" : "hover:bg-g-700"
              }`}
            >
              {option.replaceAll("_", " ").toLowerCase()}
            </button>
          ))}
        </div>

        {showErrors && errors.gender && (
          <p className="mt-1 text-xs text-dark-red">{errors.gender.message}</p>
        )}
      </div>

      {/* Candidate Section */}
      {user?.role === "STUDENT" ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <SelectField
                label="Nationalities"
                name="nationalities"
                placeholder="Select Nationalities"
                multiple
                options={[
                  "India",
                  "United States",
                  "Canada",
                  "United Kingdom",
                  "Germany",
                  "France",
                ]}
                showErrors={showErrors}
                rules={{
                  validate: (value) =>
                    value.length > 0 ||
                    "Please select at least one nationality",
                }}
              />
              <div className="flex gap-2 mt-4 flex-wrap">
                {selectedNationalities?.map((nation) => (
                  <button key={nation} className={`${pillClass()}`}>
                    {nation}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-g-200 leading-5">
                Location
              </label>
              <LocationSearchInput
                selectedPlace={selectedLocation}
                onPlaceSelected={(locationData) =>
                  setValue(
                    "location",
                    locationData.city && locationData.state
                      ? `${locationData?.city}, ${locationData?.state}, ${locationData?.country}`
                      : "",
                    { shouldValidate: true, shouldDirty: true }
                  )
                }
              />
              {selectedLocation && (
                <button className={`${pillClass()} mt-4`}>
                  {selectedLocation}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <SelectField
                label="Language"
                name="languages"
                placeholder="Search"
                multiple
                options={[
                  "English",
                  "Hindi",
                  "Marathi",
                  "French",
                  "Spanish",
                  "German",
                ]}
                showErrors={showErrors}
                rules={{
                  validate: (value) =>
                    value.length > 0 || "Please select at least one language",
                }}
              />
              <div className="flex gap-2 mt-4 flex-wrap">
                {selectedLanguage?.map((lan) => (
                  <button key={lan} className={`${pillClass()}`}>
                    {lan}
                  </button>
                ))}
              </div>
            </div>

            <SelectField
              label="Currency"
              name="currency"
              placeholder="Search"
              options={["INR", "USD", "EUR", "GBP", "JPY"]}
              showErrors={showErrors}
              rules={{ required: "Currency is required" }}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <SelectField
                label="Role within the company"
                name="roleWithCompany"
                placeholder="Search"
                options={rolesInCompanyDropdown || []}
                showErrors={showErrors}
                rules={{ required: "Role is required" }}
              />
              {selectedRole && (
                <button className={`${pillClass()} mt-4 capitalize`}>
                  {selectedRole.toLowerCase()}
                </button>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-g-200 leading-5">
                Company Name
              </label>
              <input
                {...register("companyName", {
                  required: "Company Name is required",
                })}
                type="text"
                placeholder="Enter company name"
                className="w-full bg-[#111214] border border-[#1B1C1E] rounded-lg px-5 py-4 text-white outline-none text-sm"
              />
              {errors.companyName && (
                <p className="mt-1 text-xs text-dark-red">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-g-200 leading-5">
                Company Email
              </label>
              <input
                {...register("companyEmail", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                placeholder="Enter company email"
                className="w-full bg-[#111214] border border-[#1B1C1E] rounded-lg px-5 py-4 text-white outline-none text-sm"
              />
              {errors.companyEmail && (
                <p className="mt-1 text-xs text-dark-red">
                  {errors.companyEmail.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-g-200 leading-5">
                Headquarter Location
              </label>
              <LocationSearchInput
                selectedPlace={selectedHeadquarter}
                onPlaceSelected={(locationData) =>
                  setValue(
                    "headquarter",
                    locationData.city && locationData.state
                      ? `${locationData?.city}, ${locationData?.state}, ${locationData?.country}`
                      : "",
                    { shouldValidate: true, shouldDirty: true }
                  )
                }
              />
              {selectedHeadquarter && (
                <button className={`${pillClass()} mt-4`}>
                  {selectedHeadquarter}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Step6;
