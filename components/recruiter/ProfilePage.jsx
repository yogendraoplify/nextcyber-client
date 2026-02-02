"use client";

import { useState } from "react";
import CompanyDetails from "./forms/CompanyDetails";
import Profile from "./forms/Profile";
import NextCybrProfile from "./forms/NextCybrProfile";
import ProfileTabs from "./ProfileTabs";

export default function RecruiterProfilePage() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="overflow-x-hidden h-[calc(100vh-100.67px)]">
      <div className=" overflow-x-auto">
        <ProfileTabs active={activeTab} onChange={setActiveTab} />
      </div>
      {activeTab === "company" && <CompanyDetails />}
      {activeTab === "profile" && <Profile />}
      {activeTab === "nextcybr" && <NextCybrProfile />}
    </div>
  );
}
