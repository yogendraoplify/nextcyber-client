"use client";

import { BriefcaseBusiness, EyeIcon, Loader2, Undo2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncGetJobApplicants,
  asyncUpdateApplicationStatus,
} from "@/store/actions/jobActions";
import Link from "next/link";
import Table from "@/components/ui/Table";
import Pagination from "@/components/Pagination";
import Search from "@/components/ui/Search";
import { useParams } from "next/navigation";

const STATUS_STYLES = {
  APPLIED: "bg-g-50 text-g-400!",
  INVITED: "bg-[#16A600]",
  SHORTLISTED: "bg-[#FFAB00]",
  INTERVIEW_SCHEDULED: "bg-[#0066FF]",
  INTERVIEWED: "bg-[#7846EF]",
  HIRED: "bg-[#16A600]",
  REJECTED: "bg-[#FF3B30]",
};

const tabs = [
  { label: "Applied", value: "APPLIED", count: 0, active: true },
  { label: "Shortlisted", value: "SHORTLISTED", count: 0, active: false },
  {
    label: "Invited to Interview",
    value: "INTERVIEW_SCHEDULED",
    count: 0,
    active: false,
  },
  { label: "Rejected", value: "REJECTED", count: 0, active: false },
  { label: "Hired", value: "HIRED", count: 0, active: false },
];

function JobDetailsHeader({ status, setStatus }) {
  return (
    <div className="text-100">
      {/* Header Section */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Job Details</h1>
          <button className="py-1 px-2 bg-g-200 hover:bg-g-300 text-100 text-xs rounded transition-colors">
            View Job
          </button>
        </div>
        <Link
          href="/add-new-job"
          className="h-7 flex items-center gap-2 px-2 py-1 bg-g-600 hover:bg-g-800 rounded-[28px] border border-g-400 transition-colors text-g-100"
        >
          <Undo2 className="w-5 h-5" />
          <span className="text-xs">Back</span>
        </Link>
      </div>

      {/* Tabs Section */}
      <div className="flex items-center gap-0 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`flex items-center gap-2 px-5 py-2 whitespace-nowrap transition-colors relative ${
              tab.value === status
                ? "text-white"
                : "text-g-200 hover:text-g-300"
            }`}
            onClick={() => setStatus(tab.value)}
          >
            <span className="text-sm font-medium">{tab.label}</span>
            <span
              className={`flex items-center justify-center w-8 h-6 rounded-full text-xs font-semibold ${
                tab.value === status
                  ? "bg-light-blue text-primary"
                  : "bg-primary text-white"
              }`}
            >
              {tab.count}
            </span>
            {tab.value === status && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("APPLIED");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { applications, totalApplicationsPages } = useSelector(
    (state) => state.jobs
  );
  const isFirstLoad = useRef(true);
  const { id } = useParams();

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;

      if (applications?.length > 0) return;
    }

    dispatch(
      asyncGetJobApplicants(
        {
          id,
          page,
          limit: pageSize,
          status: status?.toUpperCase() ?? "",
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

  const updateApplicationStatus = (applicationId, newStatus) => {
    // Dispatch an action to update the application status
    dispatch(asyncUpdateApplicationStatus(applicationId, newStatus));
  };

  const columns = [
    {
      label: "Job ID",
      key: "id",
      render: (row) => (
        <span className="underline cursor-pointer">
          {row.jobId.slice(0, 4).toUpperCase()}
        </span>
      ),
    },
    {
      label: "Job Title",
      key: "title",
      render: (row) => <span className="">{row?.job?.title}</span>,
    },
    {
      label: "Applicant Name",
      key: "applicantName",
      render: (row) => (
        <span className="">
          {row?.student?.user?.firstName} {row?.student?.user?.lastName}
        </span>
      ),
    },
    {
      label: "Applied On",
      key: "appliedDate",
      render: (row) => formatDate(row.appliedDate),
    },
    {
      label: "Status",
      key: "status",
      render: (row) => {
        const [showDropdown, setShowDropdown] = useState(false);
        return (
          <div>
            <span
              onClick={() => setShowDropdown(!showDropdown)}
              className={`inline-flex px-3 py-1 text-xs text-white rounded-full ${
                STATUS_STYLES[row.status]
              }`}
            >
              {row?.status?.split("_")?.join(" ")}
            </span>
            {showDropdown && (
              <div className="absolute mt-1 bg-g-700 border border-g-500 rounded shadow-lg z-10">
                {[
                  { label: "SHORTLISTED", value: "SHORTLISTED" },
                  { label: "INTERVIEW", value: "INTERVIEW_SCHEDULED" },

                  { label: "HIRED", value: "HIRED" },
                  { label: "REJECTED", value: "REJECTED" },
                ].map((stat) => (
                  <div
                    key={stat.value}
                    onClick={() => {
                      setShowDropdown(false);
                      updateApplicationStatus(row.id, stat.value);
                    }}
                    className="px-4 py-2 hover:bg-g-600 cursor-pointer"
                  >
                    <span
                      className={`inline-flex px-3 py-1 text-xs text-white rounded-full ${
                        STATUS_STYLES[stat.value]
                      }`}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
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
    <div>
      <JobDetailsHeader status={status} setStatus={setStatus} />
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
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
          </div>
        ) : applications?.length > 0 ? (
          <Table columns={columns} data={applications} />
        ) : (
          <NotFound />
        )}

        <Pagination
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalPages={totalApplicationsPages}
        />
      </div>
    </div>
  );
}
