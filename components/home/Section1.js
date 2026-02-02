"use client";
import React, { useState } from "react";

const NextCyberLanding = () => {
  const [activeTab, setActiveTab] = useState("Recruiter");

  return (
    <section className="w-full bg-g-900 relative overflow-hidden">
      <div className="flex flex-col items-center pt-18 relative z-10 px-5 sm:px-10 max-w-[1440px] mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl leading-11 text-accent-color-1 font-semibold">
            <span>The World&apos;s ⚡ Leading Platform</span>
            <br />
            <span>for Cyber Professionals</span>
          </h1>
        </div>

        <div className="w-full max-w-2xl relative">
          <div className=" hidden lg:absolute top-1/2 -left-1/10 w-52 h-64 transform -translate-y-1/2 -translate-x-1/2 -rotate-6 -z-1">
            <div className="w-full h-full bg-g-600 rounded-2xl opacity-80"></div>
          </div>

          <div className="hidden lg:absolute top-1/2 -right-1/10 w-52 h-64 transform -translate-y-1/2 translate-x-1/2 rotate-6 -z-1">
            <div className="w-full h-full bg-g-600 rounded-2xl opacity-80"></div>
          </div>

          <div className="p-10 z-10 bg-gradient-to-b from-g-900 via-g-600 to-g-900 rounded-[40px]">
            <div className="flex items-center justify-start space-x-4 mb-7 text-sm leading-4 font-medium">
              <button
                onClick={() => setActiveTab("Recruiter")}
                className={`px-4 py-2 rounded-full ${
                  activeTab === "Recruiter"
                    ? "bg-primary text-white"
                    : "text-g-200 border bg-g-600 border-g-500"
                }`}
              >
                Recruiter
              </button>
              <button
                onClick={() => setActiveTab("Candidates")}
                className={`px-4 py-2 rounded-full  transition ${
                  activeTab === "Candidates"
                    ? "bg-primary text-white"
                    : "bg-g-600 text-g-200 border border-g-500"
                }`}
              >
                Candidates
              </button>
            </div>

            <div className="mb-7 text-start">
              <p className="text-2xl leading-8 font-normal text-g-200 ">
                <span className="underline decoration-accent-color-1 text-white decoration-2">
                  Hire
                </span>{" "}
                top remote developers
                <br />
                <span className="underline decoration-accent-color-1 text-white decoration-2">
                  faster and smarter
                </span>{" "}
                with the world&apos;s first
                <br />
                <span className="underline decoration-accent-color-1 text-white  decoration-2">
                  AI recruiter
                </span>{" "}
                built to find
                <br />
                elite global engineering talent.
              </p>
            </div>

            <button className="w-full py-2 sm:py-4 px-4 sm:px-8 text-base sm:text-xl leading-6 bg-gradient-to-b from-accent-color-1 to-primary rounded-full text-white font-semibold hover:opacity-90 transition-all duration-300">
              Create your profile
            </button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <img
          src="/landing-page-shades.svg"
          alt="shades"
          className="mx-auto w-full"
        />
      </div>
    </section>
  );
};

export default NextCyberLanding;
