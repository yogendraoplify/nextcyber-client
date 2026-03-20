"use client";
import React, { useState } from "react";
import Image from "next/image";
import CandidateProfileTabs from "../recruiter/candidate-profile/CandidateProfileTabs";
import { FaLinkedinIn } from "react-icons/fa6";
import { X } from "lucide-react";

const ViewCandidateProfile = ({ isOpen, onClose, data: user }) => {
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);

  if (!isOpen) return null;

  const getProfilePicture = () =>
    user?.profilePicture?.url || "/user-profile.png";

  const getProfileBanner = () =>
    user?.profileBanner?.url || "/company-banner.jpg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-g-700 rounded-xl border border-g-400 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-20 text-g-200 hover:text-white transition"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Banner */}
        <div className="relative h-[180px] w-full">
          <Image
            src={getProfileBanner()}
            alt="banner"
            fill
            className="object-cover"
          />
        </div>

        {/* Profile Section */}
        <div className="relative px-6 pb-6 bg-g-600">
          {/* Profile Image */}
          <div className="absolute -top-12 left-6">
            <Image
              src={getProfilePicture()}
              width={96}
              height={96}
              alt="profile"
              className="rounded-full border-4 border-g-600 object-cover h-24 w-24"
            />
          </div>

          {/* Info */}
          <div className="pt-14 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-g-100 flex items-center gap-2">
                {`${user?.user?.firstName || ""} ${
                  user?.user?.lastName || ""
                }`}
                <button className="text-g-200 hover:text-white">
                  <FaLinkedinIn />
                </button>
              </h2>

              <p className="text-sm text-g-200 mt-1">
                {user?.role === "MENTOR"
                  ? user?.mentorProfile?.domain?.[0] || "Mentor"
                  : "Network Security Engineer"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6">
          <CandidateProfileTabs
            user={user}
            openExperienceModal={() => setIsExpModalOpen(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewCandidateProfile;