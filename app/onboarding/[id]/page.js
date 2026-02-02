"use client";
import OnBoarding from "@/components/OnBoarding";
import { asyncCurrentUser } from "@/store/actions/authActions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function StudentOnboardingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  // Fetch current user if not available
  useEffect(() => {
    if (user === null) {
      dispatch(asyncCurrentUser());
    }
  }, [dispatch, user]);

  // Redirect if user is not a candidate or already onboarded
  useEffect(() => {
    if (!isLoading && user) {
      if (user.onboardingComplete) {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, user, router]);

  // Wait for user data to be ready
  if (isLoading || !user) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Extra safety: while redirecting, also show loader
  if (user.onboardingComplete) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <OnBoarding />
    </>
  );
}

export default StudentOnboardingPage;
