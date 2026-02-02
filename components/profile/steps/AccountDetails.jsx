"use client";
import React, { useRef, useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import SelectField from "@/components/SelectField";
import Image from "next/image";
import { ImageUp, Info, Image as LucideImage, X } from "lucide-react";
import toast from "react-hot-toast";
import LocationSearchInput from "@/components/helper/LocationSearchInput";
import validateImage from "@/helper/validateImage";

function UploadBox({ title, onChange, error, validationRules, tips }) {
  const inputRef = useRef(null);
  const tipRef = useRef(null);

  const [localError, setLocalError] = useState(null);
  const [tipOpen, setTipOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (tipRef.current && !tipRef.current.contains(e.target)) {
        setTipOpen(false);
      }
    }

    if (tipOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tipOpen]);

  const handleFile = async (file) => {
    if (!file) return;

    const validationError = await validateImage(file, validationRules);

    if (validationError) {
      setLocalError(validationError);
      onChange(null);
      return;
    }

    setLocalError(null);
    const previewUrl = URL.createObjectURL(file);
    onChange({ file, preview: previewUrl });
  };

  return (
    <div className="flex flex-col w-full">
      <div className=" flex gap-2 items-center mb-4 relative">
        <label className="text-g-200 font-medium leading-6 block mb-1">
          {title}
        </label>{" "}
        <Info
          size={16}
          className=" text-g-200 cursor-pointer"
          onClick={() => setTipOpen(true)}
        />
        {tipOpen && (
          <div ref={tipRef} className=" relative z-50 ml-1">
            <TipsCard tips={tips} />
          </div>
        )}
      </div>

      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`h-46 border border-dashed rounded-lg
        bg-[#1B1C1E] flex items-center justify-center text-sm flex-col gap-2.5 cursor-pointer
        ${error || localError ? "border-dark-red" : "border-[#2F3031]"}`}
      >
        <ImageUp className="text-accent-color-1" size={20} />
        <div className="text-g-200 text-center">
          <span className="text-accent-color-1">Upload a file</span> or drag and
          drop
        </div>

        <input
          ref={inputRef}
          type="file"
          hidden
          accept={validationRules.formats.join(",")}
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {(error || localError) && (
        <p className="text-dark-red text-xs mt-1">{error || localError}</p>
      )}
    </div>
  );
}

