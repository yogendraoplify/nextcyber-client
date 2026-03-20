"use client";
import { getJobByIdRecruiterApi, getJobByIdStudentApi } from "@/api/jobApi";
import { Calendar, Clock, Receipt, Users } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import QuillContentViewer from "../QuillContentViewer";

function JobDetail({ jobId }) {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchJobDetails = async () => {
    // Implement API call to fetch job details using jobId
    try {
      setLoading(true);
      // Simulate API call delay
      const { data } = await getJobByIdStudentApi(jobId);
      console.log("Fetched Job Details:", data);
      setJobDetails(data);
      setLoading(false);
    } catch (error) {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  // if loading show skeleton loader
  if (loading) {
    return (
      <div className="bg-g-800 flex-1 h-fit rounded-[10px] p-4 mt-5 animate-pulse">
        <div className=" border-b border-dashed border-g-400">
          <div className=" flex items-center gap-3">
            <div className="rounded-[10px] h-15 w-15 bg-g-600" />
            <div className="h-5 w-1/4 bg-g-600 rounded" />
          </div>
          <div className="flex items-center gap-3 text-g-200 font-semibold py-4 text-xs leading-4">
            <div className="flex items-center gap-1.5  ">
              <Clock size={16} />
              <span className=" capitalize">Loading...</span>
            </div>
          </div>
          <div className="h-6 w-1/3 bg-g-600 rounded" />
        </div>
        <div className=" mt-7.5">
          <div className="h-4 w-1/4 bg-g-600 rounded" />
          <div className="h-3 w-full bg-g-600 rounded mt-2" />
          <div className="h-3 w-full bg-g-600 rounded mt-1" />
          <div className="h-3 w-5/6 bg-g-600 rounded mt-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-g-800 flex-1 h-fit rounded-[10px] p-4 mt-5">
      <div className=" border-b border-dashed border-g-400">
        <div className=" flex items-center gap-3">
          <Image
            src={jobDetails?.company?.profilePicture?.url || "/image.png"}
            height={60}
            width={60}
            alt="company-logo"
            className=" rounded-[10px] h-15 w-15 object-cover"
          />
          <h4 className=" font-medium text-xl leading-6 underline decoration-dotted underline-offset-[25%] text-g-100">
            {jobDetails?.company?.companyName}
          </h4>
        </div>
        <div>
          <div className="flex items-center gap-3 text-g-200 font-semibold py-4 text-xs leading-4">
            <div className="flex items-center gap-1.5  ">
              <Clock size={16} />
              <span className=" capitalize">
                {jobDetails?.contractType?.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-2  ">
              <Users size={16} />
              <span>
                {
                  <span>
                    {`${jobDetails?.minWorkExperience}-${jobDetails?.maxWorkExperience} Years`}
                  </span>
                }
              </span>
            </div>
            <div className="flex items-center gap-2  ">
              <Receipt size={16} />
              <span>{jobDetails?.maxSalary}</span>
            </div>
            <div className="flex items-center gap-2  ">
              <Calendar size={16} />
              <span>Posted on {formatDate(jobDetails?.createdAt)}</span>
            </div>
          </div>
          <h2 className=" text-g-200 leading-6 font-medium text-2xl pb-2.5">
            {jobDetails?.title}
          </h2>
        </div>
      </div>
      <div className=" mt-7.5">
        <h5 className=" text-g-200 leading-6 font-medium">Job Description</h5>
        <p className=" text-g-300 font-normal leading-6 mt-3">
          <QuillContentViewer html={jobDetails?.jobDescription} />
        </p>
      </div>
      <div className="mt-7.5">
        <h5 className="text-g-200 leading-6 font-medium ">
          Key Responsibilities
        </h5>
        <ul className=" text-g-300 font-normal leading-6 mt-3 list-disc pl-5">
          <li>Assist with security monitoring and incident triage.</li>
          <li>Participate in vulnerability scanning and patching.</li>
          <li>Help create security awareness materials.</li>
          <li>Document security procedure and policies.</li>
        </ul>
      </div>
      <div className=" mt-7.5">
        <h5 className=" text-g-200 leading-6 font-medium">Certifications</h5>
        <div className="flex gap-2 items-center mt-3  text-g-200 text-xs  leading-4 font-medium">
          {jobDetails?.certifications &&
            jobDetails.certifications.map((certification, i) => (
              <div
                key={i}
                className="py-1 px-2 bg-g-600 border border-g-500 rounded-full"
              >
                {certification}
              </div>
            ))}
        </div>
      </div>
      <div className="mt-7.5">
        <h5 className="text-g-200 leading-6 font-medium ">Required Skills</h5>
        <ul className=" text-g-300 font-normal leading-6 mt-3 list-disc pl-5">
          {jobDetails?.skills &&
            jobDetails.skills.map((skill, i) => <li key={i}>{skill}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default JobDetail;
