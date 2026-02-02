import Link from "next/link";
import React from "react";

function Section1() {
  return (
    <div className="relative bg-g-900 pb-50 pt-35 overflow-hidden">
      <img
        src="/recruiter/organization-bg.svg"
        alt="jobseeker-bg"
        className="absolute top-2/5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-full"
      />
      <div className="flex relative items-center justify-center flex-col text-center">
        <h2 className="text-sm relative leading-5 tracking-[4%] font-semibold text-g-300 z-10">
          TRUSTED BY THOUSANDS OF JOB SEEKERS!
        </h2>

        <div className="flex justify-center items-center space-x-[-12px] mt-5">
          {[
            "/f973c36387c1964a5d500a6135787979811536fc.png",
            "/331ac9fed4e1e571263828548de37125a7df3a17.png",
            "/0cac5db297fb65c7894aabf960b291d105e2ec2a.png",
            "/ddac95768bb700e0748dde332c279b2d8f2c7a19.png",
            "/83e704b3a4b31c190fcf5c0150e6763209b76f80.png",
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`User ${i + 1}`}
              className="w-13 h-13 rounded-full border-2 border-[#F7F7F7] object-cover"
            />
          ))}
        </div>

        <h3 className="text-accent-color-1 text-5xl leading-14 tracking-[-2%] font-semibold text-center mt-8">
          Hire Cyber Expert <br /> 3X Faster
        </h3>

        <p className="mt-5 max-w-2xl text-center text-g-100 text-base font-medium leading-6">
          Leverage the advanced capabilities of artificial intelligence to hire
          top-tier cybersecurity experts who are perfectly aligned with your
          organization{"’"}s security objectives.
        </p>

        <Link
          href={"/auth/signup"}
          className="bg-primary text-white text-xl leading-6 font-medium py-4 px-8 rounded-lg mt-12"
        >
          Let’s go!
        </Link>
      </div>
    </div>
  );
}

export default Section1;
