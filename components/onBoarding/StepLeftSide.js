import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

function Step1LeftSide({ STEP }) {
  const { user } = useSelector((state) => state.auth);

  const team = [
    {
      name: "Alex Smith",
      role: "Security Engineer",
      img: "/avatar.jpeg",
      bg: "bg-[#FDD6D6]",
    },
    {
      name: "Shai Hope",
      role: "Security Engineer",
      img: "/avatar.jpeg",
      bg: "bg-[#FCEFCB]",
    },
    {
      name: "Nathan Astle",
      role: "Security Engineer",
      img: "/avatar.jpeg",
      bg: "bg-[#E8F1F9]",
    },
  ];
  return (
    <div
      className={`h-full w-full flex flex-col ${
        STEP == "STEP1" || STEP == "STEP2"
          ? "justify-between"
          : " justify-center items-center"
      }`}
    >
      {STEP == "STEP1" || STEP == "STEP2" ? (
        <>
          <Image
            src={"/onboarding/top-half-circle-shades.svg"}
            width={304}
            height={304}
            alt="top-half-circle-shades"
            className="mx-auto"
          />
          <div className=" overflow-x-hidden ">
            <div className=" flex flex-col items-center">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={32}
                    className="fill-dark-yellow text-dark-yellow"
                  />
                ))}
              </div>
              <p className=" mt-4 max-w-sm text-2xl text-center leading-8 font-medium text-white">
                Trusted by thousands of job seekers!
              </p>
            </div>

            <div className="space-y-5 mt-15">
              {/* Row 1 - Scroll Left */}
              <div className="scroll-left hide-scrollbar">
                {[...team, ...team].map((member, i) => (
                  <div
                    key={`row1-${i}`}
                    className="flex items-center gap-5 bg-g-600 p-3 rounded-[10px] w-fit pr-10"
                  >
                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center ${member.bg}`}
                    >
                      <Image
                        src={member.img}
                        alt={member.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        onLoad={(event) => {
                          const img = event.target;
                          img.style.opacity = 1;
                        }}
                        loader={({ src }) => src}
                        loading="eager"
                      />
                    </div>

                    {/* Info */}
                    <div>
                      <div className="inline-block bg-[#03C3EC4D] text-dark-blue text-[10px] font-semibold leading-3.5 px-2 py-1 rounded mb-1">
                        {member.role}
                      </div>
                      <h3 className="text-g-100 text-sm leading-5 font-semibold">
                        {member.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2 - Scroll Right */}
              <div className="scroll-right hide-scrollbar">
                {[...team, ...team].map((member, i) => (
                  <div
                    key={`row2-${i}`}
                    className="flex items-center gap-5 bg-g-600 p-3 rounded-[10px] w-fit pr-10"
                  >
                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center ${member.bg}`}
                    >
                      <Image
                        src={member.img}
                        alt={member.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* Info */}
                    <div>
                      <div className="inline-block bg-[#03C3EC4D] text-dark-blue text-[10px] font-semibold leading-3.5 px-2 py-1 rounded mb-1">
                        {member.role}
                      </div>
                      <h3 className="text-g-100 text-sm leading-5 font-semibold">
                        {member.name}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Image
            src={"/onboarding/bottom-half-circle-shades.svg"}
            width={304}
            height={304}
            alt="top-half-circle-shades"
            className="mx-auto"
          />
        </>
      ) : (
        <>
          {STEP === "STEP6" && user.role == "recruiter" && (
            <h4 className="max-w-xs text-accent-color-1 text-2xl font-bold leading-8">
              Save cost and Accelerate Hiring. Find Job Seekers in Record Time —
              <span className="text-white"> 3X Faster</span>
            </h4>
          )}
          {STEP === "STEP6" && user.role == "candidate" && (
            <h4 className="max-w-xs text-accent-color-1 text-2xl font-bold leading-8 mb-7.5">
              Browse Thousands of{" "}
              <span className="text-white">Cybersecurity Jobs </span>
              Daily, Connect on Your Terms
            </h4>
          )}
          {STEP === "STEP7" && user.role == "candidate" && (
            <h4 className="max-w-xs text-accent-color-1 text-2xl font-bold leading-8 mb-7.5">
              A thorough, <span className="text-white">tailored analysis</span>{" "}
              of each section from start to finish.
            </h4>
          )}
          {(STEP == "STEP3" ||
            STEP == "STEP4" ||
            STEP == "STEP5" ||
            STEP == "STEP6" ||
            STEP == "STEP7") && (
            <Image
              src={
                STEP == "STEP3"
                  ? user.role == "candidate"
                    ? "/onboarding/ai-powered-resumes.svg"
                    : "/onboarding/recruiter-step-3.svg"
                  : STEP == "STEP4"
                  ? user.role == "candidate"
                    ? "/onboarding/personalized-roadmap.svg"
                    : "/onboarding/recruiter-step-4.svg"
                  : STEP == "STEP5"
                  ? user.role == "candidate"
                    ? "/onboarding/showcase-wins.svg"
                    : "/onboarding/recruiter-step-5.svg"
                  : STEP == "STEP6"
                  ? user.role == "recruiter"
                    ? "/onboarding/recruiter-info-1.svg"
                    : "/onboarding/onboarding-job-post.svg"
                  : STEP == "STEP7" && "/onboarding/jobseeker-step-2.svg"
              }
              height={
                STEP == "STEP3"
                  ? user.role == "candidate"
                    ? 574
                    : 422.23
                  : STEP == "STEP4"
                  ? user.role == "candidate"
                    ? 429.32
                    : 425
                  : 434
              }
              width={
                STEP == "STEP3"
                  ? user.role == "candidate"
                    ? 262
                    : 348
                  : STEP == "STEP4"
                  ? user.role == "candidate"
                    ? 416.1
                    : 359
                  : 405
              }
              alt={`${STEP}-image`}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Step1LeftSide;
