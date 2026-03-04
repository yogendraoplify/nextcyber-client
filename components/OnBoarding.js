import React from "react";
import StudentOnBoarding from "./onBoarding/StudentOnboarding";
import { useSelector } from "react-redux";
import RecruiterOnBoarding from "./onBoarding/RecruiterOnBoarding";
import MentorOnboarding from "./onBoarding/MentorOnboarding";

function OnBoarding() {
  const { user } = useSelector((state) => state.auth);
  if (user.role == "STUDENT") return <StudentOnBoarding />;
  else if (user.role == "MENTOR") return <MentorOnboarding />;
  return <RecruiterOnBoarding />;
}

export default OnBoarding;
