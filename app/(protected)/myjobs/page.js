"use client";
import Pagination from "@/components/Pagination";
import JobDetail from "@/components/student/JobDetail";
import Filter from "@/components/ui/Filter";
import Search from "@/components/ui/Search";
import Table from "@/components/ui/Table";
import { timeFormatter } from "@/helper";
import { asyncGetAppliedJob } from "@/store/actions/jobActions";
import { render } from "@testing-library/react";
import { Loader2, Undo2 } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const { appliedJob } = useSelector((state) => state.jobs);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ type: null, data: null });

  const columns = [
    {
      label: "Job Title",
      key: "jobTitle",
      render: (row) => (
        <span className="text-g-100 underline cursor-pointer" onClick={() => setModal({ type: "jobpreview", data: row?.job })}>
          {row?.job?.title}
        </span>
      ),
    },
    {
      label: "Company Name",
      key: "companyName",
      render: (row) => (
        <span className="text-g-100">{row?.job?.company?.companyName}</span>
      ),
    },
    {
      label: "Application Date",
      key: "appliedDate",
      render: (row) => (
        <span className="text-g-100">{timeFormatter(row?.appliedDate)}</span>
      ),
    },
    {
      label: "Status",
      key: "status",
      render: (row) => (
        <span className="text-g-100">{row?.status?.split("_").join(" ")}</span>
      ),
    },
  ];

  const fetchJobs = () => {
    if (appliedJob.length === 0) {
      setLoading(true);
      dispatch(asyncGetAppliedJob()).then(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (modal.type === "jobpreview") {
    return (
      <div className="z-50 flex items-center justify-center mt-4 max-w-7xl mx-auto">
        <div className="bg-g-800 rounded-lg w-full p-6 relative">
          <button
            onClick={() => setModal({ type: "", data: null })}
            className="h-7 float-end flex items-center gap-2 px-2 py-1 bg-g-600 hover:bg-g-800 rounded-[28px] border border-g-400 transition-colors text-g-100 cursor-pointer"
          >
            <Undo2 className="w-5 h-5" />
            <span className="text-xs">Back</span>
          </button>
          <JobDetail jobId={modal.data?.id} />
        </div>
      </div>
    );
  }
  return (
    <div className="">
      <div className="">
        <div>
          <h1 className="text-2xl font-semibold text-g-100 mb-4">
            My Job Applications
          </h1>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-g-300" size={24} />
          </div>
        ) : (
          <>
            {appliedJob.length > 0 ? (
              <>
                <div className="flex justify-between bg-g-600 p-5">
                  <Search
                    placeholder="Search by job title or ID"
                    value={search}
                    setValue={(val) => {
                      setPage(1);
                      setSearch(val);
                    }}
                  />

                  <Filter
                    placeholder="Status"
                    options={["Open", "Closed", "Draft"]}
                    onChange={(value) => {
                      setPage(1);
                      setStatus(STATUS_MAP[value] || "");
                    }}
                  />
                </div>

                <Table columns={columns} data={appliedJob || []} />
                <Pagination
                  page={page}
                  pageSize={pageSize}
                  totalPages={appliedJob.length}
                  onPageChange={(newPage) => setPage(newPage)}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                />
              </>
            ) : (
              <div className="text-g-100 text-center">
                No job applications found.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
