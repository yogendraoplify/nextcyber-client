import { Calendar, Clock, Receipt, Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

function JobPreview({ data }) {
  const { companyProfile } = useSelector((state) => state.auth.user);
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-g-800 flex-1 h-fit rounded-[10px]">
      <div className=" border-b border-dashed border-g-400">
        <div className=" flex items-center gap-3">
          <Image
            src={companyProfile?.profilePicture?.url || "/image.png"}
            height={60}
            width={60}
            alt="company-logo"
            className=" rounded-[10px] h-15 w-15 object-cover"
          />
          <h4 className=" font-medium text-xl leading-6 underline decoration-dotted underline-offset-[25%] text-g-100">
            {companyProfile?.companyName}
          </h4>
        </div>
        <div>
          <div className="flex items-center gap-3 text-g-200 font-semibold py-4 text-xs leading-4">
            <div className="flex items-center gap-1.5  ">
              <Clock size={16} />
              <span className=" capitalize">
                {data?.contractType.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-2  ">
              <Users size={16} />
              <span>
                {
                  <span>
                    {`${data?.minWorkExperience}-${data?.maxWorkExperience} Years`}
                  </span>
                }
              </span>
            </div>
            <div className="flex items-center gap-2  ">
              <Receipt size={16} />
              <span>{data?.maxSalary}</span>
            </div>
            <div className="flex items-center gap-2  ">
              <Calendar size={16} />
              <span>Posted on {formatDate(data?.createdAt)}</span>
            </div>
          </div>
          <h2 className=" text-g-200 leading-6 font-medium text-2xl pb-2.5">
            {data?.title}
          </h2>
        </div>
      </div>
      <div className=" mt-7.5">
        <h5 className=" text-g-200 leading-6 font-medium">Job Description</h5>
        <p className=" text-g-300 font-normal leading-6 mt-3">
          {data?.jobDescription}
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
          {data?.certifications &&
            data.certifications.map((certification, i) => (
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
          {data?.skills &&
            data.skills.map((skill, i) => <li key={i}>{skill}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default JobPreview;
