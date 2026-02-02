"use client";
import NextCyberLanding from "@/components/home/Section1";
import CybersecurityJobBoard from "@/components/home/Section2";
import ClientReviewsSection from "@/components/home/Section3";
import FAQSection from "@/components/home/Section4";
import { asyncCurrentUser } from "@/store/actions/authActions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user === null) {
      dispatch(asyncCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className=" animate-spin" />
      </div>
    );
  }

  return (
    <>
      <NextCyberLanding />
      <CybersecurityJobBoard />
      <ClientReviewsSection />
      <FAQSection />
    </>
  );
}

export default HomePage;
