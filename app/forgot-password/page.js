"use client";
import { ChevronLeft, Loader2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import axios from "@/utils/axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { forgotPassword } from "@/api/authApi";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await forgotPassword(formData);
      reset();
      toast.success(data.message);
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-g-900 ">
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
            <h1 className="text-g-100 text-2xl font-semibold leading-8">
              Forgot Password
            </h1>
            <p className="text-g-200 text-sm mt-1 leading-5">
              Please enter the email address associated with your account and We
              will email you a link to reset your password.
            </p>

            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder={"Email"}
              className="w-full bg-[#111214] mt-7.5 border border-[#1B1C1E] rounded-lg px-5 py-4 text-white outline-none text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="w-full disabled:bg-primary/50 cursor-pointer disabled:cursor-not-allowed disabled:text-g-200 bg-primary text-white py-3 px-6 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors mt-4"
            >
              {loading && (
                <Loader2 className=" animate-spin text-g-200" size={18} />
              )}
              {loading ? "Sending Mail..." : " Reset password"}
            </button>

            <div className=" flex justify-center mt-10">
              <Link
                href={"/auth/signin"}
                className=" flex items-center text-g-200 text-sm leading-5 font-medium gap-1.5"
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
    </div>
  );
}

export default ForgotPassword;
