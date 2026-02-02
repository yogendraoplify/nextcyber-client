"use client";
import { usePathname } from "next/navigation";
import React from "react";

function InDev() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-g-900">
      <div className="w-full p-5 flex flex-col gap-5 items-start">
        <h2 className="capitalize text-lg font-semibold text-white">
          {pathname.split("/")[pathname.split("/").length - 1]}
        </h2>
        <p className="text-primary font-medium italic animate-pulse">
          This page is under development! Please check back later.
        </p>
      </div>
    </div>
  );
}

export default InDev;
