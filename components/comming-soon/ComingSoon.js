"use client";
import { accessRequestApi, notifyLaunchApi } from "@/services/comingsoonApi";
import Image from "next/image";
import { useState } from "react";

function LockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.75C8.20507 1.75 6.75 3.20507 6.75 5V7.25H5.5C4.80964 7.25 4.25 7.80964 4.25 8.5V16.5C4.25 17.1904 4.80964 17.75 5.5 17.75H14.5C15.1904 17.75 15.75 17.1904 15.75 16.5V8.5C15.75 7.80964 15.1904 7.25 14.5 7.25H13.25V5C13.25 3.20507 11.7949 1.75 10 1.75ZM11.75 7.25V5C11.75 4.0335 10.9665 3.25 10 3.25C9.0335 3.25 8.25 4.0335 8.25 5V7.25H11.75ZM10 10.25C10.4142 10.25 10.75 10.5858 10.75 11V14C10.75 14.4142 10.4142 14.75 10 14.75C9.58579 14.75 9.25 14.4142 9.25 14V11C9.25 10.5858 9.58579 10.25 10 10.25Z"
        fill="#CFFFC8"
      />
    </svg>
  );
}

function Notification({ type = "info", message, onClose }) {
  const styles = {
    success: "bg-green-500/10 border-green-500 text-green-400",
    error: "bg-red-500/10 border-red-500 text-red-400",
    info: "bg-blue-500/10 border-blue-500 text-blue-400",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg flex items-center gap-3 min-w-[260px] animate-fadeIn ${styles[type]}`}
    >
      <span className="text-sm font-medium">{message}</span>

      <button
        onClick={onClose}
        className="ml-auto text-white/60 hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}

export default function ComingSoon({ showComingSoon }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [error, setError] = useState({ email: "", password: "" });
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification(null);
    }, 3000); // auto close
  };
  const handleNotify = async () => {
    if (!email) {
      setError((prev) => ({
        ...prev,
        email: "Email is required.",
      }));
      return;
    }
    try {
      setNotifyLoading(true);
      const { data } = await notifyLaunchApi({ email });
      showNotification("success", "You're on the waitlist! 🚀");
      setEmail("");
      setError({ email: "", password: "" });
    } catch (error) {
      console.error("Error occurred while notifying launch:", error);
      setError((prev) => ({
        ...prev,
        email:
          "An error occurred while submitting your email. Please try again later.",
      }));
      showNotification(
        "error",
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setNotifyLoading(false);
    }
  };

  const handleAccessRequest = async () => {
    if (!password) {
      setError((prev) => ({
        ...prev,
        password: "Password is required.",
      }));
      return;
    }
    try {
      setNotifyLoading(true);
      const { data } = await accessRequestApi({ password });
      if (data.hasAccess) {
        showNotification("success", "Access granted 🎉");
        setError({ email: "", password: "" });
        showComingSoon(false);
      } else {
        setError((prev) => ({
          ...prev,
          password: "Incorrect password. Please try again.",
        }));
        showNotification("error", "Incorrect password. Please try again.");
      }
    } catch (error) {
      setError((prev) => ({
        ...prev,
        password:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      }));
      showNotification(
        "error",
        error.response?.data?.message || "Invalid password. Try again.",
      );
    } finally {
      setNotifyLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div
        className="relative w-full min-h-screen  items-center overflow-hidden"
        style={{ background: "#07080A", fontFamily: "'Inter', sans-serif" }}
      >
        <div className="lg:w-7xl mx-auto w-full h-full">
          <div className="absolute">
            <Image src="/image.png" alt="Background" width={240} height={240} />
          </div>

          <div className="z-10 w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-16 py-16 lg:py-0 lg:h-screen">
            <div className="flex flex-col gap-0 max-w-xl w-full">
              <h1
                className="font-bold text-white leading-none tracking-tight select-none"
                style={{
                  fontSize: "clamp(72px, 10vw, 120px)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  marginBottom: 32,
                }}
              >
                Coming
                <br />
                Soon
              </h1>

              <p
                className="text-white font-medium mb-8"
                style={{ fontSize: 20, lineHeight: "24px", maxWidth: 422 }}
              >
                Join our waitlist to access the platform on a priority basis as
                soon as we launch!
              </p>

              <div className="flex flex-row items-center gap-4">
                <div className="flex flex-col" style={{ gap: 8 }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="h-[52px] outline-none rounded-[8px] placeholder-[#9C9C9D] text-white focus:ring-1 focus:ring-[#025BCF]"
                    style={{
                      width: 320,
                      background: "#111214",
                      border: "1px solid #2F3031",
                      padding: "16px 20px",
                      fontSize: 14,
                      lineHeight: "20px",
                    }}
                  />
                  {error.email && (
                    <p className="text-red-500 text-sm">{error.email}</p>
                  )}
                </div>

                <button
                  onClick={handleNotify}
                  className="font-medium text-[#E6E6E6] transition-opacity hover:opacity-90 active:opacity-75 whitespace-nowrap"
                  style={{
                    height: 52,
                    padding: "12px 24px",
                    background: "#025BCF",
                    borderRadius: 8,
                    fontSize: 16,
                    lineHeight: "24px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {notifyLoading ? "saving..." : "Notify me"}
                </button>
              </div>
            </div>

            <div
              className="flex flex-col items-center flex-shrink-0"
              style={{
                width: 320,
                padding: 32,
                gap: 32,
                background: "#111214",
                borderRadius: 8,
                display: "flex",
              }}
            >
              <div
                className="flex flex-col items-center"
                style={{ gap: 16, width: "100%" }}
              >
                <LockIcon />

                <h2
                  className="text-white text-center font-medium"
                  style={{ fontSize: 24, lineHeight: "32px", width: "100%" }}
                >
                  Protected Portal
                </h2>

                <p
                  className="text-white text-center font-normal"
                  style={{ fontSize: 14, lineHeight: "20px", width: "100%" }}
                >
                  The portal is protected by a password.
                  <br />
                  Please enter it below.
                </p>
              </div>

              <div className="flex flex-col" style={{ gap: 16, width: "100%" }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="h-[52px] outline-none rounded-[8px] placeholder-[#9C9C9D] text-white focus:ring-1 focus:ring-[#025BCF]"
                  style={{
                    background: "#111214",
                    border: "1px solid #2F3031",
                    padding: "16px 20px",
                    fontSize: 14,
                    lineHeight: "20px",
                  }}
                />
                {error.password && (
                  <p className="text-red-500 text-sm">{error.password}</p>
                )}
              </div>

              <div className="flex items-center gap-4 w-full">
                <button
                  onClick={handleAccessRequest}
                  className="text-[#E6E6E6] font-medium transition-opacity hover:opacity-90 active:opacity-75"
                  style={{
                    width: "100%",
                    height: 48,
                    background: "#025BCF",
                    borderRadius: 8,
                    fontSize: 16,
                    lineHeight: "24px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: #9C9C9D; }
      `}</style>
        </div>
      </div>
    </>
  );
}
