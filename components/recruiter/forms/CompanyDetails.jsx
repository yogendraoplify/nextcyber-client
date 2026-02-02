"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { SaveButton } from "@/components/ui/SaveButton";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateCompanyApi } from "@/api/companyApi";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errMessage";
import LocationSearchInput from "@/components/helper/LocationSearchInput";

export default function CompanyDetails() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm();

  const { companyProfile } = useSelector((state) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!companyProfile) return;

    const socialMap = {};
    companyProfile.socialLinks?.forEach((item) => {
      socialMap[item.platform.toLowerCase()] = item.url;
    });

    reset({
      companyName: companyProfile.companyName || "",
      companyEmail: companyProfile.companyEmail || "",
      companyWebsiteLink: companyProfile.companyWebsiteLink || "",
      headquarter: companyProfile.headquarter || "",
      founded: companyProfile.founded || "",
      companySize: companyProfile.companySize || "",
      industry: companyProfile.industry || "",

      facebook: socialMap.facebook || "",
      linkedin: socialMap.linkedin || "",
      x: socialMap.twitter || "",
      instagram: socialMap.instagram || "",
      glassdoor: socialMap.glassdoor || "",
    });
  }, [companyProfile, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {};

      if (dirtyFields.companyName) payload.companyName = data.companyName;

      if (dirtyFields.companyEmail) payload.companyEmail = data.companyEmail;

      if (dirtyFields.companyWebsiteLink)
        payload.companyWebsiteLink = data.companyWebsiteLink;

      if (dirtyFields.headquarter) payload.headquarter = data.headquarter;

      if (dirtyFields.founded) payload.founded = data.founded;

      if (dirtyFields.companySize) payload.companySize = data.companySize;

      if (dirtyFields.industry) payload.industry = data.industry;

      const socialLinks = [];

      if (dirtyFields.facebook && data.facebook) {
        socialLinks.push({ platform: "Facebook", url: data.facebook });
      }

      if (dirtyFields.linkedin && data.linkedin) {
        socialLinks.push({ platform: "LinkedIn", url: data.linkedin });
      }

      if (dirtyFields.x && data.x) {
        socialLinks.push({ platform: "Twitter", url: data.x });
      }

      if (dirtyFields.instagram && data.instagram) {
        socialLinks.push({ platform: "Instagram", url: data.instagram });
      }

      if (dirtyFields.glassdoor && data.glassdoor) {
        socialLinks.push({ platform: "Glassdoor", url: data.glassdoor });
      }

      if (socialLinks.length > 0) {
        payload.socialLinks = socialLinks;
      }

      if (Object.keys(payload).length === 0) {
        toast("No changes detected");
        return;
      }

      const { data: res } = await updateCompanyApi(payload);
      toast.success("Company details updated successfully");
      console.log(res);
    } catch (error) {
      toast.error(getErrorMessage(error || "Failed to update company details"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl mx-auto mt-10 flex flex-col gap-y-10"
    >
      <div>
        <h2 className="text-xl font-semibold text-g-100 leading-6 mb-7.5">
          General
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7.5">
          <Input
            label="Company Name"
            placeholder="Enter company name"
            {...register("companyName", {
              required: "Company name is required",
            })}
            error={errors.companyName?.message}
          />

          <Input
            label="Company Email"
            placeholder="Enter company email"
            {...register("companyEmail", {
              required: "Company email is required",
            })}
            error={errors.companyEmail?.message}
          />

          <Input
            label="Company Website Link"
            placeholder="Enter website link"
            {...register("companyWebsiteLink")}
            error={errors.website?.message}
          />

          <div>
            <label className="block mb-2 text-sm font-medium text-g-200">
              Headquarter
            </label>
            <LocationSearchInput
              value={watch("headquarter")}
              setValue={(val) => setValue("headquarter", val, { shouldDirty: true })}
              onPlaceSelected={(place) => {
                const address = `${place.city || ""}, ${place.state || ""}, ${
                  place.country || ""
                }`
                  .replace(/,\s*,/g, ",")
                  .replace(/^\s*,|,\s*$/g, "");
                setValue("headquarter", address, { shouldDirty: true });
              }}
            />
          </div>
          <Input
            label="Founded"
            placeholder="Year"
            {...register("founded")}
            error={errors.founded?.message}
          />

          <Input
            label="Company Size"
            placeholder="Select your company size"
            {...register("companySize")}
            error={errors.companySize?.message}
          />

          <Input
            label="Industry"
            placeholder="Industry"
            {...register("industry")}
            error={errors.industry?.message}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-g-100 leading-6 mb-7.5">
          Social
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7.5">
          <Input
            label="Facebook URL"
            placeholder="Enter Facebook URL"
            {...register("facebook")}
            error={errors.facebook?.message}
          />

          <Input
            label="LinkedIn URL"
            placeholder="Enter LinkedIn URL"
            {...register("linkedin")}
            error={errors.linkedin?.message}
          />

          <Input
            label="X URL"
            placeholder="Enter X URL"
            {...register("x")}
            error={errors.x?.message}
          />

          <Input
            label="Instagram URL"
            placeholder="Enter Instagram URL"
            {...register("instagram")}
            error={errors.instagram?.message}
          />

          <Input
            label="Glassdoor URL"
            placeholder="Enter Glassdoor URL"
            {...register("glassdoor")}
            error={errors.glassdoor?.message}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton isLoading={isSubmitting} type="submit" />
      </div>
    </form>
  );
}
