"use client";
import React, { useState } from "react";
import { studentOnboardingApi } from "@/api/studentApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import { Loader2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step4 from "./Step4";
import Step3 from "./Step3";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import Step1LeftSide from "./StepLeftSide";
import { asyncCurrentUser } from "@/store/actions/authActions";

function StudentOnBoarding() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [validatedSteps, setValidatedSteps] = useState(new Set());
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      hearAboutUs: "",
      gender: "",
      nationalities: [],
      location: "",
      languages: [],
      currency: "",
      profilePicture: null,
      contractType: "",
      remotePolicy: "",
      skills: [],
    },
  });

  const [files, setFiles] = useState({
    profilePicture: null,
  });

  const steps = [
    { name: "STEP1", fields: [] },
    { name: "STEP2", fields: ["hearAboutUs"] },
    { name: "STEP3", fields: [] },
    { name: "STEP4", fields: [] },
    { name: "STEP5", fields: [] },
    {
      name: "STEP6",
      fields: ["gender", "nationalities", "location", "languages", "currency"],
    },
    {
      name: "STEP7",
      fields: ["contractType", "remotePolicy", "skills"],
    },
  ];

  const validateCurrentStep = async () => {
    const currentStepFields = steps[activeStep].fields;
    if (currentStepFields && currentStepFields.length > 0) {
      const isValid = await methods.trigger(currentStepFields);
      return isValid;
    }
    return true;
  };

  const goNext = async () => {
    if (activeStep < steps.length - 1) {
      const isValid = await validateCurrentStep();
      setValidatedSteps((prev) => new Set([...prev, activeStep]));

      if (!isValid) {
        toast.error("Please fill in all required fields");
        return;
      }

      setActiveStep((s) => s + 1);
    }
  };

  const goPrev = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
    }
  };

  const handleNextOrSubmit = async () => {
    if (steps[activeStep].name !== "STEP7") {
      await goNext();
    } else {
      setValidatedSteps((prev) => new Set([...prev, activeStep]));
    }
  };

  const handleFinalSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (
        !Array.isArray(value) &&
        value !== undefined &&
        value !== null &&
        key !== "profilePicture"
      ) {
        formData.append(key, value);
      }
    });

    if (data.nationalities && data.nationalities.length > 0) {
      formData.append("nationalities", JSON.stringify(data.nationalities));
    }

    if (data.languages && data.languages.length > 0) {
      formData.append("languages", JSON.stringify(data.languages));
    }

    if (data.skills && data.skills.length > 0) {
      formData.append("skills", JSON.stringify(data.skills));
    }

    if (files.profilePicture) {
      formData.append("profilePicture", files.profilePicture);
    }

    setLoading(true);
    try {
      const { data } = await studentOnboardingApi(formData);
      toast.success("Onboarding completed successfully!");
      dispatch(asyncCurrentUser());
      router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Request Failed. Please Try Again!");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const hasBeenValidated = validatedSteps.has(activeStep);

    switch (steps[activeStep].name) {
      case "STEP1":
        return <Step1 goNext={goNext} />;
      case "STEP2":
        return <Step2 showErrors={hasBeenValidated} />;
      case "STEP3":
        return <Step3 showErrors={hasBeenValidated} />;
      case "STEP4":
        return <Step4 showErrors={hasBeenValidated} />;
      case "STEP5":
        return <Step5 showErrors={hasBeenValidated} />;
      case "STEP6":
        return (
          <Step6
            files={files}
            setFiles={setFiles}
            showErrors={hasBeenValidated}
          />
        );
      case "STEP7":
        return <Step7 showErrors={hasBeenValidated} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-g-900 h-screen overflow-hidden gap-20">
      <div className="flex">
        <div
          className={`w-1/3 bg-primary ${
            ["STEP1", "STEP2"].includes(steps[activeStep].name) ? "" : "bg-img"
          }  overflow-hidden`}
        >
          <Step1LeftSide STEP={steps[activeStep].name} />
        </div>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleFinalSubmit)}
            className="w-2/3 h-screen overflow-y-auto"
          >
            {renderStep()}
            {steps[activeStep].name !== "STEP1" && (
              <div className="flex justify-end w-full px-20 items-center mt-20 gap-5 pb-20">
                {activeStep > 0 && (
                  <button
                    onClick={goPrev}
                    type="button"
                    className="text-g-200 text-sm leading-5 font-medium"
                  >
                    Back
                  </button>
                )}

                <button
                  onClick={(e) => {
                    if (steps[activeStep].name !== "STEP7") {
                      e.preventDefault();
                      handleNextOrSubmit();
                    } else {
                      setValidatedSteps(
                        (prev) => new Set([...prev, activeStep])
                      );
                    }
                  }}
                  type={
                    steps[activeStep].name !== "STEP7" ? "button" : "submit"
                  }
                  disabled={loading}
                  className="px-16 py-3 flex items-center gap-2 rounded bg-primary text-white text-sm leading-5 font-medium disabled:opacity-50"
                >
                  {loading && <Loader2 size={20} className=" animate-spin" />}
                  {steps[activeStep].name !== "STEP7" ? "Next" : "Continue"}
                </button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default StudentOnBoarding;