export default function AccountDetails({ showErrors = true }) {
  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const fileRef = useRef(null);
  const gender = watch("gender");
  const file = watch("profilePicture");
  const profileBanner = watch("profileBanner");
  const profilePicture = watch("profilePicture");

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (file instanceof File) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setValue("profilePicture", f, { shouldValidate: true });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setValue("profilePicture", f, { shouldValidate: true });
  };

  const removeImage = () => {
    setValue("profilePicture", null, { shouldValidate: true });
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  useEffect(() => {
    register("profilePicture", {
      required: "Profile picture is required",
    });
  }, [register]);

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8">
      <div className="col-span-2 gap-y-6 flex gap-5">
        <div className="w-1/2">
          <Controller
            name="profilePicture"
            control={control}
            render={({ field }) => (
              <UploadBox
                title="Profile Picture"
                {...field}
                error={errors.profilePicture?.message}
                validationRules={{
                  maxSizeMB: 1,
                  minWidth: 200,
                  minHeight: 200,
                  aspectRatio: 1,
                  formats: [
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "image/svg+xml",
                  ],
                }}
                tips={["Use a clear headshot", "Prefer transparent background"]}
              />
            )}
          />

          {(preview || profilePicture?.preview || file?.url) && (
            <div className="relative mt-2 rounded-lg w-32 h-32">
              <Image
                src={preview || profilePicture?.preview || file?.url}
                height={128}
                width={128}
                alt="Profile"
                className="rounded-lg object-cover w-32 h-32"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-g-700 rounded-full p-1 hover:bg-g-600"
              >
                <X className="w-4 h-4 text-g-200" />
              </button>
            </div>
          )}
        </div>
        <div className="w-1/2">
          <Controller
            name="profileBanner"
            control={control}
            render={({ field }) => (
              <UploadBox
                title="Banner Image"
                {...field}
                error={errors.profileBanner?.message}
                validationRules={{
                  maxSizeMB: 3,
                  minWidth: 1200,
                  minHeight: 300,
                  aspectRatio: 4,
                  formats: [
                    "image/png",
                    "image/jpeg",
                    "image/jpg",
                    "image/webp",
                  ],
                }}
                tips={[
                  "Keep it centered and not stretched",
                  "Prefer transparent background",
                ]}
              />
            )}
          />

          {profileBanner?.preview && (
            <Image
              src={profileBanner.preview}
              height={64}
              width={64}
              alt="Profile"
              className="mt-2 rounded-lg object-cover h-20 w-full"
            />
          )}
        </div>
      </div>
      <div>
        <label className="text-g-200 font-medium leading-6 block mb-1">
          First Name
        </label>
        <input
          {...register("firstName", {
            required: "First name required",
            minLength: { value: 2, message: "Minimum 2 characters" },
          })}
          className="w-full py-4 px-5 rounded-lg border text-g-300 outline-none bg-g-700 border-g-600"
          placeholder="Enter first name"
        />
        {showErrors && <p className="error">{errors.firstName?.message}</p>}
      </div>
      <div>
        <label className="text-g-200 font-medium leading-6 block mb-1">
          Last Name
        </label>
        <input
          {...register("lastName", { required: "Last name required" })}
          className="w-full py-4 px-5 rounded-lg border text-g-300 outline-none bg-g-700 border-g-600"
          placeholder="Enter last name"
        />
        {showErrors && <p className="error">{errors.lastName?.message}</p>}
      </div>
      <div>
        <label className="text-g-200 font-medium leading-6 block mb-1">
          Location
        </label>
        <LocationSearchInput
          value={watch("location")}
          onPlaceSelected={(place) => {
            const address =
              `${place.city || ""}, ${place.state || ""}, ${place.country || ""}`
                .replace(/,\s*,/g, ",")
                .replace(/^\s*,|,\s*$/g, "");
            setValue("location", address, { shouldDirty: true });
          }}
        />
        {showErrors && <p className="error">{errors.location?.message}</p>}
      </div>
      <SelectField
        label="Currency"
        name="currency"
        options={["INR", "USD", "EUR"]}
        placeholder="Select currency"
        rules={{ required: "Currency required" }}
        showErrors={showErrors}
      />

      <div className="col-span-2">
        <label className="block mb-2 text-sm font-medium text-g-200 leading-5">
          Gender preference
        </label>
        <div className="flex gap-2 flex-wrap">
          {["MALE", "FEMALE", "PREFER_NOT_TO_SAY"].map((option) => (
            <button
              type="button"
              key={option}
              onClick={() =>
                setValue("gender", option, { shouldValidate: true })
              }
              className={`px-4 py-2 cursor-pointer rounded-full border capitalize transition text-sm leading-5 bg-g-600 text-g-200 border-g-500 font-medium ${
                gender === option ? "border-primary" : "hover:bg-g-700"
              }`}
            >
              {option.replaceAll("_", " ").toLowerCase()}
            </button>
          ))}
        </div>
        {showErrors && errors.gender && (
          <p className="mt-1 text-sm text-red-400">{errors.gender.message}</p>
        )}
      </div>

      <SelectField
        label="Nationality"
        name="nationalities"
        multiple
        options={["India", "USA", "Canada"]}
        showErrors={showErrors}
      />
      <SelectField
        label="Language"
        name="languages"
        multiple
        options={["English", "Hindi", "Gujarati"]}
        showErrors={showErrors}
      />

      <div>
        <label className="text-g-200 font-medium leading-6 block mb-1">
          Expected Salary
        </label>
        <input
          {...register("expectedSalary")}
          className="w-full py-4 px-5 rounded-lg border text-g-300 outline-none bg-g-700 border-g-600"
          placeholder="Enter your salary"
        />
      </div>

      <div>
        <label className="text-g-200 font-medium leading-6 block mb-1">
          Hourly Rate
        </label>
        <input
          {...register("hourlyRate")}
          className="w-full py-4 px-5 rounded-lg border text-g-300 outline-none bg-g-700 border-g-600"
          placeholder="Enter your hourly rate"
        />
      </div>
    </div>
  );
}
