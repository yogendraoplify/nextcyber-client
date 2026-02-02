"use client";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import Stepper from "@/components/profile/ProfileStepper";
import AccountDetails from "@/components/profile/steps/AccountDetails";
import ProfileForm from "@/components/profile/steps/ProfileForm";
import TechnicalForm from "@/components/profile/steps/TechnicalForm";
import AddEducationModal from "@/components/profile/steps/AddEducationModal";
import AddExperienceModal from "@/components/profile/steps/AddExperienceModal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updateStudentApi } from "@/api/studentApi";
import { useSelector } from "react-redux";

export default function SettingsPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [validatedSteps, setValidatedSteps] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      firstName: "",
      lastName: "",
      location: "",
      currency: "",
      gender: "",
      nationalities: "",
      languages: [],
      expectedSalary: "",
      hourlyRate: "",
      education: [],
      workExperience: [],
      certificates: [],
      skills: [],
      contractType: "",
      remotePolicy: "",
      resume: null,
      profilePicture: null,
      profileBanner: null,
    },
  });

  useEffect(() => {
    if (!user || !user.studentProfile) return;

    const sp = user.studentProfile;

    methods.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      location: sp.location || "",
      currency: sp.currency || "",
      gender: sp.gender || "",
      nationalities: sp.nationalities || [],
      languages: sp.languages || [],
      expectedSalary: sp.expectedSalary || "",
      hourlyRate: sp.hourlyRate || "",

      education: sp.education || [],
      workExperience: sp.workExperience || [],
      resume: sp.resume || null,

      skills: sp.skills || [],
      certificates: sp.certificates || [],
      contractType: sp.contractType || "",
      remotePolicy: sp.remotePolicy || "",

      profilePicture: sp.profilePicture || null,
      profileBanner: sp.profileBanner || null,
    });
  }, [user, methods]);

  const { control, trigger, handleSubmit, getValues, clearErrors } = methods;

  const eduFieldArray = useFieldArray({ control, name: "education" });
  const expFieldArray = useFieldArray({ control, name: "workExperience" });

  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [eduEditIndex, setEduEditIndex] = useState(null);

  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expEditIndex, setExpEditIndex] = useState(null);

  const steps = [
    {
      name: "ACCOUNT",
      fields: [
        "profilePicture",
        "firstName",
        "lastName",
        "location",
        "currency",
        "gender",
        "nationalities",
        "language",
        "expectedSalary",
        "hourlyRate",
      ],
    },
    {
      name: "PROFILE",
      fields: ["resume", "education", "workExperience"],
    },
    {
      name: "TECHNICAL",
      fields: ["contractType", "remotePolicy", "certificates", "skills"],
    },
  ];

  const validateCurrentStep = async () => {
    const fields = steps[step].fields;
    if (fields && fields.length > 0) {
      return await trigger(fields);
    }
    return true;
  };

  const onNext = async () => {
    const isValid = await validateCurrentStep();
    setValidatedSteps((prev) => new Set([...prev, step]));

    if (!isValid) {
      toast.error("Please fill all required fields");
      return;
    }

    setStep((s) => Math.min(steps.length - 1, s + 1));
  };

  const onBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };
  let toastId;
  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    setLoading(true);
    toastId = toast.loading("Updating Profile...");
    try {
      const { data } = await updateStudentApi(formData);
      toast.success("Profile Updated!");
      toast.dismiss(toastId);
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Request Failed. Please Try Again!");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  useEffect(() => {
    clearErrors();
  }, [step, clearErrors]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto">
          <Stepper step={step} onChange={setStep} />

          <div className="rounded-[10px] p-0.5 bg-gradient-to-r from-[#2F3031] to-[#1B1C1E] mt-10">
            <div className="p-10 bg-g-800 rounded-lg">
              {step === 0 && (
                <AccountDetails showErrors={validatedSteps.has(0)} />
              )}

              {step === 1 && (
                <ProfileForm
                  showErrors={validatedSteps.has(1)}
                  educationList={eduFieldArray.fields}
                  onOpenAddEducation={() => {
                    setEduEditIndex(null);
                    setEduModalOpen(true);
                  }}
                  onEditEducation={(idx) => {
                    setEduEditIndex(idx);
                    setEduModalOpen(true);
                  }}
                  onRemoveEducation={eduFieldArray.remove}
                  experienceList={expFieldArray.fields}
                  onOpenAddExperience={() => {
                    setExpEditIndex(null);
                    setExpModalOpen(true);
                  }}
                  onEditExperience={(idx) => {
                    setExpEditIndex(idx);
                    setExpModalOpen(true);
                  }}
                  onRemoveExperience={expFieldArray.remove}
                />
              )}

              {step === 2 && (
                <TechnicalForm showErrors={validatedSteps.has(2)} />
              )}

              <div className="flex justify-end gap-3.5 mt-8">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="px-4 py-3 text-sm font-semibold leading-5 disabled:cursor-not-allowed disabled:text-g-200 bg-g-600 text-white rounded cursor-pointer"
                  >
                    Back
                  </button>
                )}

                
                  <button
                    type="submit"
                    onClick={async () => {
                      setValidatedSteps((prev) => new Set([...prev, step]));

                      const isValid = await validateCurrentStep();
                      if (!isValid) {
                        toast.error("Please fill all required fields");
                        return;
                      }

                      handleSubmit(onSubmit)();
                    }}
                    disabled={loading}
                    className="px-4 py-3 text-sm font-semibold leading-5 disabled:bg-primary/50 disabled:cursor-not-allowed disabled:text-g-200 bg-primary text-white rounded cursor-pointer"
                  >
                    Save Changes
                  </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {eduModalOpen && (
        <AddEducationModal
          isOpen={eduModalOpen}
          onClose={() => setEduModalOpen(false)}
          onSave={(payload) => {
            if (eduEditIndex === null) eduFieldArray.append(payload);
            else eduFieldArray.update(eduEditIndex, payload);
            setEduModalOpen(false);
          }}
          initialData={
            eduEditIndex !== null ? getValues("education")[eduEditIndex] : null
          }
        />
      )}

      {expModalOpen && (
        <AddExperienceModal
          isOpen={expModalOpen}
          onClose={() => setExpModalOpen(false)}
          onSave={(payload) => {
            if (expEditIndex === null) expFieldArray.append(payload);
            else expFieldArray.update(expEditIndex, payload);
            setExpModalOpen(false);
          }}
          initialData={
            expEditIndex !== null
              ? getValues("workExperience")[expEditIndex]
              : null
          }
        />
      )}
    </FormProvider>
  );
}
