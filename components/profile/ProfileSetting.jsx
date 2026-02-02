import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

function ProfileSetting({ setProfileSettingOpen }) {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="relative z-999 p-5 px-8 flex flex-col gap-2">
      <div>
        <h3 className="font-semibold">
          {user.firstName} {user.lastName}
        </h3>
        <p className="font-medium mt-1 mb-2.5">{user.email}</p>
      </div>
    { user?.role === "STUDENT" && <div>
        <Link 
          href={'/myjobs'}
          className="hover:underline"
          onClick={() => setProfileSettingOpen(false)}
        >
          My Jobs
        </Link>
      </div>}
      <Link
        href={"/profile"}
        className="hover:underline"
        onClick={() => setProfileSettingOpen(false)}
      >
        Update Profile
      </Link>
    </div>
  );
}

export default ProfileSetting;
