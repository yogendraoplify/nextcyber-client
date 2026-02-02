import React from "react";
import StudentOnBoarding from "./onBoarding/StudentOnboarding";
import { useSelector } from "react-redux";
import RecruiterOnBoarding from "./onBoarding/RecruiterOnBoarding";

function OnBoarding() {
  const { user } = useSelector((state) => state.auth);
  if (user.role == "STUDENT") return <StudentOnBoarding />;
  return <RecruiterOnBoarding />;
}

export default OnBoarding;
