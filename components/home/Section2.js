"use client";
import React from "react";
import {
  Clock,
  DollarSign,
  MapPin,
  Users,
  Star,
  Zap,
  Briefcase,
  Bookmark,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import JobCard from "../cards/JobCard";

const CybersecurityJobBoard = () => {
  const companies = [
    "/polarwise.png",
    "/amiri.png",
    "/ciele.png",
    "/larq.png",
    "/y-combinator.svg",
    "/greenhouse.svg",
  ];

  const jobs = [
    {
      id: "3b465df4-993c-496a-b176-c36b1335dcbd",
      title: "Penetration Tester",
      location: "Pune",
      additionalBenefits: ["cab service", "food coupons"],
      skills: ["Python"],
      certifications: ["PenTest+"],
      qualifications: "BACHELORS",
      genderPreference: "PREFER_NOT_TO_SAY",
      showSalary: true,
      currency: "INR",
      minSalary: 80000,
      maxSalary: 12000,
      minWorkExperience: 2,
      maxWorkExperience: 3,
      contractType: "PERMANENT",
      remotePolicy: "ONSITE",
      languageRequired: ["English", "Hindi"],
      jobDescription:
        '<p><span style="background-color: rgb(32, 33, 36); color: rgb(191, 191, 191);">Do you want to help solve the world\'s most pressing challenges? Feeding the world\'s growing population and slowing climate change are two of the world\'s greatest challenges. AGCO is a part of the solution! Join us to make your contribution.</span></p><p><br></p><p><span style="background-color: rgb(32, 33, 36); color: rgb(191, 191, 191);">AGCO is looking to hire candidates for the position of Sr. Penetration Tester.</span></p>',
      status: "ACTIVE",
      isDeleted: false,
      createdAt: "2026-01-16T07:40:26.012Z",
      updatedAt: "2026-01-16T07:40:26.012Z",
      companyId: "bf5ca20a-ca6f-4623-8752-b34c83de5ad8",
      company: {
        id: "bf5ca20a-ca6f-4623-8752-b34c83de5ad8",
        companyName: "Oplify Solutions Pvt. Ltd.",
        industry: "Information Technology Services",
        headquarter: "Pune",
        profileBanner: {
          url: "https://ik.imagekit.io/6ngojlkw0j/company-banner-1767333080093_Y0PtFfZQE.png",
          fileId: "69575cd85c7cd75eb898fffa",
        },
        profilePicture: {
          url: "https://ik.imagekit.io/6ngojlkw0j/company-profile-1767333078827_hwXGRzb6T.jpg",
          fileId: "69575cd75c7cd75eb898faab",
        },
      },
    },
    {
      id: "bfa0dbe6-7e6e-4baa-aff2-d25aea56051a",
      title: "Full Stack Dev",
      location: "Remote",
      additionalBenefits: [],
      skills: ["React", "Node.js", "Express"],
      certifications: ["Certified in Cybersecurity"],
      qualifications: "HIGH_SCHOOL",
      genderPreference: "MALE",
      showSalary: false,
      currency: "USD",
      minSalary: 50,
      maxSalary: 100,
      minWorkExperience: 0,
      maxWorkExperience: 2,
      contractType: "FREELANCE",
      remotePolicy: "ONSITE",
      languageRequired: ["English"],
      jobDescription: "<p>Full Stack Dev</p>",
      status: "ACTIVE",
      isDeleted: false,
      createdAt: "2026-01-16T05:56:44.331Z",
      updatedAt: "2026-01-16T05:56:44.331Z",
      companyId: "a0afabc2-f9aa-40b8-9fb0-4d682d8ac8af",
      company: {
        id: "a0afabc2-f9aa-40b8-9fb0-4d682d8ac8af",
        companyName: "Rambha Solutions",
        industry: "Software Development",
        headquarter: "Pune, Maharashtra, India",
        profileBanner: {
          url: "https://ik.imagekit.io/6ngojlkw0j/company-banner-1768542943426_itCs1KbnZE.webp",
          fileId: "6969d2e05c7cd75eb8fffdc8",
        },
        profilePicture: {
          url: "https://ik.imagekit.io/6ngojlkw0j/company-profile-1768542942148_UfkdKG0ng.png",
          fileId: "6969d2de5c7cd75eb8ffee81",
        },
      },
    },
    {
      id: "bb504888-6c8c-4fa0-a7d1-1e52088327ca",
      title: "Backend Engineer",
      location: "Mumbai",
      additionalBenefits: [],
      skills: ["Node.js", "Express"],
      certifications: ["Network+"],
      qualifications: "BACHELORS",
      genderPreference: "MALE",
      showSalary: false,
      currency: "INR",
      minSalary: 100000,
      maxSalary: 120000,
      minWorkExperience: 2,
      maxWorkExperience: 3,
      contractType: "PERMANENT",
      remotePolicy: "ONSITE",
      languageRequired: ["English"],
      jobDescription:
        '<p><span style="background-color: rgb(28, 28, 29); color: rgb(201, 201, 202);">An AI Engineer is responsible for developing and training artificial intelligence tools to automate business processes, design and program AI systems, test machine learning tools, and resolve algorithmic and data-related issues to ensure system functionality. Core responsibilities often include designing and implementing AI applications using cognitive computing APIs and machine learning technologies, understanding business problems, identifying appropriate AI solutions, and formulating technical recipes for deployment.</span></p>',
      status: "ACTIVE",
      isDeleted: false,
      createdAt: "2026-01-07T09:15:51.085Z",
      updatedAt: "2026-01-07T09:15:51.085Z",
      companyId: "b63906fb-9781-4029-91b3-d2c100e7ac1e",
      company: {
        id: "b63906fb-9781-4029-91b3-d2c100e7ac1e",
        companyName: "one delivery",
        industry: null,
        headquarter: "Pune, Maharashtra, India",
        profileBanner: null,
        profilePicture: null,
      },
    },
    {
      id: "4d75871c-fedf-41c8-94e5-81ccb4850997",
      title: "Ai Engineer",
      location: "Pune",
      additionalBenefits: [],
      skills: ["Python"],
      certifications: ["Network+"],
      qualifications: "BACHELORS",
      genderPreference: "MALE",
      showSalary: false,
      currency: "INR",
      minSalary: 50000,
      maxSalary: 80000,
      minWorkExperience: 0,
      maxWorkExperience: 2,
      contractType: "INTERNSHIP",
      remotePolicy: "ONSITE",
      languageRequired: ["English"],
      jobDescription:
        '<p><span style="background-color: rgb(28, 28, 29); color: rgb(201, 201, 202);">An AI Engineer is responsible for developing and training artificial intelligence tools to automate business processes, design and program AI systems, test machine learning tools, and resolve algorithmic and data-related issues to ensure system functionality. Core responsibilities often include designing and implementing AI applications using cognitive computing APIs and machine learning technologies, understanding business problems, identifying appropriate AI solutions, and formulating technical recipes for deployment.</span></p>',
      status: "ACTIVE",
      isDeleted: false,
      createdAt: "2026-01-07T08:58:44.655Z",
      updatedAt: "2026-01-07T08:58:44.655Z",
      companyId: "b63906fb-9781-4029-91b3-d2c100e7ac1e",
      company: {
        id: "b63906fb-9781-4029-91b3-d2c100e7ac1e",
        companyName: "one delivery",
        industry: null,
        headquarter: "Pune, Maharashtra, India",
        profileBanner: null,
        profilePicture: null,
      },
    },
    {
      id: "686ff0ed-4690-4144-b6e5-5d97a7412a2d",
      title: "SOC Admin",
      location: "Pune",
      additionalBenefits: ["Free International Vacation", "Gym", "Free Meal"],
      skills: ["Node.js", "Express"],
      certifications: ["Certified in Cybersecurity"],
      qualifications: "HIGH_SCHOOL",
      genderPreference: "MALE",
      showSalary: true,
      currency: "INR",
      minSalary: 30000,
      maxSalary: 40000,
      minWorkExperience: 2,
      maxWorkExperience: 5,
      contractType: "FREELANCE",
      remotePolicy: "ONSITE",
      languageRequired: ["English"],
      jobDescription: "<p>This is the best company in the world</p>",
      status: "ACTIVE",
      isDeleted: false,
      createdAt: "2025-12-31T10:36:55.495Z",
      updatedAt: "2025-12-31T10:36:55.495Z",
      companyId: "5073f611-32fe-4093-b32a-c0f760461e2a",
      company: {
        id: "5073f611-32fe-4093-b32a-c0f760461e2a",
        companyName: "Oplify Solutions",
        industry: "Technology",
        headquarter: "Pune",
        profileBanner: {
          url: "https://ik.imagekit.io/6ngojlkw0j/company-banner-1765970303452_OI6g7pAb7.jpg",
          fileId: "694291805c7cd75eb8fafa92",
        },
        profilePicture: {
          url: "https://ik.imagekit.io/6ngojlkw0j/company-profile-1765970302367_-5OFQRiLB.jpg",
          fileId: "6942917f5c7cd75eb8faec87",
        },
      },
    },
  ];

  return (
    <div className="bg-g-900 py-20 relative overflow-hidden">
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-jobs {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% - 1.5rem));
          }
        }

        .animate-marquee-jobs {
          animation: marquee-jobs 40s linear infinite;
        }

        .animate-marquee-jobs:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-6xl mx-auto absolute top-0 flex h-11/12 sm:h-4/5 left-1/2 -translate-x-1/2 items-center justify-center">
        <div className="ellipse-22"></div>
        <div className="ellipse-21"></div>
        <div className="ellipse-23"></div>
      </div>

      <div className="relative top-0 left-0">
        <div className="overflow-hidden px-5 sm:px-10 lg:px-20">
          <div className="text-center mb-11">
            <h2 className="text-4xl leading-11 font-medium text-accent-color-1">
              Trusted by Startups and Agencies
            </h2>
          </div>

          {/* Companies Marquee */}
          <div className="relative overflow-hidden w-7xl mx-auto">
            <div className="flex items-center animate-marquee">
              {companies.map((company, index) => (
                <div key={`first-${index}`} className="flex-shrink-0 mx-5">
                  <img
                    src={company}
                    className="w-35 h-auto object-contain"
                    alt=""
                  />
                </div>
              ))}
              {companies.map((company, index) => (
                <div key={`second-${index}`} className="flex-shrink-0 mx-5">
                  <img
                    src={company}
                    className="w-35 h-auto object-contain"
                    alt=""
                  />
                </div>
              ))}
              {
                /* Repeat to ensure smooth looping */
                companies.map((company, index) => (
                  <div key={`third-${index}`} className="flex-shrink-0 mx-5">
                    <img
                      src={company}
                      className="w-35 h-auto object-contain"
                      alt=""
                    />
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto pt-40 px-5 sm:px-10 lg:px-20">
          <div className="text-center">
            <h1 className="text-4xl leading-11 font-medium text-g-200 mb-5">
              <span className="text-accent-color-1">Browse</span> Thousands of{" "}
              <span className="text-accent-color-1">Cybersecurity</span>
              <br />
              <span className="text-accent-color-1">Jobs Daily</span>, Connect
              on Your Terms
            </h1>
            <p className="text-g-300 body max-w-lg mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi mi
              lectus, pharetra sit amet elit in, condimentum rutrum ante.
            </p>
          </div>

          {/* Jobs Marquee */}
          <div className="pt-15 pb-30 overflow-hidden">
            <div className="flex gap-6 animate-marquee-jobs">
              {/* First set */}
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} handleClick={() => {}} />
              ))}

              {/* Duplicate set for seamless loop */}
              {jobs.map((job) => (
                <JobCard
                  key={`duplicate-${job.id}`}
                  job={job}
                  handleClick={() => {}}
                />
              ))}
            </div>
          </div>

          <div className="pt-10">
            <h2 className="text-accent-color-1 text-center font-medium text-4xl leading-11 tracking-[-1%] pb-5">
              Stop Guessing. Start Growing.
            </h2>
            <p className="text-base leading-6 font-medium text-center max-w-lg mx-auto text-g-300">
              Your career deserves more than a standard CV. With{" "}
              <span className="text-accent-color-1">NextGen CV</span>, AI
              transforms your profile into a living, evolving career map
            </p>
            <div className="pt-17.5 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="flex flex-col items-center justify-center text-center">
                <Image
                  src={"/build-once-grow-forever.png"}
                  height={140}
                  width={160}
                  alt="build-once-grow-forever"
                  className="pb-7.5"
                />
                <h4 className="text-g-200 font-semibold text-base leading-6">
                  Build once, grow forever
                </h4>
                <p className="text-g-300 text-sm leading-5 mt-2.5">
                  AI auto-updates your CV as you add skills, certifications, and
                  experience.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Image
                  src={"/personalized-roadmap.png"}
                  height={140}
                  width={160}
                  alt="personalized-roadmap"
                  className="pb-7.5"
                />
                <h4 className="text-g-200 font-semibold text-base leading-6">
                  Personalized roadmap
                </h4>
                <p className="text-g-300 text-sm leading-5 mt-2.5">
                  AI auto-updates your CV as you add skills, certifications, and
                  experience.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Image
                  src={"/showcase-your-wins.png"}
                  height={140}
                  width={160}
                  alt="showcase-your-wins"
                  className="pb-7.5"
                />
                <h4 className="text-g-200 font-semibold text-base leading-6">
                  Showcase your wins
                </h4>
                <p className="text-g-300 text-sm leading-5 mt-2.5">
                  AI auto-updates your CV as you add skills, certifications, and
                  experience.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <Image
                  src={"/land-faster.png"}
                  height={140}
                  width={160}
                  alt="land-faster"
                  className="pb-7.5"
                />
                <h4 className="text-g-200 font-semibold text-base leading-6">
                  Land faster
                </h4>
                <p className="text-g-300 text-sm leading-5 mt-2.5">
                  AI auto-updates your CV as you add skills, certifications, and
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CybersecurityJobBoard;
