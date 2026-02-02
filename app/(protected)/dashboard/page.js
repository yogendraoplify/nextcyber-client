"use client";
import {
  ArrowDownToLine,
  Info,
  Share2,
  UserPlus,
  BriefcaseBusiness,
  UserStar,
  FileBadge2,
  Medal,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaLinkedin } from "react-icons/fa6";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import ProfileTabs from "@/components/dashboard/Tabs";
import { useDispatch, useSelector } from "react-redux";
import JobsTable from "@/components/dashboard/JobsTable";
import RecruitmentPipeline from "@/components/dashboard/RecruitmentPipeline";
import { asyncGetAppliedJob } from "@/store/actions/jobActions";
import ProfileScoringModal from "@/components/modal/ProfileScoreModal";
import ExperienceModal from "@/components/modal/ExperienceModal";
import CompanyScoreModel from "@/components/modal/CompanyScoreModel";

function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appliedJob } = useSelector((state) => state.jobs);
  const recruiterStat = user?.companyProfile?.stats?.basicStats;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const achievements = [
    { title: "Introduction to Cybersecurity", completedDate: "2024-05-18" },
    { title: "Top Learner", completedDate: "2024-05-18" },
    { title: "National CTF", completedDate: "2024-05-18" },
    { title: "Introduction to Cybersecurity", completedDate: "2024-05-18" },
  ];
  const stats = [
    {
      label: "Courses Completed",
      value: 12,
      link: "view courses",
      href: "#",
      icon: Medal,
    },
    {
      label: "Mentors Engaged",
      value: 4,
      link: "find mentors",
      href: "#",
      icon: UserStar,
    },
    {
      label: "Jobs Applied",
      value: appliedJob.length,
      link: "browse jobs",
      href: "#",
      icon: BriefcaseBusiness,
    },
    {
      label: "Skills Verified",
      value: 15,
      link: "view courses",
      href: "#",
      icon: FileBadge2,
    },
  ];

  const recruiterStats = [
    {
      label: "Active Jobs",
      value: recruiterStat?.activeJobs || 0,
      link: "view jobs",
      href: "#",
      icon: Medal,
    },
    {
      label: "New Applications",
      value: recruiterStat?.newApplications || 0,
      link: "view applicants",
      href: "#",
      icon: UserStar,
    },
    {
      label: "Pending Approval",
      value: recruiterStat?.pendingApproval,
      link: "take action",
      href: "#",
      icon: BriefcaseBusiness,
    },
    {
      label: "Candidates Hired",
      value: recruiterStat?.candidatesHired,
      link: "view list",
      href: "#",
      icon: FileBadge2,
    },
  ];
  useEffect(() => {
    if (user.role == "STUDENT" && appliedJob == 0)
      dispatch(asyncGetAppliedJob());
  }, []);
  return (
    <>
      <div className=" flex">
        <div className=" flex-1 lg:border-r lg:pr-5 border-g-600 overflow-x-hidden">
          <div className=" rounded-lg overflow-hidden">
            <div className="relative w-full h-[200px]">
              <Image
                src={
                  (user?.role === "COMPANY"
                    ? user?.companyProfile?.profileBanner?.url
                    : user?.studentProfile?.profileBanner?.url) ||
                  "/company-banner.jpg"
                }
                alt="user-banner"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute  z-10 -bottom-17 pl-5">
                <Image
                  src={
                    user.role == "STUDENT"
                      ? user?.studentProfile?.profilePicture?.url
                      : user?.companyProfile?.profilePicture?.url ||
                        "/user-profile.png"
                  }
                  height={100}
                  width={100}
                  alt="user-profile"
                  className="rounded-full object-cover h-25 w-25"
                />
              </div>
            </div>

            <div className="bg-g-600 p-5 relative">
              <div className="pl-30 flex justify-between items-start">
                <div>
                  <h2 className=" leading-6 font-semibold text-g-100 gap-2 flex items-center">
                    {`${user.firstName} ${user.lastName}`}
                    <button className="text-g-200">
                      <FaLinkedin />
                    </button>
                  </h2>
                  <p className=" leading-6 text-g-200 my-2">
                    Network Security Engineer
                  </p>
                </div>

                <div className=" hidden  md:flex lg:hidden xl:flex items-center gap-2">
                  {user.role == "STUDENT" && (
                    <button className=" py-1 px-2 bg-g-600 border cursor-pointer border-g-500 text-g-200 rounded-full flex items-center gap-2">
                      <ArrowDownToLine size={20} />
                      <span className="">Download CV</span>
                    </button>
                  )}
                  <button className=" py-1 px-2 bg-g-600 border cursor-pointer border-g-500 text-g-200 rounded-full flex items-center gap-2">
                    <Share2 size={20} />
                    <span>Share Profile</span>
                  </button>
                </div>
              </div>
              <div className=" flex items-center justify-between gap-2 sm:pl-30 w-full">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className=" w-fit py-1 px-2 bg-g-600 border cursor-pointer border-g-500 text-g-200 rounded-full"
                >
                  view profile
                </button>
                <div className=" flex items-center gap-2 md:hidden lg:flex xl:hidden">
                  <button className=" py-1 px-2 bg-g-600 border border-g-500 cursor-pointer text-g-200 rounded-full flex items-center gap-2">
                    <ArrowDownToLine size={20} />
                    <span className=" hidden sm:flex lg:hidden xl:flex">
                      Download CV
                    </span>
                  </button>
                  <button className=" py-1 px-2 bg-g-600 border border-g-500 cursor-pointer text-g-200 rounded-full flex items-center gap-2">
                    <Share2 size={20} />
                    <span className=" hidden sm:flex lg:hidden xl:flex">
                      Share Profile
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className=" my-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {(user.role == "STUDENT" ? stats : recruiterStats).map(
                (item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-b rounded-[10px] from-g-500 to-g-600 p-0.5"
                  >
                    <div className="bg-g-600 rounded-lg pb-4 p-2.5 flex flex-col justify-between">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className=" leading-[150%] w-1/2 font-semibold text-g-200">
                          {item.label}
                        </div>
                        <div className="p-1.5 bg-primary text-white rounded ">
                          <item.icon className="w-5 h-5 " />
                        </div>
                      </div>

                      {/* Value */}
                      <div className="mt-4 flex justify-between items-end">
                        <div className=" text-4xl leading-11 font-semibold text-dark-green">
                          {item.value}
                        </div>
                        <Link
                          href={item.href}
                          className="mb-1 text-xs leading-4 border-b border-dashed text-g-200"
                        >
                          {item.link}
                        </Link>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
          {user.role == "STUDENT" && (
            <>
              <ProfileTabs
                openExperienceModal={() => setIsExpModalOpen(true)}
              />
              <div className="bg-gradient-to-b from-g-500 to-g-600 p-0.5 mt-5 rounded-[10px] overflow-hidden">
                <div className=" p-5 bg-g-600 rounded-lg">
                  <h4 className=" flex text-g-100 font-semibold text-base leading-4 items-center gap-2">
                    AI Powered Suggestions
                    <Info size={14} />
                  </h4>
                  <div>
                    <h3 className="text-sm mt-5 leading-6 font-semibold text-g-100 mb-2.5">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-g-200 leading-4 text-xs rounded-full bg-g-600 border border-g-500">
                        Azure
                      </span>
                      <span className="px-2 py-1 text-g-200 leading-4 text-xs rounded-full bg-g-600 border border-g-500">
                        Security Auditing
                      </span>
                      <span className="px-2 py-1 text-g-200 leading-4 text-xs rounded-full bg-g-600 border border-g-500">
                        Penetration Testing
                      </span>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className=" mt-7.5">
                    <h3 className="text-sm leading-6 font-semibold text-g-100 mb-2.5">
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-g-200 leading-4 text-xs rounded-full bg-g-600 border border-g-500">
                        CompTIA+
                      </span>
                      <span className="px-2 py-1 text-g-200 leading-4 text-xs rounded-full bg-g-600 border border-g-500">
                        Certified Ethical Hacker (CEH)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-5">
                <h4 className="text-g-100 font-semibold text-base leading-4">
                  Milestones Showcase
                </h4>
                <div className=" mt-2.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className=" bg-gradient-to-b from-g-500 to-g-600 p-0.5 rounded-[10px] overflow-hidden"
                    >
                      <div className="bg-g-600 rounded-lg h-full pb-4 p-2.5 flex flex-col justify-between">
                        <div className="text-sm text-g-200 font-medium  leading-4 mb-4">
                          {ach.title}
                        </div>
                        <div className="text-xs leading-4 text-g-200">
                          completed: {ach.completedDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="py-5">
                <h4 className="text-g-100 font-semibold text-base leading-4">
                  Active Engagement
                </h4>
                <div className=" mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-gradient-to-b from-g-500 to-g-600 p-0.5 rounded-[10px] overflow-hidden">
                    <div className="bg-g-600 rounded-lg pb-4 p-2.5 flex flex-col justify-between">
                      <div className="text-sm text-g-200 font-medium  leading-4 mb-4">
                        Introduction to Red Teaming
                      </div>
                      <div className="text-xs leading-4 text-g-200">
                        3/5 modules completed
                      </div>
                      <div className="mt-1.5 relative">
                        <div className=" w-full h-4 bg-g-400"></div>
                        <div className=" w-[60%] h-4 bg-primary absolute bottom-0"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-g-500 to-g-600 p-0.5 rounded-[10px] overflow-hidden">
                    <div className="bg-g-600 rounded-lg pb-4 p-2.5 flex flex-col justify-between">
                      <div className="text-sm text-g-200 font-medium  leading-4 mb-4">
                        Next AI Resume Tip
                      </div>
                      <div className="text-xs leading-4 text-g-200">
                        3/5 modules completed
                      </div>
                      <div className="mt-1.5 relative">
                        <div className=" w-full h-4 bg-g-400"></div>
                        <div className=" w-[60%] h-4 bg-primary absolute bottom-0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {user.role == "COMPANY" && (
            <>
              <JobsTable />
              <RecruitmentPipeline />
            </>
          )}
        </div>
        <div className="pl-5 hidden lg:block">
          <div className=" px-2.5 pt-2.5 pb-4 bg-g-600 rounded-lg">
            <div className=" flex items-center justify-between gap-3 text-g-100">
              <h6 className="  font-semibold leading-[150%]">
                Profile Completion
              </h6>
              <button
                onClick={() => setIsModalOpen(true)}
                className=" bg-g-400 px-2 py-1 text-[9px] font-semibold leading-[100%] rounded-full cursor-pointer"
              >
                Suggestions
              </button>
            </div>
            <div className="mt-4 relative">
              <div className=" text-right text-g-200 text-xs leading-[150%]">
                {user.role == "COMPANY"
                  ? user.companyProfile.profileScore.overallPercentage
                  : user.studentProfile.profileScore.overallPercentage || 0}
                %
              </div>
              <div className=" w-full h-1.5 bg-g-500"></div>
              <div
                className="h-1.5 bg-primary absolute bottom-0"
                style={{
                  width: `${
                    user.role == "COMPANY"
                      ? user.companyProfile.profileScore.overallPercentage
                      : user.studentProfile.profileScore.overallPercentage || 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {user.role == "COMPANY" && (
            <div className=" p-2.5 pb-4 bg-gradient-to-b from-g-600 to-[#434345] mt-3.5 rounded-lg border border-g-500">
              <h6 className="font-semibold leading-6 text-g-100 max-w-3xs">
                AI Job Seeker Profile Suggestions
              </h6>
              <div className=" flex flex-col gap-4 mt-4">
                <div className=" flex gap-2 items-center">
                  <Image
                    src={"/avatar.jpeg"}
                    height={40}
                    width={40}
                    alt="mentor-avatar"
                    className=" rounded-full h-10 w-10 object-cover"
                  />
                  <div>
                    <h3 className=" text-sm font-semibold leading-4 text-g-100">
                      Steve Smith
                    </h3>
                    <p className=" text-g-200 font-normal leading-4 text-xs">
                      Penetration Testing
                    </p>
                  </div>
                </div>
                <div className=" flex gap-2 items-center">
                  <Image
                    src={"/avatar.jpeg"}
                    height={40}
                    width={40}
                    alt="mentor-avatar"
                    className=" rounded-full h-10 w-10 object-cover"
                  />
                  <div>
                    <h3 className=" text-sm font-semibold leading-4 text-g-100">
                      Nathan Astle
                    </h3>
                    <p className=" text-g-200 font-normal leading-4 text-xs">
                      Penetration Testing
                    </p>
                  </div>
                </div>
                <button className=" text-white text-sm leading-4 bg-primary px-4 py-2 rounded-lg flex items-center gap-2 justify-center">
                  <UserPlus size={20} />
                  Connect with Job Seeker
                </button>
              </div>
            </div>
          )}

          {user.role == "STUDENT" && (
            <>
              <div className=" p-2.5 pb-4 bg-gradient-to-b from-g-600 to-[#434345] mt-3.5 rounded-lg border border-g-500">
                <h6 className="font-semibold leading-6 text-g-100">
                  Mentor Suggestions
                </h6>
                <div className=" flex flex-col gap-4 mt-4">
                  <div className=" flex gap-2 items-center">
                    <Image
                      src={"/avatar.jpeg"}
                      height={40}
                      width={40}
                      alt="mentor-avatar"
                      className=" rounded-full h-10 w-10 object-cover"
                    />
                    <div>
                      <h3 className=" text-sm font-semibold leading-4 text-g-100">
                        Steve Smith
                      </h3>
                      <p className=" text-g-200 font-normal leading-4 text-xs">
                        Penetration Testing
                      </p>
                    </div>
                  </div>
                  <div className=" flex gap-2 items-center">
                    <Image
                      src={"/avatar.jpeg"}
                      height={40}
                      width={40}
                      alt="mentor-avatar"
                      className=" rounded-full h-10 w-10 object-cover"
                    />
                    <div>
                      <h3 className=" text-sm font-semibold leading-4 text-g-100">
                        Nathan Astle
                      </h3>
                      <p className=" text-g-200 font-normal leading-4 text-xs">
                        Penetration Testing
                      </p>
                    </div>
                  </div>
                  <button className=" text-white text-sm leading-4 bg-primary px-4 py-2 rounded-lg flex items-center gap-2 justify-center">
                    <UserPlus size={20} />
                    Connect with Mentors
                  </button>
                </div>
              </div>

              <div className=" p-2.5 pb-4 bg-gradient-to-b from-g-600 to-[#434345] mt-3.5 rounded-lg border border-g-500">
                <div className=" h-40 relative w-full">
                  <Image
                    src={"/certification-image.png"}
                    className="object-cover"
                    fill
                    priority
                    alt="certification-image"
                  />
                  <h4 className=" absolute top-2.5 bg-white py-1.5 px-2 text-g-300 text-xs font-medium leading-4">
                    Certification
                  </h4>
                </div>
                <h5 className=" mt-7.5 text-sm font-medium leading-4 text-white max-w-3xs">
                  Certified Information Systems Security Professional (CISSP)
                </h5>
                <button className=" text-white text-sm leading-4 mt-5 w-full bg-primary px-4 py-2 rounded-lg">
                  Enroll Now
                </button>
              </div>
            </>
          )}
          <div className=" p-2.5 pb-4 bg-g-600 mt-3.5 rounded-lg border border-g-500">
            <h4 className=" text-g-100 font-semibold leading-6 text-base">
              Notifications
            </h4>
            <div className=" mt-2.5 gap-2.5 flex flex-col">
              <div className=" flex gap-2 items-start  max-w-3/4">
                <BadgeCheck size={18} className=" text-accent-color-1" />
                <div className=" text-g-100 leading-[150%] text-xs space-y-1">
                  <p>You earned the ‘Bugs Bounty champ’ badge!</p>
                  <span className=" text-g-200 text-xs leading-4">
                    2hrs ago
                  </span>
                </div>
              </div>
              <div className=" flex gap-2 items-start  max-w-3/4">
                <BadgeCheck size={18} className=" text-accent-color-1" />
                <div className=" text-g-100 leading-[150%] text-xs space-y-1">
                  <p>You earned the ‘Bugs Bounty champ’ badge!</p>
                  <span className=" text-g-200 text-xs leading-4">
                    2hrs ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen &&
        user &&
        (user?.role === "COMPANY" ? (
          <CompanyScoreModel
            profileScore={user?.companyProfile?.profileScore}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        ) : (
          <ProfileScoringModal
            data={user?.studentProfile?.profileScore}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        ))}
      {user && isExpModalOpen && (
        <ExperienceModal
          data={user?.studentProfile?.workExperience}
          isOpen={isExpModalOpen}
          onClose={() => setIsExpModalOpen(false)}
        />
      )}
    </>
  );
}

export default DashboardPage;
