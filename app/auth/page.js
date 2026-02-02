"use client";
import { asyncCurrentUser } from "@/store/actions/authActions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function AuthPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user === null) {
      // dispatch(asyncCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }else{
      router.replace("/auth/signin?role=STUDENT");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className=" animate-spin" />
      </div>
    );
  }

  return <></>;
}

export default AuthPage;
