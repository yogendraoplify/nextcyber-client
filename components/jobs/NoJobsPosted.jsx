"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function NoJobsPosted({ onClick }) {
    const { jobs } = useSelector((state) => state.jobs);

  return (
    <div className="flex flex-col items-center gap-6  mx-auto mt-15">
      <Image
        src={"/resumeframe.jpg"}
        height={400}
        width={400}
        alt="resume-frame"
        className="rounded-primary"
      />

      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-2xl font-medium text-accent-color-1">
         {jobs.length > 0 ? `Post a Job` : "No Jobs Posted"}
        </h2>
        <p className="text-sm text-g-200 max-w-[420px]">
          Post your first job today and take the first step toward building a
          strong, future-ready team.
        </p>
      </div>

      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer bg-primary border border-g-500 text-white text-sm font-medium"
        onClick={onClick}
      >
        <Plus size={18} />
        Post a Job
      </button>
    </div>
  );
}

