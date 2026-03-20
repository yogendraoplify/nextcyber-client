"use client";
import { notifyLaunchApi } from "@/services/comingsoonApi";
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

export default function ComingSoon({ setIsAccessible }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleNotify = async () => {
    try {
      setNotifyLoading(true);
      const { data } = await notifyLaunchApi({ email });
      toast(
        "Thank you for joining the waitlist! We'll notify you when we launch.",
      );
    } catch (error) {
      console.error("Error occurred while notifying launch:", error);
      toast.error(
        "An error occurred while submitting your email. Please try again later.",
      );
    } finally {
      setNotifyLoading(false);
    }
  };

  return (
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
               { notifyLoading ? "saving..." : "Notify me" }
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

              <button
                onClick={( )=> setIsAccessible(true)}
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
  );
}
