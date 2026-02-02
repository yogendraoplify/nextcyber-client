"use client";
import Pagination from "@/components/Pagination";
import Filter from "@/components/ui/Filter";
import Search from "@/components/ui/Search";
import Table from "@/components/ui/Table";
import { timeFormatter } from "@/helper";
import { asyncGetAppliedJob } from "@/store/actions/jobActions";
import { render } from "@testing-library/react";
import { Loader2 } from "lucide-react";
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

  const columns = [
    {
      label: "Job Title",
      key: "jobTitle",
      render: (row) => <span>{row?.job?.title}</span>,
    },
    {
      label: "Company Name",
      key: "companyName",
      render: (row) => <span>{row?.job?.company?.companyName}</span>,
    },
    {
      label: "Application Date",
      key: "appliedDate",
      render: (row) => <span>{timeFormatter(row?.appliedDate)}</span>,
    },
    { label: "Status", key: "status", render: (row) => <span>{row?.status?.split("_").join(" ")}</span> },
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
