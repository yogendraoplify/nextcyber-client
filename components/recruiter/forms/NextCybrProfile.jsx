"use client";

import { useForm, Controller } from "react-hook-form";
import QuillEditor from "@/components/QuillEditor";
import { Input } from "@/components/ui/Input";
import { SaveButton } from "@/components/ui/SaveButton";
import { updateCompanyApi } from "@/api/companyApi";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errMessage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function NextCybrProfile() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      companyTagline: "",
      about: "",
    },
  });

  const { companyProfile } = useSelector((state) => state.auth.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!companyProfile) return;

    reset({
      companyTagline: companyProfile.companyTagline || "",
      about: companyProfile.about || "",
    });
  }, [companyProfile, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {};

      if (dirtyFields.companyTagline) {
        payload.companyTagline = data.companyTagline;
      }

      if (dirtyFields.about) {
        payload.about = data.about;
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
      className="max-w-5xl mx-auto mt-10 flex flex-col gap-10"
    >
      <Input
        label="Company Tagline"
        placeholder="Enter company tagline"
        {...register("companyTagline", {
          required: "Company tagline is required",
          maxLength: {
            value: 120,
            message: "Tagline cannot exceed 120 characters",
          },
        })}
        error={errors.tagline?.message}
      />

      <div className="flex flex-col">
        <label className="text-sm font-medium text-g-200 mb-1">
          About Company
        </label>

        <Controller
          name="about"
          control={control}
          rules={{
            required: "About company is required",
            validate: (value) =>
              value && value !== "<p><br></p>"
                ? true
                : "About company is required",
          }}
          render={({ field }) => (
            <QuillEditor
              value={field.value}
              onChange={field.onChange}
              placeholder="Enter About.."
            />
          )}
        />

        {errors.about && (
          <p className="text-dark-red text-xs mt-1">{errors.about.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <SaveButton isLoading={isSubmitting} type="submit" />
      </div>
    </form>
  );
}
