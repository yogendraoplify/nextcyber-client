import Link from "next/link";
import React from "react";

function Section1() {
  return (
    <div className="relative bg-g-900 pb-50 pt-35 overflow-hidden">
      {/* Background Ellipse */}
      <img
        src="/jobseeker/jobseeker-bg.svg"
        alt="jobseeker-bg"
        className="absolute top-0 left-1/2 -translate-x-1/2 z-0 w-full h-auto 2xl:h-4/5"
      />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center flex-col text-center">
        <h2 className="text-sm leading-5 tracking-[4%] font-semibold text-g-300">
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
          AI Powered Resumes <br />
          that lands you dream job
        </h3>

        <p className="mt-5 max-w-2xl text-center text-g-100 text-base font-medium leading-6">
          Upload your resume and let our NextGen AI Resume Builder craft a
          standout version, designed to catch recruiters&apos; attention and
          help you land the job.
        </p>

        <Link
          href={"/auth/signup"}
          className="bg-primary text-white text-xl leading-6 font-medium py-4 px-8 rounded-lg mt-12"
        >
          Sign me up!
        </Link>
      </div>
    </div>
  );
}

export default Section1;
