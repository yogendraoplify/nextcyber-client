import { timeFormatter } from "@/helper";
import {
  X,
  Clock,
  Calendar,
  Users,
  Receipt,
  Bookmark,
  Share2,
} from "lucide-react";
import Image from "next/image";
import JobApplyModel from "./JobApply";

export default function JobDetailsModal({ selectedJob, onClose, applyJob }) {
  return (
    <div className="sm:block bg-g-800 sticky py-4 flex-1 h-fit rounded-[10px] border border-g-500 overflow-x-hidden">
      <div>
        <h1 className="text-g-100 text-2xl font-semibold mb-4 px-5 break-words">
          {selectedJob?.title}
        </h1>
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="bg-dark-red rounded-full p-2 text-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-247px)] overflow-y-auto">
        <div className="px-5 mt-6 border-g-400">
          <div className="sm:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={selectedJob?.company?.profilePicture?.url || "/image.png"}
                height={60}
                width={60}
                alt="company-logo"
                className=" rounded-[10px] h-15 w-15 object-cover bg-g-600"
              />
              <h4 className=" font-medium text-lg leading-6 underline decoration-dotted underline-offset-[25%] text-g-100">
                {selectedJob?.company?.companyName}
              </h4>
            </div>

            <div className="flex gap-2 items-center">
              <button className="border border-g-400 p-2 rounded-lg cursor-pointer">
                <Bookmark size={20} className=" text-g-300 " />
              </button>
              <button className="border border-g-400 p-2 rounded-lg cursor-pointer">
                <Share2 size={20} className=" text-g-300" />
              </button>
              <button
                onClick={() =>{
                  applyJob(selectedJob.id)}}
                className="bg-primary text-g-100 px-4 py-2 rounded-lg float-right font-medium cursor-pointer truncate"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        <div className="h-12 my-4 px-5 bg-[#DBF9FF] text-primary">
          <div className="flex items-center gap-3  font-semibold py-4 text-xs leading-4 overflow-auto hide-scrollbar">
            <div className="flex items-center gap-1.5  ">
              <Clock size={16} />
              <span className=" capitalize">
                {selectedJob?.contractType.toLowerCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span className="truncate">
                {
                  <span>
                    {`${selectedJob?.minWorkExperience}-${selectedJob?.maxWorkExperience} Years`}
                  </span>
                }
              </span>
            </div>
            <div className="flex items-center gap-2  ">
              <Receipt size={16} />
              <span className="truncate">{selectedJob?.maxSalary}</span>
            </div>
            <div className="flex items-center gap-2  ">
              <Calendar size={16} />
              <span className="truncate">
                Posted on {timeFormatter(selectedJob?.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 mt-5">
          <h5 className=" text-g-100 leading-6 font-medium">Job Description</h5>
          <div className=" text-g-200 font-normal leading-6 mt-3">
           <div dangerouslySetInnerHTML={{ __html: selectedJob?.jobDescription }}></div>
          </div>
        </div>
        <div className="px-5 mt-7.5">
          <h5 className="text-g-100 leading-6 font-medium ">
            Key Responsibilities
          </h5>
          <ul className=" text-g-200 font-normal leading-6 mt-3 list-disc pl-5">
            <li>Assist with security monitoring and incident triage.</li>
            <li>Participate in vulnerability scanning and patching.</li>
            <li>Help create security awareness materials.</li>
            <li>Document security procedure and policies.</li>
          </ul>
        </div>
        <div className="px-5 mt-7.5">
          <h5 className=" text-g-100 leading-6 font-medium">Certifications</h5>
          <div className="flex gap-2 items-center mt-3  text-g-200 text-xs  leading-4 font-medium">
            {selectedJob?.certifications &&
              selectedJob.certifications.map((certification, i) => (
                <div
                  key={i}
                  className="py-1 px-2 bg-primary text-g-100 border border-g-500 rounded-full"
                >
                  {certification}
                </div>
              ))}
          </div>
        </div>
        <div className="px-5 mt-7.5">
          <h5 className="text-g-100 leading-6 font-medium ">Required Skills</h5>
          <ul className=" text-g-200 font-normal leading-6 mt-3 list-disc pl-5">
            {selectedJob?.skills &&
              selectedJob.skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
