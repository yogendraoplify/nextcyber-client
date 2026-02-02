"use client";

import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { SaveButton } from "@/components/ui/SaveButton";
import { ImageUp, Info } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import SelectField from "@/components/SelectField";
import { updateCompanyApi } from "@/api/companyApi";
import { getErrorMessage } from "@/utils/errMessage";
import validateImage from "@/helper/validateImage";
import toast from "react-hot-toast";
import TipsCard from "@/components/TipsCard";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetDropdown } from "@/store/actions/dropdownAction";

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
        <p className="text-[#CDCECE] font-medium ">{title}</p>
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

export default function Profile() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, dirtyFields },
  } = useForm();

  const { user } = useSelector((state) => state.auth);
  const company = user?.companyProfile;
  const dispatch = useDispatch();
  const { rolesInCompanyDropdown } = useSelector((state) => state.dropdown);

  const [roleWithCompany, setRoleWithCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileImage = watch("profileImage");
  const bannerImage = watch("bannerImage");

  useEffect(() => {
    if (!user || !company) return;

    reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      gender: company.gender || "MALE",
      profileImage: company.profilePicture
        ? { preview: company.profilePicture.url }
        : null,
      bannerImage: company.profileBanner
        ? { preview: company.profileBanner.url }
        : null,
    });

    setRoleWithCompany(company.roleWithCompany || "");
  }, [user, company, reset]);

  const fetchDropdowns = useCallback(() => {
    if (rolesInCompanyDropdown?.length === 0)
      dispatch(asyncGetDropdown({ name: "rolesInCompany" }));
  }, [dispatch]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();

    if (dirtyFields.profileImage && data.profileImage?.file) {
      formData.append("profilePicture", data.profileImage.file);
    }

    if (dirtyFields.bannerImage && data.bannerImage?.file) {
      formData.append("profileBanner", data.bannerImage.file);
    }

    if (dirtyFields.firstName) {
      formData.append("firstName", data.firstName);
    }

    if (dirtyFields.lastName) {
      formData.append("lastName", data.lastName);
    }

    if (dirtyFields.gender) {
      formData.append("gender", data.gender);
    }

    if (roleWithCompany !== company?.roleWithCompany) {
      formData.append("roleWithCompany", roleWithCompany);
    }

    if ([...formData.entries()].length === 0) {
      toast("No changes detected");
      return;
    }

    try {
      await updateCompanyApi(formData);
      toast.success("Company details updated successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl mx-auto mt-10 flex flex-col gap-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-4">
          <Controller
            name="profileImage"
            control={control}
            render={({ field }) => (
              <UploadBox
                title="Company Logo"
                {...field}
                error={errors.profileImage?.message}
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
                tips={[
                  "Upload official company logo only",
                  "Keep it centered and not stretched",
                  "Prefer transparent background",
                ]}
              />
            )}
          />

          {profileImage?.preview && (
            <Image
              src={profileImage.preview}
              height={64}
              width={64}
              alt="Profile"
              className="rounded-full h-16 w-16"
            />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Controller
            name="bannerImage"
            control={control}
            render={({ field }) => (
              <UploadBox
                title="Company Banner"
                {...field}
                error={errors.bannerImage?.message}
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
                  "Use high-quality branding or culture images",
                  "Keep text/logo in the center area",
                  "Avoid low-quality or stretched images",
                ]}
              />
            )}
          />

          {bannerImage?.preview && (
            <Image
              src={bannerImage.preview}
              height={116}
              width={450}
              alt="Banner"
              className="rounded-lg h-29 w-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7.5">
        <Input
          label="First Name"
          placeholder="First name"
          {...register("firstName", {
            required: "First name is required",
          })}
          error={errors.firstName?.message}
        />

        <Input
          label="Last Name"
          placeholder="Last name"
          {...register("lastName", {
            required: "Last name is required",
          })}
          error={errors.lastName?.message}
        />

        <div>
          <SelectField
            label="Role within the company"
            name="roleWithCompany"
            placeholder="Search"
            options={rolesInCompanyDropdown || []}
            onChange={(val) => setRoleWithCompany(val)}
            error={errors.roleWithCompany?.message}
            rules={{ required: "Role is required" }}
          />
          {roleWithCompany && (
            <button className={`${pillClass()} mt-4 capitalize`}>
              {roleWithCompany.toLowerCase()}
            </button>
          )}
        </div>

        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-4">
              <p className="text-[#CDCECE] font-medium">Gender</p>

              <div className="flex gap-2.5">
                {["MALE", "FEMALE", "PREFER_NOT_TO_SAY"].map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => field.onChange(g)}
                    className={`px-4 py-2 rounded-full border text-sm cursor-pointer capitalize
                    ${
                      field.value === g
                        ? "border-primary text-[#E6E6E6]"
                        : "border-[#434345] text-[#9C9C9D]"
                    }`}
                  >
                    {g.replaceAll("_", " ").toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        />
      </div>

      <div className="flex justify-end">
        <SaveButton isLoading={isSubmitting} type="submit" />
      </div>
    </form>
  );
}
