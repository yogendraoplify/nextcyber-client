"use client";
import {
  asyncGetSuggestedMentors,
  asyncGetSuggestedStudents,
} from "@/store/actions/dashboardActions";
import { UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Suggestion = () => {
  const { user } = useSelector((state) => state.auth);
  const { suggestions } = useSelector((state) => state.dashboard);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetchSuggestions = () => {
    // Dispatch appropriate action based on user role
    if (user.role === "STUDENT") {
      dispatch(asyncGetSuggestedMentors({ studentId: user.id }, setLoading));
    } else if (user.role === "COMPANY") {
      dispatch(asyncGetSuggestedStudents({ companyId: user.id }, setLoading));
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [user.role]);

  return (
    <div>
      {/* COMPANY sidebar */}
      {user.role === "COMPANY" && (
        <div className="p-2.5 pb-4 bg-gradient-to-b from-g-600 to-[#434345] mt-3.5 rounded-lg border border-g-500">
          <h6 className="font-semibold leading-6 text-g-100 max-w-3xs">
            AI Job Seeker Profile Suggestions
          </h6>
          <div className="flex flex-col gap-4 mt-4">
            {
              // show skeleton loaders while fetching suggestions
              loading ? (
                <>
                  <div className="flex gap-2 items-center animate-pulse">
                    <div className="rounded-full h-10 w-10 bg-gray-300" />
                    <div className="flex flex-col gap-1">
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                      <div className="h-3 w-32 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center animate-pulse">
                    <div className="rounded-full h-10 w-10 bg-gray-300" />
                    <div className="flex flex-col gap-1">
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                      <div className="h-3 w-32 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center animate-pulse">
                    <div className="rounded-full h-10 w-10 bg-gray-300" />
                    <div className="flex flex-col gap-1">
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                      <div className="h-3 w-32 bg-gray-300 rounded" />
                    </div>
                  </div>
                </>
              ) : suggestions?.length === 0 ? (
                <p className="text-xs text-g-200">
                  No job seeker suggestions available at the moment.
                </p>
              ) : (
                suggestions?.map((student) => (
                  <div key={student.id} className="flex gap-2 items-center">
                    <Image
                      src={student?.profilePicture?.url || "/avatar.jpeg"}
                      height={40}
                      width={40}
                      alt={`${student.user.firstName} ${student.user.lastName}-avatar`}
                      className="rounded-full h-10 w-10 object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-semibold leading-4 text-g-100">
                        {student.user.firstName} {student.user.lastName}
                      </h3>
                      <p className="text-g-200 font-normal leading-4 text-xs">
                        {student.user?.email}
                      </p>
                    </div>
                  </div>
                ))
              )
            }
            <Link
              href="/candidates"
              className="text-white text-sm leading-4 bg-primary px-4 py-2 rounded-lg flex items-center gap-2 justify-center"
            >
              <UserPlus size={20} />
              Connect with Job Seeker
            </Link>
          </div>
        </div>
      )}

      {/* STUDENT sidebar */}
      {user.role === "STUDENT" && (
        <>
          <div className="p-2.5 pb-4 bg-gradient-to-b from-g-600 to-[#434345] mt-3.5 rounded-lg border border-g-500">
            <h6 className="font-semibold leading-6 text-g-100">
              Mentor Suggestions
            </h6>

            <div className="flex flex-col gap-4 mt-4">
              {loading ? (
                <>
                  <div className="flex gap-2 items-center animate-pulse">
                    <div className="rounded-full h-10 w-10 bg-gray-300" />
                    <div className="flex flex-col gap-1">
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                      <div className="h-3 w-32 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center animate-pulse">
                    <div className="rounded-full h-10 w-10 bg-gray-300" />
                    <div className="flex flex-col gap-1">
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                      <div className="h-3 w-32 bg-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center animate-pulse">
                    <div className="rounded-full h-10 w-10 bg-gray-300" />
                    <div className="flex flex-col gap-1">
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                      <div className="h-3 w-32 bg-gray-300 rounded" />
                    </div>
                  </div>
                </>
              ) : suggestions?.length === 0 ? (
                <p className="text-xs text-g-200">
                  No mentor suggestions available at the moment.
                </p>
              ) : (
                suggestions?.map((mentor) => (
                  <div key={mentor.id} className="flex gap-2 items-center">
                    <Image
                      src={mentor?.profilePicture?.url || "/avatar.jpeg"}
                      height={40}
                      width={40}
                      alt={`${mentor.user.firstName} ${mentor.user.lastName}-avatar`}
                      className="rounded-full h-10 w-10 object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-semibold leading-4 text-g-100">
                        {mentor.user.firstName} {mentor.user.lastName}
                      </h3>
                      <p className="text-g-200 font-normal leading-4 text-xs">
                        {mentor?.domain?.length > 0
                          ? mentor.domain[0]
                          : "Mentoring"}
                      </p>
                    </div>
                  </div>
                ))
              )}

              <Link
                href="/mentors"
                className="text-white text-sm leading-4 bg-primary px-4 py-2 rounded-lg flex items-center gap-2 justify-center"
              >
                <UserPlus size={20} />
                Connect with Mentors
              </Link>
            </div>
          </div>

          <div className="p-2.5 pb-4 bg-gradient-to-b from-g-600 to-[#434345] mt-3.5 rounded-lg border border-g-500">
            <div className="h-40 relative w-full">
              <Image
                src={"/certification-image.png"}
                className="object-cover"
                fill
                priority
                alt="certification-image"
              />
              <h4 className="absolute top-2.5 bg-white py-1.5 px-2 text-g-300 text-xs font-medium leading-4">
                Certification
              </h4>
            </div>
            <h5 className="mt-7.5 text-sm font-medium leading-4 text-white max-w-3xs">
              Certified Information Systems Security Professional (CISSP)
            </h5>
            <button className="text-white text-sm leading-4 mt-5 w-full bg-primary px-4 py-2 rounded-lg">
              Enroll Now
            </button>
          </div>
        </>
      )}

      {/* MENTOR sidebar */}
      {user.role === "MENTOR" && (
        <>
          {/* Upcoming sessions widget */}
          <div className="p-2.5 pb-4 bg-gradient-to-b from-g-600 to-[#434345] mt-3.5 rounded-lg border border-g-500">
            <h6 className="font-semibold leading-6 text-g-100">
              Upcoming Sessions
            </h6>
            <div className="flex flex-col gap-4 mt-4">
              {mentorStat?.upcomingSessions > 0 ? (
                <p className="text-xs text-g-200">
                  You have {mentorStat.upcomingSessions} upcoming session(s).
                </p>
              ) : (
                <p className="text-xs text-g-200">
                  No upcoming sessions scheduled.
                </p>
              )}
              <button className="text-white text-sm leading-4 bg-primary px-4 py-2 rounded-lg flex items-center gap-2 justify-center">
                <CalendarClock size={20} />
                Manage Schedule
              </button>
            </div>
          </div>

          {/* Mentee suggestions */}
          <div className="p-2.5 pb-4 bg-gradient-to-b from-g-600 to-[#434345] mt-3.5 rounded-lg border border-g-500">
            <h6 className="font-semibold leading-6 text-g-100">
              Mentee Suggestions
            </h6>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex gap-2 items-center">
                <Image
                  src={"/avatar.jpeg"}
                  height={40}
                  width={40}
                  alt="mentee-avatar"
                  className="rounded-full h-10 w-10 object-cover"
                />
                <div>
                  <h3 className="text-sm font-semibold leading-4 text-g-100">
                    Alex Johnson
                  </h3>
                  <p className="text-g-200 font-normal leading-4 text-xs">
                    Software Engineering
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Image
                  src={"/avatar.jpeg"}
                  height={40}
                  width={40}
                  alt="mentee-avatar"
                  className="rounded-full h-10 w-10 object-cover"
                />
                <div>
                  <h3 className="text-sm font-semibold leading-4 text-g-100">
                    Priya Patel
                  </h3>
                  <p className="text-g-200 font-normal leading-4 text-xs">
                    Full Stack Development
                  </p>
                </div>
              </div>
              <button className="text-white text-sm leading-4 bg-primary px-4 py-2 rounded-lg flex items-center gap-2 justify-center">
                <UserPlus size={20} />
                Connect with Mentees
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Suggestion;
