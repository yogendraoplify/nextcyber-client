"use client";
import React from "react";

function Section2() {
  const companies = [
    "/polarwise.png",
    "/amiri.png",
    "/ciele.png",
    "/larq.png",
    "/y-combinator.svg",
    "/greenhouse.svg",
  ];
  return (
    <div className="overflow-hidden px-5 sm:px-10">
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-jobs {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% - 1.5rem));
          }
        }

        .animate-marquee-jobs {
          animation: marquee-jobs 40s linear infinite;
        }

        .animate-marquee-jobs:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="text-center mb-10">
        <h2 className="text-2xl leading-8 font-medium text-g-300">
          Trusted by Startups and Agencies
        </h2>
      </div>

      <div className="relative overflow-auto">
        <div className="relative overflow-hidden w-7xl mx-auto">
          <div className="flex items-center animate-marquee">
            {companies.map((company, index) => (
              <div key={`first-${index}`} className="flex-shrink-0 mx-5">
                <img
                  src={company}
                  className="w-35 h-auto object-contain"
                  alt=""
                />
              </div>
            ))}
            {companies.map((company, index) => (
              <div key={`second-${index}`} className="flex-shrink-0 mx-5">
                <img
                  src={company}
                  className="w-35 h-auto object-contain"
                  alt=""
                />
              </div>
            ))}
            {
              /* Repeat to ensure smooth looping */
              companies.map((company, index) => (
                <div key={`third-${index}`} className="flex-shrink-0 mx-5">
                  <img
                    src={company}
                    className="w-35 h-auto object-contain"
                    alt=""
                  />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section2;
