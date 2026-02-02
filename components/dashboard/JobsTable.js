"use client";
import { companyjobApi } from "@/api/jobApi";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, MessageSquareMore, Star } from "lucide-react";
import Link from "next/link";

function JobsTable() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const getJob = async () => {
      try {
        const { data } = await companyjobApi();
        setJobs(data.data.jobs || []);
      } catch (error) {
        console.log("Error fetching jobs:", error);
      }
    };
    getJob();
  }, []);

  const statusColors = {
    Active: "bg-dark-green",
    Inactive: "bg-dark-red",
  };

  const jobsWithApplications = jobs.filter(
    (job) => job.jobApplications?.length > 0
  );

  return (
    <div className="bg-gradient-to-b from-g-500 to-g-600 p-0.5 rounded-primary overflow-hidden">
      <div className="bg-g-600 rounded-lg overflow-hidden p-5">
        <div className="flex justify-between">
          <div>
            <h4 className="text-g-100 text-base leading-6 font-semibold mb-1.5">
              Recent Applications
            </h4>
            <p className="text-sm font-normal leading-5 text-g-200">
              List of candidates who applied for the job.
            </p>
          </div>
          <Link href="/add-new-job" className="text-g-200 text-sm font-medium leading-5 bg-g-600 rounded-full border border-g-500 py-2 px-4 h-fit cursor-pointer">
            View all
          </Link>
        </div>

        <table className="w-full text-left overflow-hidden mt-5">
          <thead>
            <tr className="bg-g-600 font-medium whitespace-nowrap text-sm leading-5 text-g-200">
              <th className="py-2.5 pr-2.5">Candidate</th>
              <th className="py-2.5 pr-2.5">Applied For</th>
              <th className="py-2.5 pr-2.5">Date</th>
              <th className="py-2.5 pr-2.5">Status</th>
              <th className="py-2.5 pr-2.5">Action</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="text-center py-4 text-g-200 rounded-lg border border-g-500">
                    No jobs found.
                  </div>
                </td>
              </tr>
            ) : jobsWithApplications.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="text-center py-4 text-g-200 rounded-lg border border-g-500">
                    No recent applications found.
                  </div>
                </td>
              </tr>
            ) : (
              jobsWithApplications.map((job, i) =>
                job.jobApplications.map((application, j) => {
                  const student = application.student;
                  const user = student?.user;

                  return (
                    <tr
                      key={application.id}
                      className="text-g-300 whitespace-nowrap text-sm leading-5 font-medium"
                    >
                      {/* Candidate */}
                      <td className="py-2.5 pr-2.5 flex items-center gap-2.5">
                        <Image
                          src={student?.profilePicture?.url || "/avatar.jpeg"}
                          alt={user?.firstName || "Candidate"}
                          width={32}
                          height={32}
                          className="rounded-full h-8 w-8 object-cover"
                        />
                        <span>
                          {user?.firstName} {user?.lastName}
                        </span>
                      </td>

                      {/* Applied For */}
                      <td className="py-2.5 pr-2.5">
                        <span>{job.title}</span>
                      </td>

                      {/* Date */}
                      <td className="py-2.5 pr-2.5">
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 pr-2.5">
                        <span
                          className={`px-2 py-1 rounded-full text-xs leading-4 text-white font-medium bg-dark-green`}
                        >
                          {application.status.split("_").join(" ")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className={`py-2.5 pr-2.5 ${
                          jobsWithApplications.length - 1 === i &&
                          job.jobApplications.length - 1 === j
                            ? ""
                            : "border-b border-g-500"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 text-g-200">
                          <button>
                            <Star size={20} />
                          </button>
                          <Link href={`/messages?user=${student.userId}`}>
                            <MessageSquareMore size={20} />
                          </Link>
                          <button>
                            <ArrowUpRight size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JobsTable;
