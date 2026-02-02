"use client";
import { resetPassword } from "@/api/authApi";
import { ChevronLeft, Eye, EyeOff, Loader2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { use, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
const hasUpper = (s) => /[A-Z]/.test(s);
const hasLower = (s) => /[a-z]/.test(s);
const hasDigit = (s) => /[0-9]/.test(s);
const hasSpecial = (s) => /[!@#$%^&*(),.?":{}|<>]/.test(s);

const COMMON_PASSWORDS = [
  "password",
  "12345678",
  "qwerty",
  "letmein",
  "admin",
  "welcome",
  "iloveyou",
];

const isCommonPassword = (s) => COMMON_PASSWORDS.includes(s.toLowerCase());

const hasRepeatedChars = (s) => /(.)\1\1\1/.test(s); // 4 or more repeated chars

const hasSequentialChars = (s) => {
  const sequences = "abcdefghijklmnopqrstuvwxyz0123456789";
  const lower = s.toLowerCase();
  for (let i = 0; i < lower.length - 3; i++) {
    const sub = lower.slice(i, i + 4);
    if (sequences.includes(sub)) return true;
    if (sequences.split("").reverse().join("").includes(sub)) return true;
  }
  return false;
};

function ResetPassword({ params }) {
  const { token } = use(params);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await resetPassword(token, formData);
      reset();
      toast.success(data.message);
      setLoading(false);
      router.push("/auth/signin");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8)
      return "Password must be at least 8 characters long.";
    if (password.length > 100) return "Password is too long.";
    if (!hasUpper(password))
      return "Password must include at least one uppercase letter.";
    if (!hasLower(password))
      return "Password must include at least one lowercase letter.";
    if (!hasDigit(password))
      return "Password must include at least one number.";
    if (!hasSpecial(password))
      return "Password must include at least one special character.";
    if (isCommonPassword(password)) return "Password is too common.";
    if (hasRepeatedChars(password))
      return "Password must not contain 4 or more repeated characters.";
    if (hasSequentialChars(password))
      return "Password must not contain sequential characters like '1234' or 'abcd'.";
    return true; // valid
  };

  return (
    <div className="bg-g-900 ">
      <div className="min-h-screen flex max-w-[1440px] mx-auto">
        <div className=" w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-10">
          <div className="w-full max-w-sm">
            <Image
              src="/logo.png"
              className=" h-9 w-auto mb-7.5"
              height={72}
              width={329}
              alt="nextcybr-logo"
            />
            <h1 className="text-g-200 text-3xl font-medium leading-tight">
              Reset Password
            </h1>
            <p className="text-g-300 text-sm mt-4">
              Please enter a new password for your account. Make sure it meets
              the security requirements.
            </p>

            <div className="relative mt-7.5">
              <input
                {...register("password", { validate: validatePassword })}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-[#111214] border border-[#1B1C1E] rounded-lg px-5 py-4 text-white outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="w-full disabled:bg-primary/50 disabled:text-g-200 bg-primary text-white py-3 px-6 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors mt-6"
            >
              {loading && (
                <Loader2 className=" animate-spin text-g-200" size={18} />
              )}
              {loading ? "Changing Password..." : "Change password"}
            </button>

            <div className=" flex justify-center mt-7.5">
              <Link
                href={"/auth/signin"}
                className=" flex items-center text-g-300 text-sm leading-5 font-medium gap-1.5"
              >
                <ChevronLeft size={20} />
                <span>Back to login</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-1/2 pr-10 lg:flex hidden flex-col justify-center items-start">
          <div className="min-w-lg space-y-10">
            <div className="space-y-6 text-start">
              <h2 className="text-2xl  font-bold text-[#69EDFE] leading-tight max-w-sm">
                The World&apos;s ⚡ Leading Platform for Cyber Professionals
              </h2>
              <div
                className="inline-blockborder w-fit border-transparent bg-gradient-to-r from-[#111214] to-[#2F3031] bg-clip-border
 text-[#69EDFE] px-3 py-2 rounded-full text-sm font-medium"
              >
                #1 Highest Rated Hiring Agency in New Zealand
              </div>
            </div>

            {/* Background content that shows behind card */}
            <div className="relative bg-[#111214] w-[93%] xl:w-full  rounded-[10px]  overflow-hidden">
              {/* Background text content */}
              <div className="absolute inset-0 p-10 text-white blur-[0.8px] text-right text-sm leading-relaxed z-0 pt-19">
                <p className="text-lg text-[#6A6B6C]">HR Manager Google</p>
                <div className=" pt-28">
                  <p>ad a reason</p>
                  <p>d in the</p>
                  <p>e engagement</p>
                </div>
              </div>

              {/* Testimonial Card - positioned to partially cover background */}
              <div className="bg-[#111214] rounded-[10px] p-10 text-white relative z-10 border border-[#434345] max-w-sm">
                {/* Profile Section */}
                <div className="flex items-center gap-5 mb-15">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JB</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-base">
                      Jcob B.
                    </h3>
                    <p className="text-[#9C9C9D] mt-1 text-sm">
                      HR Manager Google
                    </p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-8 h-8 fill-[#D9A61C] text-[#D9A61C]"
                    />
                  ))}
                </div>

                {/* Testimonial Quote */}
                <blockquote className="text-white text-sm leading-relaxed">
                  &quot;What impressed me most was their strategic approach.
                  Every design choice had a reason behind it&quot;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
