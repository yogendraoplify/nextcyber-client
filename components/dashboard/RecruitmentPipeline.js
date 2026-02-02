"use client";
import React from "react";
import { useSelector } from "react-redux";

function RecruitmentPipeline() {
  const { user } = useSelector((state) => state.auth);
  const recruiterStat = user?.companyProfile?.stats?.recruitmentPipeline;
  const stats = [
    {
      key: "New Applications",
      value: recruiterStat.newApplications || 0,
    },
    {
      key: "Shortlisted",
      value: recruiterStat.shortlisted || 0,
    },
    {
      key: "Interviewing",
      value: recruiterStat.interviewing || 0,
    },
    {
      key: "Offer Sent",
      value: recruiterStat.offerSent || 0,
    },
    {
      key: "Hired",
      value: recruiterStat.hired || 0,
    },
  ];
  return (
    <div className="bg-gradient-to-b from-g-500 to-g-600 p-0.5 rounded-[10px] overflow-hidden mt-4">
      <div className="bg-g-600 rounded-lg overflow-hidden p-5">
        <h3 className=" text-g-100 text-base font-semibold leading-6 mt-2.5">
          Recruitment Pipeline
        </h3>
        <p className=" text-g-200 leading-5 font-normal mt-1.5 text-sm">
          Overview of your hiring stages.
        </p>
        <div className="mt-7.5 flex gap-15 flex-wrap">
          {stats.map((stat) => (
            <div key={stat.key}>
              <h5 className="text-g-200 leading-5 font-medium mb-3 text-sm">
                {stat.key}
              </h5>
              <span className=" text-dark-green text-2xl leading-8 font-semibold">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecruitmentPipeline;
