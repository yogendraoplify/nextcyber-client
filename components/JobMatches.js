import {
  ArrowUpRight,
  Bookmark,
  Calendar,
  Clock,
  Share2,
  Sparkles,
  Star,
  Zap,
  X,
  Users,
  Receipt,
} from "lucide-react";
import JobCard from "./cards/JobCard";
import { BiDollarCircle } from "react-icons/bi";
import { currencyFormatter, timeFormatter } from "@/helper";
import { useState } from "react";
import Image from "next/image";
import JobApplyModel from "./modal/JobApply";

export default function JobMatches({ data, handleItemClick }) {
  const { matches, overallRecommendation } = data;
  const [jobActive, setJobActive] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [jobActiveData, setJobActiveData] = useState(null);
  const [jobOpen, setJobOpen] = useState(false);
  const [jobId, setJobId] = useState(null);

  const applyJob = (id) => {
    setJobId(id);
    setJobOpen(true);
  };

  return (
    <div className={`${jobActive && "grid grid-cols-3 gap-5 relative"}`}>
      <div
        className={`min-h-[calc(100vh-100.8px)] flex items-center flex-col gap-5 justify-start ${
          jobActive && "col-span-1"
        }`}
      >
        {/* Header */}
        <div className="w-full mx-auto">
          <h1 className="text-3xl font-bold text-white mb-3">
            Job Match Results
          </h1>
          <p className="text-g-200 leading-relaxed">
            {showMore
              ? overallRecommendation
              : overallRecommendation.split(" ").slice(0, 30).join(" ") + "..."}

            {!showMore && (
              <span
                className="ml-2 cursor-pointer text-blue-400 hover:underline"
                onClick={() => setShowMore(true)}
              >
                Show More
              </span>
            )}
            {showMore && (
              <span
                className="ml-2 cursor-pointer text-blue-400 hover:underline"
                onClick={() => setShowMore(false)}
              >
                Show Less
              </span>
            )}
          </p>
        </div>

        {/* Job Cards */}
        <div
          className={`w-full mx-auto grid gap-5 ${
            jobActive ? "grid-cols-1" : "grid-cols-3"
          }`}
        >
          {matches.length > 0 &&
            matches.map((item, i) => (
              <div
                key={i}
                className=" flex flex-col justify-between bg-g-700 rounded-[10px] overflow-hidden shadow-2xl p-5 border border-g-500 hover:border-primary transition-colors h-full"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                      <div className="w-15 h-15 bg-gray-300 rounded-2xl border-2 border-dark-yellow flex-shrink-0"></div>

                      <div>
                        <h2 className="text-white text-md font-bold mb-1 truncate">
                          {item?.job?.company || "Unknown Company"}
                        </h2>
                        <p className="text-gray-400 text-xs truncate">
                          Posted on {timeFormatter(item?.job?.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2.5">
                      <button
                        className="bg-g-400 hover:bg-g-500 p-2 rounded-lg transition-colors cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        <Sparkles size={20} className="text-g-100" />
                      </button>

                      <button className="bg-g-400 hover:bg-g-500 p-2 rounded-lg transition-colors">
                        <Bookmark className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h1 className="text-white text-md font-bold mb-2">
                      {item?.job?.title || "Job Title Here"}
                    </h1>
                    <p className="text-gray-400 text-xs">
                      {item?.job?.location || "Location not specified"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-g-100 bg-g-500 px-3 py-1 rounded text-xs">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300 text-xs font-medium">
                        {item?.job.contractType}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-g-100 bg-g-500 px-3 py-1 rounded text-xs">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300 text-xs font-medium truncate">
                        {item?.job.minWorkExperience}-
                        {item?.job.maxWorkExperience} Years
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-g-100 bg-g-500 px-3 py-1 rounded text-xs">
                      <BiDollarCircle className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-300 text-xs font-medium">
                        {currencyFormatter(item?.job.maxSalary) ??
                          "Not disclosed"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6 text-primary">
                    <div
                      className="flex items-center gap-[6px] bg-gradient-to-r px-3 py-1 rounded"
                      style={{ background: "#CFFFC8" }}
                    >
                      <Star className="w-5 h-5" />
                      <span className="text-xs font-semibold">Featured</span>
                    </div>
                    <div className="flex items-center gap-[6px] bg-gradient-to-r px-3 py-1 rounded bg-[#E8DFFF]">
                      <Zap className="w-5 h-5 text-primary fill-primary" />
                      <span className="text-primary text-xs font-semibold">
                        Urgent
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    className="flex-1 bg-primary text-white font-medium py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer truncate"
                    onClick={() => {
                      // handleItemClick(item);
                      setJobActive(true);
                      setJobActiveData(item.job);
                      setShowMore(false);
                    }}
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                  <button className="bg-primary text-white p-3.5 rounded-lg transition-colors cursor-pointer">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      {jobActive && (
        <div
          className={`h-[calc(100vh-100.8px)] rounded-[10px] border border-g-500  w-full overflow-hidden overflow-y-auto flex sticky top-0 right-0 items-center flex-col gap-5 justify-start hide-scrollbar ${
            jobActive && "col-span-2"
          }`}
        >
          <JobDetailsModal
            selectedJob={jobActiveData}
            onClose={() => {
              setJobActive(false);
              setJobActiveData(null);
            }}
            applyJob={applyJob}
          />
        </div>
      )}
      <JobApplyModel
        id={jobId}
        isOpen={jobOpen}
        onClose={() => {
          setJobOpen(false);
          setJobId(null);
        }}
      />
    </div>
  );
}

function JobDetailsModal({ selectedJob, onClose, applyJob }) {
  return (
    <div className="w-full py-5">
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

      <div className="">
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
                onClick={() => applyJob(selectedJob?.id)}
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
            <div
              dangerouslySetInnerHTML={{ __html: selectedJob?.jobDescription }}
            ></div>
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
