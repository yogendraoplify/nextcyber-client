"use client";

import { BriefcaseBusiness, EyeIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Filter from "../ui/Filter";
import Search from "../ui/Search";
import Table from "../ui/Table";
import Pagination from "../Pagination";
import { useDispatch, useSelector } from "react-redux";
import { asyncGetCreatedJobs } from "@/store/actions/jobActions";
import Link from "next/link";

const STATUS_STYLES = {
  ACTIVE: "bg-[#16A600]",
  CLOSED: "bg-[#DB0000]",
  DRAFT: "bg-[#FFAB00]",
};

const STATUS_MAP = {
  Open: "ACTIVE",
  Closed: "CLOSED",
  Draft: "DRAFT",
};

export default function JobsTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { jobs, totalJobsPages } = useSelector((state) => state.jobs);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;

      if (jobs.length > 0) return;
    }

    dispatch(
      asyncGetCreatedJobs(
        {
          page,
          limit: pageSize,
          status,
          search,
        },
        setLoading
      )
    );
  }, [page, pageSize, status, search, dispatch]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const columns = [
    {
      label: "Job Title",
      key: "title",
      render: (row) => (
        <span className="underline cursor-pointer">{row.title}</span>
      ),
    },
    {
      label: "Job ID",
      key: "id",
      render: (row) => (
        <span className="underline cursor-pointer">
          {row.id.slice(0, 4).toUpperCase()}
        </span>
      ),
    },
    {
      label: "Posted On",
      key: "createdAt",
      render: (row) => formatDate(row.createdAt),
    },
    {
      label: "Location",
      key: "location",
    },
    {
      label: "Remote Policy",
      key: "remotePolicy",
    },
    {
      label: "Status",
      key: "status",
      render: (row) => (
        <span
          className={`inline-flex px-3 py-1 text-xs text-white rounded-full ${
            STATUS_STYLES[row.status]
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      label: "Applicants",
      key: "applicantCount",
      render: (row) => <Link href={`/jobs/${row.id}`}><EyeIcon /></Link>,
    }
  ];

  const NotFound = () => (
    <div className="py-17.5 flex flex-col items-center justify-center ">
      <BriefcaseBusiness size={60} className="text-g-200" />
      <p className="mt-5 font-medium text-sm leading-5 text-g-200">
        No job listings have been created by your organization.
      </p>
    </div>
  );

  return (
    <div className="rounded-primary mt-5 mx-auto overflow-hidden border border-g-500">
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

      <Table
        columns={columns}
        data={jobs}
        NotFound={NotFound}
        maxHeight="calc(100vh - 297.33px)"
        loading={loading}
      />

      <Pagination
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalJobsPages}
      />
    </div>
  );
}
