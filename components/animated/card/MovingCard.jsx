"use client";
import { Star } from "lucide-react";
import React from "react";
import "./movingcard.css"

const MovingCard = () => {
  return (
    <div className="w-1/2 pr-10 lg:flex hidden flex-col justify-center items-start">
      <div className="min-w-lg space-y-10">
        {/* Heading */}
        <div className="space-y-6 text-start">
          <h2 className="text-2xl font-bold text-[#69EDFE] leading-tight max-w-sm">
            The World&apos;s ⚡ Leading Platform for Cyber Professionals
          </h2>

          <div className="w-fit border border-transparent bg-gradient-to-r from-[#111214] to-[#2F3031] text-[#69EDFE] px-3 py-2 rounded-full text-sm font-medium">
            #1 Highest Rated Hiring Agency in New Zealand
          </div>
        </div>

        {/* Stage */}
        <div className="relative w-[420px] h-[500px] perspective">
          
          {/* Card 1 */}
          <div className="card card1">
            <CardContent name="Jacob B." />
          </div>

          {/* Card 2 */}
          <div className="card card2">
            <CardContent name="Emma W." />
          </div>
        </div>
      </div>
    </div>
  );
};

const CardContent = ({ name }) => {
  return (
    <div className="bg-[#111214] rounded-[10px] p-6 text-white border border-[#434345] w-[300px]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">JB</span>
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-[#9C9C9D] text-sm">HR Manager</p>
        </div>
      </div>

      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-[#D9A61C] text-[#D9A61C]" />
        ))}
      </div>

      <p className="text-sm">
        "What impressed me most was their strategic approach. Every design
        choice had a reason behind it"
      </p>
    </div>
  );
};

export default MovingCard;