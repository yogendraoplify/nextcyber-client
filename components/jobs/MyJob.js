"use client";
import React, { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetAppliedJob } from "@/store/actions/jobActions";

const statusColors = {
  "In Review": "bg-dark-yellow",
  APPLIED: "bg-dark-green",
  Rejected: "bg-dark-red",
};

export default function JobTable() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { appliedJob } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (appliedJob == 0) dispatch(asyncGetAppliedJob());
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentJobs = appliedJob.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(appliedJob.length / itemsPerPage);

  return (
    <div className="border border-g-500 rounded-[10px] bg-g-900 flex flex-col overflow-hidden">
      {/* Header: Search + Filter */}
      <div className="flex justify-between items-center p-5 gap-5">
        <div className="relative w-2xs flex gap-2 items-center rounded-lg bg-g-700 border border-g-600 px-5 h-[52px]">
          <Search size={20} className="text-g-300" />
          <input
            type="text"
            placeholder="Search by company name"
            className="w-full placeholder:text-g-300 outline-none placeholder:text-sm"
          />
        </div>

        <div className="relative text-g-300 rounded-lg bg-g-700 border border-g-600 overflow-hidden">
          <select className="outline-none appearance-none text-sm leading-5 bg-g-700 w-full pl-5 pr-10 h-[52px] cursor-pointer  font-normal">
            {["", "In Review", "Accepted", "Rejected"].map((status) => (
              <option key={status} value={status}>
                {status || "All"}
              </option>
            ))}
          </select>
          <span className=" ml-4"></span>

          <div className="absolute inset-y-0 right-5 flex items-center">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar flex-1">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className=" bg-g-600 font-medium whitespace-nowrap text-sm leading-5 text-g-200 ">
              <th className="py-3 pr-2 pl-5 border-x-0 border border-g-500">
                Job Title
              </th>
              <th className="py-3 pr-2 pl-5 border border-g-500">Company</th>
              <th className="py-3 pr-2 pl-5 border-x-0 border border-g-500">
                Job Type
              </th>
              <th className="py-3 pr-2 pl-5 border border-g-500">
                Remote Policy
              </th>
              <th className="py-3 pr-2 pl-5 border-x-0 border border-g-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {currentJobs.map((job, i) => (
              <tr
                key={job.id}
                className="border-g-500 text-g-300 whitespace-nowrap bg-g-700 text-sm leading-5 font-medium"
              >
                <td
                  className={`py-3 pr-2 pl-5 cursor-pointer ${
                    currentJobs.length - 1 === i ? "" : "border-b border-g-500"
                  }`}
                >
                  <span className={`border-b border-dotted`}>
                    {job.job.title}
                  </span>
                </td>
                <td
                  className={`py-3 pr-2 pl-5 cursor-pointer ${
                    currentJobs.length - 1 === i ? "" : "border-b border-g-500"
                  }`}
                >
                  <span className="border-b border-dotted">
                    {job?.job?.company?.companyName}
                  </span>
                </td>
                <td
                  className={`py-3 pr-2 pl-5 ${
                    currentJobs.length - 1 === i ? "" : "border-b border-g-500"
                  }`}
                >
                  {job.job.contractType}
                </td>
                <td
                  className={`py-3 pr-2 pl-5 ${
                    currentJobs.length - 1 === i ? "" : "border-b border-g-500"
                  }`}
                >
                  {job.job.remotePolicy}
                </td>
                <td
                  className={`py-3 pr-2 pl-5 ${
                    currentJobs.length - 1 === i ? "" : "border-b border-g-500"
                  }`}
                >
                  <span
                    className={`px-2 py-1 rounded-full text-xs leading-4 text-white font-medium ${
                      statusColors[job.status]
                    }`}
                  >
                    {job?.status?.split("_").join(" ")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-5 py-3 bg-g-900 text-sm">
        {/* Rows per page */}

        <div className="flex items-center gap-3">
          <span className="text-g-200 text-sm leading-5">Rows per page</span>
          <div className="relative border border-g-500 text-g-200 rounded-md overflow-hidden">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="outline-none appearance-none w-full bg-g-900 pl-2 pr-4 py-1.5 cursor-pointertext-sm text-text-secondary font-normal"
            >
              {[5, 10, 20].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <span className=" ml-4"></span>

            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <ChevronDown size={16} className=" text-text-secondary" />
            </div>
          </div>
        </div>

        {/* Page navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className={`${
              currentPage === 1
                ? "text-g-400 cursor-not-allowed"
                : "text-text cursor-pointer text-g-200"
            } text-sm leading-5`}
          >
            <ChevronLeft size={20} />
          </button>
          <p className="text-g-200">
            {currentPage} of {totalPages}
          </p>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className={`${
              currentPage === totalPages
                ? "text-g-400 cursor-not-allowed"
                : "text-text cursor-pointer text-g-200"
            } text-sm leading-5`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
