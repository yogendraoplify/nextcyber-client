"use client";

import AddJobStepper from "@/components/AddJobStepper";
import JobsTable from "@/components/jobs/JobsTable";
import { asyncGetCreatedJobs } from "@/store/actions/jobActions";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddNewJob = () => {
  const [activeTab, setActiveTab] = useState("jobList");
  const isFirstLoad = useRef(true);
  const dispatch = useDispatch();
  const { jobs } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;

      if (jobs.length > 0) return;
    }

    if (jobs?.length === 0) {
      dispatch(asyncGetCreatedJobs({}, () => {}));
    }
  }, [dispatch]);

  return (
    <section>
      <div className="max-w-[1440px] mx-auto">
        <div className=" flex justify-end">
          <JobsTabs active={activeTab} onChange={setActiveTab} />
        </div>
        {activeTab === "postJob" && <AddJobStepper isJobAvailable={true} />}
        {activeTab === "jobList" && <JobsTable />}
      </div>
    </section>
  );
};

export default AddNewJob;

function JobsTabs({ active, onChange }) {
  const tabs = [
    { key: "postJob", label: "Post a Job" },
    { key: "jobList", label: "Jobs Posted" },
  ];

  return (
    <div className="flex items-center gap-1 p-2 bg-g-700 border border-g-500 rounded-full w-fit">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition cursor-pointer
              ${
                isActive
                  ? "bg-primary text-g-50"
                  : "text-g-200 hover:text-[#CDCECE]"
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
