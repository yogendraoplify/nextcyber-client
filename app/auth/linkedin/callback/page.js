"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { setUser } from "@/store/slices/authSlice";
import { createSocket } from "@/utils/socket";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function LinkedInCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
    const [error, setError] = useState(null);
    
    const dispatch = useDispatch()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const storedState = sessionStorage.getItem("linkedin_oauth_state");

      // Verify state to prevent CSRF
      if (state !== storedState) {
        setError("Invalid state parameter. Possible CSRF attack.");
        return;
      }

      if (!code) {
        setError("No authorization code received");
        return;
      }

      try {
        // Send code to backend
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/linkedin/callback`,
          { code },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        const { user, isNewUser, message } = response.data;

        dispatch(setUser(user));
        createSocket();
        toast.success(message || "Signed in");

        // Clean up
        sessionStorage.removeItem("linkedin_oauth_state");

        // Redirect based on user status
        if (isNewUser) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("LinkedIn callback error:", error);
        setError(error.response?.data?.message || "Authentication failed");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/auth/signin")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Authenticating with LinkedIn...</p>
      </div>
    </div>
  );
}
