"use client";
import { useFormContext } from "react-hook-form";

export default function Step2() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const hearFrom = watch("hearAboutUs");

  const options = [
    "LinkedIn",
    "Organization",
    "Google Search",
    "Facebook",
    "Friend/colleague",
    "Twitter/X",
    "Employer",
    "Other",
  ];

  return (
    <div className="bg-g-900 flex flex-col min-h-[calc(100vh-204px)] justify-start gap-20 pt-20 items-start px-20">
      <div className="max-w-xl">
        <h2 className="text-4xl font-medium leading-11 tracking-[-1%] text-g-100 mb-[55px] text-center">
          How did you hear about us?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-15 gap-y-10">
          {options.map((option) => (
            <label
              key={option}
              className={`relative flex items-center gap-2 p-4 rounded-[10px] border cursor-pointer transition-all ${
                hearFrom === option
                  ? "border-primary bg-primary/15"
                  : "border-g-500 hover:border-g-400"
              }`}
            >
              <input
                type="radio"
                value={option}
                {...register("hearAboutUs", {
                  required: "Please Select One These!",
                })}
                className="hidden"
              />
              <span
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  hearFrom === option ? "border-primary" : "border-g-500"
                }`}
              >
                {hearFrom === option && (
                  <span className="w-3 h-3 bg-primary rounded-full" />
                )}
              </span>
              <span className="text-base font-medium text-g-200 leading-6">
                {option}
              </span>
            </label>
          ))}
        </div>
        {errors.hearAboutUs && (
          <p className="text-red-500 text-sm mt-2">{errors.hearAboutUs.message}</p>
        )}
      </div>
    </div>
  );
}
