"use client";
import { getCompanyProfileApi } from "@/api/companyApi";
import JobCard from "@/components/cards/JobCard";
import JobApplyModel from "@/components/modal/JobApply";
import { asyncGetAppliedJob } from "@/store/actions/jobActions";
import { Building2, Globe } from "lucide-react";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function CompanyDetailPage({ params }) {
  const { id } = use(params);
  const dispatch = useDispatch();
  const [company, setCompany] = useState(null);
  const [jobOpen, setJobOpen] = useState(false);
  const [jobId, setJobId] = useState(null);
  const { jobs } = useSelector((state) => state.jobs);
  const { appliedJob } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user.role == "STUDENT" && appliedJob == 0)
      dispatch(asyncGetAppliedJob());
  }, []);

  const getCompany = async () => {
    try {
      const { data } = await getCompanyProfileApi(id);
      console.log(data.company);
      setCompany(data.company);
    } catch (error) {
      console.log(error);
    }
  };
  const applyJob = async (id) => {
    setJobId(id);
    setJobOpen(true);
  };

  useEffect(() => {
    getCompany();
  }, []);
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div className=" rounded-lg overflow-hidden">
        <div className="relative w-full h-[200px]">
          <Image
            src="/company-banner.jpg"
            alt="company-banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="bg-g-600 p-5 relative">
          <div className="flex items-center gap-5">
            <Image
              src={company?.profilePicture?.url || "/company-logo.jpg"}
              height={100}
              width={100}
              alt="company-logo"
              className="rounded-[10px]"
            />
            <div>
              <h2 className=" text-2xl leading-8 font-semibold text-g-100">
                {company?.companyName}
              </h2>
              <h3 className="text-g-200">{company?.headquarter}</h3>
            </div>
          </div>
          <div className=" mt-5">
            <div className=" flex items-center gap-16">
              <div className=" flex gap-2 items-center text-g-200">
                <div
                  className=" flex gap-2 items-center text-g-200 p-5 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(180deg, #2F3031 0%, #1B1C1E 100%)",
                    boxShadow: "0px -1px 1.2px 0.35px #111214 inset",
                    boxShadow: "0px 0.5px 1px 0px #FFFFFF26 inset",
                    boxShadow: "0px 2px 4px -1px #0C0D0F",
                    boxShadow: "0px 0px 0px 1px #2F3031",
                  }}
                >
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-g-200 text-sm">Sector</h2>

                  <span className="text-lg text-g-100">5000+</span>
                </div>
              </div>
              <div className=" flex gap-2 items-center text-g-200">
                <div
                  className=" flex gap-2 items-center text-g-200 p-5 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(180deg, #2F3031 0%, #1B1C1E 100%)",
                    boxShadow: "0px -1px 1.2px 0.35px #111214 inset",
                    boxShadow: "0px 0.5px 1px 0px #FFFFFF26 inset",
                    boxShadow: "0px 2px 4px -1px #0C0D0F",
                    boxShadow: "0px 0px 0px 1px #2F3031",
                  }}
                >
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-g-200 text-sm">Company Size</h2>

                  <span className="text-lg text-g-100">5000+</span>
                </div>
              </div>

              {company?.companyWebsiteLink && (
                <div className=" flex gap-2 items-center text-g-200">
                  <div
                    className=" flex gap-2 items-center text-g-200 p-5 rounded-lg"
                    style={{
                      background:
                        "linear-gradient(180deg, #2F3031 0%, #1B1C1E 100%)",
                      boxShadow: "0px -1px 1.2px 0.35px #111214 inset",
                      boxShadow: "0px 0.5px 1px 0px #FFFFFF26 inset",
                      boxShadow: "0px 2px 4px -1px #0C0D0F",
                      boxShadow: "0px 0px 0px 1px #2F3031",
                    }}
                  >
                    <Globe size={20} />
                  </div>
                  <div>
                    <h2 className="text-g-200 text-sm">Website</h2>
                    <span className="text-lg text-g-100">
                      {company?.companyWebsiteLink}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className=" mt-10">
            <h2 className=" text-lg leading-[100%] font-semibold text-g-100">
              Overview
            </h2>
            <p className=" mt-2.5 text-base leading-6 text-g-300">
              EY exists to build a better working world, helping create
              long-term value for clients, people and society and build trust in
              the capital markets. Enabled by data and technology, diverse EY
              teams in over 150 countries provide trust through assurance and
              help clients grow, transform and operate. Working across
              assurance, consulting, law, strategy, tax and transactions, EY
              teams ask better questions to find new answers for the complex
              issues facing our world today. Find out more about the EY global
              network http://ey.com/en_gl/legal-statement
            </p>
          </div>
        </div>
      </div>

      <div className=" mt-10">
        <h3 className=" font-semibold text-lg leading-[100%] text-g-200">
          Latest Job Posted
        </h3>
        <div className="mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {jobs &&
              jobs.map((job) => (
                <JobCard job={job} key={job.id} applyJob={applyJob} />
              ))}
          </div>
        </div>
      </div>
      <div className=" text-center">
        <button className=" text-g-200 leading-6 text-base font-medium bg-g-600 border border-g-500 px-6 py-3 mt-10 rounded-full">
          {jobs.length > 0 ? "View more jobs" : "No more jobs"}
        </button>
      </div>
      <JobApplyModel
        id={jobId}
        isOpen={jobOpen}
        onClose={() => {
          setJobOpen(false);
          setJobId(null);
        }}
      />
    </>
  );
}

export default CompanyDetailPage;
