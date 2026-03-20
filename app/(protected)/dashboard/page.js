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
  Users,
  CalendarCheck,
  CalendarClock,
  Star,
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
import DashboardNotification from "@/components/dashboard/notification/DashboardNotification";
import Suggestion from "@/components/dashboard/Suggestion";
function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appliedJob } = useSelector((state) => state.jobs);

  const recruiterStat = user?.companyProfile?.stats?.basicStats;
  const mentorStat = user?.mentorProfile?.stats;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  const achievements = [
    { title: "Introduction to Cybersecurity", completedDate: "2024-05-18" },
    { title: "Top Learner", completedDate: "2024-05-18" },
    { title: "National CTF", completedDate: "2024-05-18" },
    { title: "Introduction to Cybersecurity", completedDate: "2024-05-18" },
  ];

  // --- Profile picture / banner helpers ---
  const getProfilePicture = () => {
    if (user.role === "STUDENT")
      return user?.studentProfile?.profilePicture?.url;
    if (user.role === "COMPANY")
      return user?.companyProfile?.profilePicture?.url;
    if (user.role === "MENTOR") return user?.mentorProfile?.profilePicture?.url;
    return null;
  };

  const getProfileBanner = () => {
    if (user.role === "STUDENT")
      return user?.studentProfile?.profileBanner?.url;
    if (user.role === "COMPANY")
      return user?.companyProfile?.profileBanner?.url;
    if (user.role === "MENTOR") return user?.mentorProfile?.profileBanner?.url;
    return null;
  };

  const getProfileScore = () => {
    if (user.role === "STUDENT")
      return user?.studentProfile?.profileScore?.overallPercentage || 0;
    if (user.role === "COMPANY")
      return user?.companyProfile?.profileScore?.overallPercentage || 0;
    if (user.role === "MENTOR")
      return user?.mentorProfile?.profileScore?.overallPercentage || 0;
    return 0;
  };

  // --- Stats per role ---
  const stats = [
    {
      label: "Sessions Completed",
      value: user.studentProfile?.stats?.sessionCompleted || 0,
      link: "view courses",
      href: "#",
      icon: Medal,
    },
    {
      label: <span>Mentors <br /> Engaged</span>,
      value: user.studentProfile?.stats?.mentorsEngaged || 0,
      link: "find mentors",
      href: "/mentorship",
      icon: UserStar,
    },
    {
      label: <span>Jobs <br /> Applied</span>,
      value: user.studentProfile?.stats?.jobsApplied || 0,
      link: "browse jobs",
      href: "/myjobs",
      icon: BriefcaseBusiness,
    },
    {
      label: <span>Skills <br /> Verified</span>,
      value: user.studentProfile?.stats?.skillsVerified || 0,
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
      value: recruiterStat?.pendingApproval || 0,
      link: "take action",
      href: "#",
      icon: BriefcaseBusiness,
    },
    {
      label: "Candidates Hired",
      value: recruiterStat?.candidatesHired || 0,
      link: "view list",
      href: "#",
      icon: FileBadge2,
    },
  ];

  const mentorStats = [
    {
      label: "Active Mentees",
      value: mentorStat?.activeMentees || 0,
      link: "view mentees",
      href: "#",
      icon: Users,
    },
    {
      label: "Sessions Completed",
      value: mentorStat?.sessionsCompleted || 0,
      link: "view history",
      href: "#",
      icon: CalendarCheck,
    },
    {
      label: "Upcoming Sessions",
      value: mentorStat?.upcomingSessions || 0,
      link: "view schedule",
      href: "#",
      icon: CalendarClock,
    },
    {
      label: "Average Rating",
      value: mentorStat?.averageRating || 0,
      link: "view reviews",
      href: "#",
      icon: Star,
    },
  ];

  const getActiveStats = () => {
    if (user.role === "STUDENT") return stats;
    if (user.role === "COMPANY") return recruiterStats;
    if (user.role === "MENTOR") return mentorStats;
    return [];
  };

  useEffect(() => {
    if (user.role === "STUDENT" && appliedJob.length === 0)
      dispatch(asyncGetAppliedJob());
  }, []);

  return (
    <>
      <div className="flex">
        <div className="flex-1 lg:border-r lg:pr-5 border-g-600 overflow-x-hidden">
          {/* Banner & Profile Picture */}
          <div className="rounded-lg overflow-hidden">
            <div className="relative w-full h-[200px]">
              <Image
                src={getProfileBanner() || "/company-banner.jpg"}
                alt="user-banner"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute z-10 -bottom-17 pl-5">
                <Image
                  src={getProfilePicture() || "/user-profile.png"}
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
                  <h2 className="leading-6 font-semibold text-g-100 gap-2 flex items-center">
                    {`${user.firstName} ${user.lastName}`}
                    <button className="text-g-200">
                      <FaLinkedin />
                    </button>
                  </h2>
                  <p className="leading-6 text-g-200 my-2">
                    {user.role === "MENTOR"
                      ? user?.mentorProfile?.domain?.[0] || "Mentor"
                      : "Network Security Engineer"}
                  </p>
                </div>

                <div className="hidden md:flex lg:hidden xl:flex items-center gap-2">
                  {
                  // user.role === "STUDENT" && (
                  //   <button className="py-1 px-2 bg-g-600 border cursor-pointer border-g-500 text-g-200 rounded-full flex items-center gap-2">
                  //     <ArrowDownToLine size={20} />
                  //     <span>Download CV</span>
                  //   </button>
                  // )
                  }
                  {/* <button className="py-1 px-2 bg-g-600 border cursor-pointer border-g-500 text-g-200 rounded-full flex items-center gap-2">
                    <Share2 size={20} />
                    <span>Share Profile</span>
                  </button> */}
                </div>
              </div>

              {/* <div className="flex items-center justify-between gap-2 sm:pl-30 w-full">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-fit py-1 px-2 bg-g-600 border cursor-pointer border-g-500 text-g-200 rounded-full"
                >
                  view profile
                </button>
                <div className="flex items-center gap-2 md:hidden lg:flex xl:hidden">
                  {user.role === "STUDENT" && (
                    <button className="py-1 px-2 bg-g-600 border border-g-500 cursor-pointer text-g-200 rounded-full flex items-center gap-2">
                      <ArrowDownToLine size={20} />
                      <span className="hidden sm:flex lg:hidden xl:flex">
                        Download CV
                      </span>
                    </button>
                  )}
                  <button className="py-1 px-2 bg-g-600 border border-g-500 cursor-pointer text-g-200 rounded-full flex items-center gap-2">
                    <Share2 size={20} />
                    <span className="hidden sm:flex lg:hidden xl:flex">
                      Share Profile
                    </span>
                  </button>
                </div>
              </div> */}
            </div>
          </div>
         
          {/* Stats Grid */}
          <div className="my-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {getActiveStats().map((item, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-b rounded-[10px] from-g-500 to-g-600 p-0.5"
                >
                  <div className="bg-g-600 rounded-lg pb-4 p-2.5 flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="leading-[150%] w-1/2 font-semibold text-g-200">
                        {item.label}
                      </div>
                      <div className="p-1.5 bg-primary text-white rounded">
                        <item.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                      <div className="text-4xl leading-11 font-semibold text-dark-green">
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
              ))}
            </div>
          </div>

          {/* STUDENT-specific sections */}
          {user.role === "STUDENT" && (
            <>
              <ProfileTabs
                openExperienceModal={() => setIsExpModalOpen(true)}
              />
              <div className="bg-gradient-to-b from-g-500 to-g-600 p-0.5 mt-5 rounded-[10px] overflow-hidden">
                <div className="p-5 bg-g-600 rounded-lg">
                  <h4 className="flex text-g-100 font-semibold text-base leading-4 items-center gap-2">
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
                  <div className="mt-7.5">
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
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-b from-g-500 to-g-600 p-0.5 rounded-[10px] overflow-hidden"
                    >
                      <div className="bg-g-600 rounded-lg h-full pb-4 p-2.5 flex flex-col justify-between">
                        <div className="text-sm text-g-200 font-medium leading-4 mb-4">
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
                <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-gradient-to-b from-g-500 to-g-600 p-0.5 rounded-[10px] overflow-hidden">
                    <div className="bg-g-600 rounded-lg pb-4 p-2.5 flex flex-col justify-between">
                      <div className="text-sm text-g-200 font-medium leading-4 mb-4">
                        Introduction to Red Teaming
                      </div>
                      <div className="text-xs leading-4 text-g-200">
                        3/5 modules completed
                      </div>
                      <div className="mt-1.5 relative">
                        <div className="w-full h-4 bg-g-400"></div>
                        <div className="w-[60%] h-4 bg-primary absolute bottom-0"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-g-500 to-g-600 p-0.5 rounded-[10px] overflow-hidden">
                    <div className="bg-g-600 rounded-lg pb-4 p-2.5 flex flex-col justify-between">
                      <div className="text-sm text-g-200 font-medium leading-4 mb-4">
                        Next AI Resume Tip
                      </div>
                      <div className="text-xs leading-4 text-g-200">
                        3/5 modules completed
                      </div>
                      <div className="mt-1.5 relative">
                        <div className="w-full h-4 bg-g-400"></div>
                        <div className="w-[60%] h-4 bg-primary absolute bottom-0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* COMPANY-specific sections */}
          {user.role === "COMPANY" && (
            <>
              <JobsTable />
              <RecruitmentPipeline />
            </>
          )}

          {/* MENTOR-specific sections */}
          {user.role === "MENTOR" && (
            <>
              {/* Skills & Domain */}
              <div className="bg-gradient-to-b from-g-500 to-g-600 p-0.5 mt-5 rounded-[10px] overflow-hidden">
                <div className="p-5 bg-g-600 rounded-lg">
                  <h4 className="flex text-g-100 font-semibold text-base leading-4 items-center gap-2">
                    My Expertise
                    <Info size={14} />
                  </h4>

                  {/* Skills */}
                  <div className="mt-5">
                    <h3 className="text-sm leading-6 font-semibold text-g-100 mb-2.5">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(user?.mentorProfile?.skills || []).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-g-200 leading-4 text-xs rounded-full bg-g-600 border border-g-500"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Domain */}
                  <div className="mt-7.5">
                    <h3 className="text-sm leading-6 font-semibold text-g-100 mb-2.5">
                      Domain
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(user?.mentorProfile?.domain || []).map((d, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-g-200 leading-4 text-xs rounded-full bg-g-600 border border-g-500"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certificates */}
                  <div className="mt-7.5">
                    <h3 className="text-sm leading-6 font-semibold text-g-100 mb-2.5">
                      Certificates
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {(user?.mentorProfile?.certificates || []).map(
                        (cert, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-g-200 leading-4 text-xs rounded-full bg-g-600 border border-g-500"
                          >
                            {cert}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="py-5">
                <h4 className="text-g-100 font-semibold text-base leading-4">
                  Work Experience
                </h4>
                <div className="mt-2.5 flex flex-col gap-3">
                  {(user?.mentorProfile?.workExperience || []).map((exp, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-b from-g-500 to-g-600 p-0.5 rounded-[10px] overflow-hidden"
                    >
                      <div className="bg-g-600 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-semibold text-g-100 leading-4">
                              {exp.jobTitle}
                            </h3>
                            <p className="text-xs text-g-200 mt-1">
                              {exp.companyName}
                            </p>
                          </div>
                          <span className="text-xs text-g-200 whitespace-nowrap">
                            {new Date(exp.startDate).getFullYear()} –{" "}
                            {exp.endDate
                              ? new Date(exp.endDate).getFullYear()
                              : "Present"}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-xs text-g-200 mt-2 leading-5">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="py-5">
                <h4 className="text-g-100 font-semibold text-base leading-4">
                  Education
                </h4>
                <div className="mt-2.5 flex flex-col gap-3">
                  {(user?.mentorProfile?.education || []).map((edu, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-b from-g-500 to-g-600 p-0.5 rounded-[10px] overflow-hidden"
                    >
                      <div className="bg-g-600 rounded-lg p-4 flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-semibold text-g-100 leading-4">
                            {edu.institute}
                          </h3>
                          <p className="text-xs text-g-200 mt-1 capitalize">
                            {edu.level?.toLowerCase()}
                          </p>
                        </div>
                        <span className="text-xs text-g-200 whitespace-nowrap">
                          {new Date(edu.startDate).getFullYear()} –{" "}
                          {edu.endDate
                            ? new Date(edu.endDate).getFullYear()
                            : "Present"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="pl-5 hidden lg:block max-w-85">
          {/* Profile Completion */}
          <div className="px-2.5 pt-2.5 pb-4 bg-g-600 rounded-lg">
            <div className="flex items-center justify-between gap-3 text-g-100">
              <h6 className="font-semibold leading-[150%]">
                Profile Completion
              </h6>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-g-400 px-2 py-1 text-[9px] font-semibold leading-[100%] rounded-full cursor-pointer"
              >
                Suggestions
              </button>
            </div>
            <div className="mt-4 relative">
              <div className="text-right text-g-200 text-xs leading-[150%]">
                {getProfileScore()}%
              </div>
              <div className="w-full h-1.5 bg-g-500"></div>
              <div
                className="h-1.5 bg-primary absolute bottom-0"
                style={{ width: `${getProfileScore()}%` }}
              ></div>
            </div>
          </div>

          <Suggestion />

          {/* Notifications (all roles) */}
         <DashboardNotification />
        </div>
      </div>

      {/* Modals */}
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
            data={
              user?.role === "MENTOR"
                ? user?.mentorProfile?.profileScore
                : user?.studentProfile?.profileScore
            }
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        ))}

      {user && isExpModalOpen && (
        <ExperienceModal
          data={
            user?.role === "MENTOR"
              ? user?.mentorProfile?.workExperience
              : user?.studentProfile?.workExperience
          }
          isOpen={isExpModalOpen}
          onClose={() => setIsExpModalOpen(false)}
        />
      )}
    </>
  );
}

export default DashboardPage;
