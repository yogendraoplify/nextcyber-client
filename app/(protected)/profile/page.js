"use client";
import InDev from "@/components/InDev";
import RecruiterProfilePage from "@/components/recruiter/ProfilePage";
import StudentProfilePage from "@/components/student/StudentProfilePage";
import React from "react";
import { useSelector } from "react-redux";

function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  if (user.role == "COMPANY") return <RecruiterProfilePage />;
  if (user.role == "STUDENT") return <StudentProfilePage />;

  return <InDev />;
}

export default ProfilePage;
