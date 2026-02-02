"use client";
import React, { useEffect } from "react";
import Nav from "@/components/navigation/Nav";
import Footer from "@/components/Footer";
import { usePathname, useRouter } from "next/navigation";
import { asyncCurrentUser } from "@/store/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNotifications } from "@/hooks/useNotifications";
// import { socket } from "@/utils/socket";

function Wrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const authPages = [
    "/signin",
    "/blogs",
    "/signup",
    "/auth",
    "/",
    "/privacy-policy",
    "/terms-and-conditions",
    "/forgot-password",
    "/job-seeker",
    "/recruiter",
  ];
  const dynamicAuthPages = ["/reset-password/"];
  const NavPages = [
    "/",
    "/blogs",
    "/privacy-policy",
    "/terms-and-conditions",
    "/job-seeker",
    "/recruiter",
  ];
  const isNavPage = NavPages.includes(pathname);

  const isAuthPage =
    authPages.includes(pathname) ||
    dynamicAuthPages.some((route) => pathname.startsWith(route));

  // useEffect(() => {
  //   if (!user) return;
  //   const handler = (notification) => {
  //     toast(notification.data.message);
  //   };

  //   socket.on("notification", handler);

  //   return () => {
  //     socket.off("notification", handler);
  //   };
  // }, []);

  useNotifications(); // 🔥 just call it

  useEffect(() => {
    if (user === null && !isAuthPage) {
      // dispatch(asyncCurrentUser());
    }
  }, [dispatch, user, isAuthPage]);

  useEffect(() => {
    if (!isLoading && user === null && !isAuthPage) {
      router.replace("/auth/signin");
    }
  }, [user, isLoading, router, isAuthPage]);

  useEffect(() => {
    if (!isLoading && user && isAuthPage) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!isLoading && user) {
      if (!user.onboardingComplete) {
        router.replace(`/onboarding/${user.id}`);
      }
    }
  }, [user, isLoading, router]);

  if (!isAuthPage && (isLoading || user === null)) {
    return <>{children}</>;
  }

  if (isNavPage) {
    return (
      <>
        <Nav />
        {children}
        <Footer />
      </>
    );
  }
  if (isAuthPage) return children;

  return <>{children}</>;
}

export default Wrapper;
