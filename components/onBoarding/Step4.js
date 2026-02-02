import React from "react";
import { useSelector } from "react-redux";

const Step4 = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="flex flex-col pt-20 min-h-[calc(100vh-204px)] px-20 gap-20">
      <div>
        <div className=" flex items-center justify-between mb-3">
          <h2 className="text-g-100 text-base font-medium leading-6 ">
            Here{"’"}s how NextCybr helps you
          </h2>
          <span className=" text-g-100 text-base font-medium leading-6">
            2/3
          </span>
        </div>
        <div className="relative">
          <div className="h-3 absolute z-10 left-0 w-2/3 bg-primary rounded-xl"></div>
          <div className=" h-3 bg-accent-color-1 rounded-xl"></div>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <h1 className="text-5xl font-medium leading-[56px] mb-7.5 tracking-[-2%] text-transparent bg-clip-text bg-gradient-to-r from-accent-color-1 to-primary">
          <span className="block">
            {user.role == "STUDENT"
              ? "Personalized roadmap to"
              : "Keep track of and oversee all your"}
          </span>
          <span>
            {user.role == "COMPANY"
              ? "stand out instantly"
              : "job seekers instantly"}
          </span>
        </h1>

        <p className="text-g-200 text-xl leading-6 max-w-3xl">
          Instantly see what certifications, training, and projects will make
          you stand out for the exact role you want.
        </p>
      </div>
    </div>
  );
};

export default Step4;
