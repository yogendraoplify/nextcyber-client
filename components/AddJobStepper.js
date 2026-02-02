"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";

import JobDetails from "./addJob/JobDetails";
import Compensation from "./addJob/Compensation";
import JobDescription from "./addJob/JobDescription";
import WorkReq from "./addJob/WorkReq";
import CandidatePreference from "./addJob/CandidatePref";

import toast from "react-hot-toast";
import instance from "@/utils/axios";
import NoJobsPosted from "./jobs/NoJobsPosted";
import JobPreview from "./jobs/JobPreview";
import { SaveButton } from "./ui/SaveButton";

export default function AddJobStepper() {
  const form = useForm({
    mode: "onChange",
    defaultValues: {
      jobTitle: "",
      jobLocation: "",
      additionalBenefits: [],
      minExperience: "0 year",
      maxExperience: "2 year",
      contractType: [],
      remotePolicy: "ONSITE",
      languages: [],
      qualifications: "",
      genderPreference: "MALE",
      skills: [],
      certifications: [],
      showSalary: false,
      currency: "",
      salaryFrom: "",
      salaryTo: "",
      responsibilities: "",
      requirements: "",
      jobDescription: "",
    },
  });

  const {
    formState: { errors },
    trigger,
    getValues,
  } = form;

  const [previewData, setPreviewData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validatedSteps, setValidatedSteps] = useState(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const router = useRouter();

  const steps = [
    { key: "jobDetails", label: "Job details" },
    { key: "candidatePref", label: "Candidate Preference" },
    { key: "compensation", label: "Compensation" },
    { key: "workReq", label: "Work Requirements" },
    { key: "jobDesc", label: "Job Description" },
    { key: "preview", label: "Preview" },
  ];

  const stepFields = {
    jobDetails: ["jobTitle", "jobLocation", "additionalBenefits"],

    candidatePref: [
      "qualifications",
      "genderPreference",
      "skills",
      "certifications",
    ],

    compensation: ["currency", "salaryFrom", "salaryTo"],

    workReq: [
      "minExperience",
      "maxExperience",
      "languages",
      "contractType",
      "remotePolicy",
    ],

    jobDesc: ["jobDescription"],
  };

  const validateCurrentStep = async () => {
    const key = steps[activeStep].key;
    const fields = stepFields[key] || [];
    if (fields.length === 0) return true;
    return await trigger(fields);
  };
  const goNext = async () => {
    console.log("Next");

    setValidatedSteps((prev) => new Set([...prev, activeStep]));

    const ok = await validateCurrentStep();
    if (!ok) {
      toast.error("Please fill all required fields");
      return;
    }

    if (steps[activeStep + 1]?.key === "preview") {
      const values = getValues();

      const payload = {
        title: values.jobTitle,
        jobDescription: values.jobDescription,
        minWorkExperience: Number(values.minExperience.split(" ")[0]),
        maxWorkExperience: Number(values.maxExperience.split(" ")[0]),
        contractType: values.contractType?.[0]
          ?.toUpperCase()
          .replace(/\s+/g, "_"),
        remotePolicy: values.remotePolicy,
        qualifications: values.qualifications,
        genderPreference: values.genderPreference,
        languageRequired: values.languages,
        minSalary: values.salaryFrom ? Number(values.salaryFrom) : null,
        maxSalary: values.salaryTo ? Number(values.salaryTo) : null,
        currency: values.currency,
        showSalary: values.showSalary,
        skills: values.skills,
        certifications: values.certifications,
        location: values.jobLocation,
        additionalBenefits: values.additionalBenefits,

        createdAt: new Date().toISOString(),
      };

      setPreviewData(payload);
    }

    setActiveStep((p) => p + 1);
  };

  const goPrev = () => {
    if (activeStep > 0) setActiveStep((p) => p - 1);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const toastId = toast.loading("Posting job...");

    try {
      await instance.post("/company/create-job", previewData);

      toast.success("Job created successfully!");
      router.back();
    } catch (err) {
      toast.error("Failed to create job");
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  const renderStep = () => {
    const showErrors = validatedSteps.has(activeStep);
    const props = { form, showErrors };

    switch (steps[activeStep].key) {
      case "jobDetails":
        return <JobDetails {...props} />;

      case "candidatePref":
        return <CandidatePreference {...props} />;

      case "compensation":
        return <Compensation {...props} />;

      case "workReq":
        return <WorkReq {...props} />;

      case "jobDesc":
        return <JobDescription {...props} />;
      case "preview":
        return <JobPreview data={previewData} />;

      default:
        return null;
    }
  };

  return (
    <>
      {!formOpen && <NoJobsPosted onClick={() => setFormOpen(true)} />}
      {formOpen && (
        <FormProvider {...form}>
          <form
            onSubmit={handleFinalSubmit}
            className="w-full h-full text-gray-200"
          >
            <div className="w-full mx-auto relative mt-5">
              <div
                className="absolute top-4 left-0 w-full h-[2px] z-0"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(156,156,157,0) 0%, #9C9C9D 50%, rgba(156,156,157,0) 100%)",
                }}
              />

              <div className="flex items-center justify-between w-full relative z-10 max-w-3xl mx-auto">
                {steps.map((s, i) => (
                  <div
                    key={s.key}
                    className="flex-1 flex flex-col items-center relative z-20"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 transition-all ${
                        i <= activeStep
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-gray-900 border-gray-600 text-gray-400"
                      }`}
                    >
                      {i <= activeStep ? "✔" : i + 1}
                    </div>

                    <div
                      className={`text-xs ${
                        i <= activeStep ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-[640px] mx-auto mt-8 rounded-[10px] p-0.5 bg-gradient-to-r from-[#2F3031] to-[#1B1C1E]">
              <div className="p-10 bg-g-800 rounded-lg">
                {renderStep()}

                <div className="flex justify-between items-center mt-10">
                  <div>
                    {activeStep > 0 && (
                      <button
                        onClick={goPrev}
                        type="button"
                        className="px-4 py-2 border border-g-500 rounded-lg bg-g-600 text-g-200 text-sm cursor-pointer"
                      >
                        Previous
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {activeStep === steps.length - 1 ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            form.reset();
                            setActiveStep(0);
                            setValidatedSteps(new Set());
                          }}
                          className="px-4 py-2 border border-g-500 rounded-lg bg-g-600 text-g-200 text-sm cursor-pointer"
                        >
                          Discard
                        </button>

                        <SaveButton
                          isLoading={loading}
                          type="submit"
                          text="Post Job"
                          loadingText="Posting..."
                        />
                      </>
                    ) : (
                      <button
                        onClick={goNext}
                        type="button"
                        className="px-4 py-2 bg-primary rounded-lg text-sm text-white cursor-pointer"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      )}
    </>
  );
}
