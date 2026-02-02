"use client";

import JobMatches from "@/components/JobMatches";
import { asyncGetJobsByAI } from "@/store/actions/jobActions";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function JobMatchesPage() {
  const dispatch = useDispatch();

  const { jobsByAI } = useSelector((state) => state.jobs);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [item, setItem] = useState(null);

  const fetchJobs = useCallback(() => {
    setLoading(true);
    dispatch(asyncGetJobsByAI()).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  const scoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 65) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleItemClick = (item) => {
    setItem(item);
    setModal(true);
  };

  /* -------------------- LOADING STATE -------------------- */
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-100.8px)] flex items-center flex-col justify-center">
        <div className="relative">
          <div className="w-16 h-16"></div>
          <div className="w-16 h-16 border-4 border-primary rounded-full animate-spin border-t-white absolute top-0 left-0"></div>
        </div>
        <p className="mt-5 text-g-200 font-medium text-sm">
          Please wait! Analyzing jobs with our NextGen AI
        </p>
      </div>
    );
  }

  /* -------------------- EMPTY STATE -------------------- */
  if (!jobsByAI || !jobsByAI?.matches?.length) {
    return (
      <div className="min-h-[calc(100vh-100.8px)] flex items-center flex-col gap-5 justify-center">
        <div className="text-center">
          <h2 className="text-g-100 text-xl font-semibold">
            No job matches found
          </h2>
          <p className=" text-g-200 font-medium text-sm">
            Try updating your profile or preferences.
          </p>
        </div>
      </div>
    );
  }

  /* -------------------- SUCCESS STATE -------------------- */
  return (
    <>
      <JobMatches data={jobsByAI} handleItemClick={handleItemClick} />
      {modal && item && (
        <section
          className="fixed top-0 left-0 w-full h-screen z-[100000] bg-[#43434599] flex items-center justify-center"
          onClick={() => setModal(false)}
        >
          <div
            className="bg-[#121826] border w-[80%] mx-auto border-[#1F2937] rounded-xl p-6 hover:border-indigo-500 transition"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Row */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {item.job.title}
                </h2>
                <p className="text-gray-400 text-sm">
                  {item.job.company} • {item.job.location}
                </p>
              </div>

              <div
                className={`text-white px-4 py-2 rounded-full text-sm font-bold ${scoreColor(
                  item.matchScore
                )}`}
              >
                {item.matchScore}% Match
              </div>
            </div>
            {/* Reason */}
            <p className="text-gray-300 mb-5">{item.matchReason}</p>
            {/* Strengths & Gaps */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-green-400 font-semibold mb-2">Strengths</h3>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  {item.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-red-400 font-semibold mb-2">Gaps</h3>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  {item.gaps.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Criteria Bars */}
            <div>
              <h3 className="text-indigo-400 font-semibold mb-3">
                Match Breakdown
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(item.matchedCriteria).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1 text-gray-400">
                      <span className="capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span>{value}%</span>
                    </div>
                    <div className="w-full bg-[#1F2937] rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Footer */}
            <div className="mt-6 text-sm text-gray-400 flex flex-wrap gap-4">
              <span>Contract: {item.job.contractType}</span>
              <span>Remote: {item.job.remotePolicy}</span>
              <span>Salary: {item.job.salary ?? "Not disclosed"}</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
