"use client";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Star,
  Briefcase,
  User,
  Loader2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { asyncSigninUser, asyncSignupUser } from "@/store/actions/authActions";
import Link from "next/link";

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

const hasRepeatedChars = (s) => /(.)\1\1\1/.test(s);

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

const NextCyberAuth = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const urlTab = searchParams.get("COMPANY") || "STUDENT";
  const [activeTab, setActiveTab] = useState(urlTab);

  useEffect(() => setActiveTab(urlTab), [urlTab]);

  const changeTab = useCallback(
    (tab) => {
      startTransition(() => {
        document.startViewTransition?.(() => setActiveTab(tab));
        router.replace(`?role=${tab}`, { scroll: false });
      });
      setSelectedRole(tab);
    },
    [router]
  );

  const tabs = [
    { id: "COMPANY", label: "Recruiter", icon: Briefcase },
    { id: "STUDENT", label: "Candidate", icon: User },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    const user = {
      ...data,
      role: selectedRole,
    };

    if (isLogin) {
      dispatch(asyncSigninUser(data, setLoading, router));
    } else {
      dispatch(asyncSignupUser(user, setLoading, router));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
    setShowPassword(false);
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
    <section className="bg-g-900 ">
      <div className="min-h-screen flex max-w-[1440px] mx-auto py-20 sm:py-10">
        <div className=" w-full lg:w-1/2 flex items-center justify-center px-5 sm:px-10">
          <div className="w-full max-w-sm">
            <Image
              src="/logo.png"
              className=" h-9 w-auto mb-10"
              height={72}
              width={329}
              alt="nextcybr-logo"
            />

            <div className="space-y-1 mb-7.5">
              <h1 className="text-g-100 text-2xl font-medium leading-tight">
                {isLogin
                  ? "Sign In with your\nsocial account"
                  : "Create an account"}
              </h1>
              {!isLogin && (
                <p className="text-g-200 text-sm">
                  Please enter your details here.
                </p>
              )}
            </div>

            {
              <div className="border border-g-500 rounded-lg p-2 gap-1 flex w-full bg-g-700 mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => changeTab(tab.id)}
                    className={`py-2 px-4 rounded-md text-sm flex-1 gap-2.5 flex items-center justify-center font-medium transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-primary text-g-50 shadow"
                        : "text-g-200"
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                ))}
              </div>
            }

            <div className="space-y-3">
              {!isLogin && (
                <>
                  <div>
                    <input
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      type="text"
                      placeholder="First name"
                      className="w-full bg-[#111214] border border-[#1B1C1E] rounded-lg px-5 py-4 text-white outline-none text-sm"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      type="text"
                      placeholder="Last name"
                      className="w-full bg-[#111214] border border-[#1B1C1E] rounded-lg px-5 py-4 text-white outline-none text-sm"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </>
              )}
              <div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  placeholder={isLogin ? "Email" : "Professional email"}
                  className="w-full bg-[#111214] border border-[#1B1C1E] rounded-lg px-5 py-4 text-white outline-none text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <input
                  {...register("password", { validate: validatePassword })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-[#111214] border border-[#1B1C1E] rounded-lg px-5 py-4 text-white outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {isLogin && (
                <div className=" text-end text-g-200 font-medium text-xs leading-4 cursor-pointer">
                  <Link
                    href={"/forgot-password"}
                    className=" border-b border-dotted"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className=" flex items-center gap-1.5 pt-6">
                <input type="checkbox" className=" cursor-pointer" />
                <p className=" text-xs font-medium text-g-200">
                  By proceeding, you agree to our{" "}
                  <span className=" text-primary">Terms</span> &{" "}
                  <span className=" text-primary">Privacy Policy</span>
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="w-full disabled:bg-primary/50 mt-6 disabled:text-g-200 bg-primary cursor-pointer disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors mb-8"
            >
              {loading && (
                <Loader2 className=" animate-spin text-g-200" size={18} />
              )}
              <span>Continue</span>
              <ArrowRight size={20} />
            </button>

            {selectedRole == "STUDENT" && (
              <div className="space-y-8 mb-10">
                <div className=" flex gap-2.5 items-center">
                  <div className=" bg-g-300 h-0.5 flex-1"></div>
                  <div className=" text-g-200 text-base leading-6 font-semibold">
                    {isLogin ? "Or Sign with" : "Or Signup with"}
                  </div>
                  <div className=" bg-g-300 h-0.5 flex-1"></div>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 bg-[#1B1C1E] cursor-pointer text-[#9C9C9D] py-2 px-4 border border-[#2F3031] rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                    <FaLinkedin size={20} className="text-white" />
                    LinkedIn
                  </button>
                  <button className="flex-1 bg-[#1B1C1E] text-[#9C9C9D] py-2 cursor-pointer px-4 border border-[#2F3031] rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
                    <FcGoogle size={20} />
                    Google
                  </button>
                </div>
              </div>
            )}

            <p className="text-[#6A6B6C] text-sm">
              {isLogin ? "Don't have an account? " : "Have an account? "}
              <button
                onClick={toggleMode}
                className="text-[#9C9C9D] font-medium cursor-pointer"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
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

            <div className="relative bg-[#111214] w-[93%] xl:w-full  rounded-[10px]  overflow-hidden">
              <div className="absolute inset-0 p-10 text-white blur-[0.8px] text-right text-sm leading-relaxed z-0 pt-19">
                <p className="text-lg text-[#6A6B6C]">HR Manager Google</p>
                <div className=" pt-28">
                  <p>ad a reason</p>
                  <p>d in the</p>
                  <p>e engagement</p>
                </div>
              </div>

              <div className="bg-[#111214] rounded-[10px] p-10 text-white relative z-10 border border-[#434345] max-w-sm">
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
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-8 h-8 fill-[#D9A61C] text-[#D9A61C]"
                    />
                  ))}
                </div>

                <blockquote className="text-white text-sm leading-relaxed">
                  &quot;What impressed me most was their strategic approach.
                  Every design choice had a reason behind it&quot;
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextCyberAuth;
