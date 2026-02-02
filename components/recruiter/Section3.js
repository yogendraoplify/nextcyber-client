"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Section3() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Set initial states to prevent flash of unstyled content
    gsap.set(headingRef.current, { opacity: 0, y: 30 });
    cardsRef.current.forEach((card) => {
      const image = card.querySelector("img");
      const textElements = card.querySelectorAll(".text-content > *");

      gsap.set(image, { opacity: 0, x: 0, scale: 0.95 });
      gsap.set(textElements, { opacity: 0, y: 20 });
    });

    const ctx = gsap.context(() => {
      // Animate heading
      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Animate each card
      cardsRef.current.forEach((card, index) => {
        const isReversed = index % 2 === 1;
        const image = card.querySelector("img");
        const textElements = card.querySelectorAll(".text-content > *");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
            // scrub: true,
          },
        });

        // Animate image
        tl.to(
          image,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          0,
        );

        // Animate text content with stagger
        tl.to(
          textElements,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
          },
          0.2,
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <div
      ref={sectionRef}
      className="pt-50 px-5 sm:px-10 lg:px-20 max-w-[1440px] mx-auto pb-50"
    >
      <h2
        ref={headingRef}
        className="text-5xl leading-14 font-medium tracking-[-2%] text-accent-color-1 text-center mb-25"
      >
        How NextCybr Strengthens
        <br />
        Your Career Profile
      </h2>

      <div className="space-y-35">
        <div
          ref={addToRefs}
          className="flex flex-col lg:flex-row items-center gap-12"
        >
          <div className="flex-1 text-content">
            <p className="text-sm font-semibold leading-5 tracking-[4%] text-g-300 uppercase">
              Create Job-Tailored Resume
            </p>
            <h3 className="text-g-100 text-4xl leading-[44px] font-medium mt-5">
              Create resume that <br /> 30X your job chances
            </h3>
            <p className="text-g-200 text-xl font-medium leading-6 max-w-lg mt-5">
              Upload your resume and let our NextGen AI Resume Builder craft a
              standout version, designed to catch recruiters&apos; attention and
              help you land the job.
            </p>
            <button className="bg-primary text-white text-xl leading-6 font-medium py-4 px-8 rounded-lg mt-8">
              Create my resume
            </button>
          </div>
          <div className="flex-1 flex justify-end">
            <img
              src="/recruiter/AI job description.webp"
              alt="resume"
              className="h-100 rounded-xl"
            />
          </div>
        </div>

        <div
          ref={addToRefs}
          className="flex flex-col-reverse lg:flex-row items-center gap-12"
        >
          <div className="flex-1 flex justify-start">
            <img
              src="/recruiter/track jobseeker.webp"
              alt="certificates"
              className="h-100 rounded-xl"
            />
          </div>
          <div className="flex-1 text-content">
            <p className="text-sm font-semibold leading-5 tracking-[4%] text-g-300 uppercase">
              Personalized Roadmap
            </p>
            <h3 className="text-g-100 text-4xl leading-[44px] font-medium mt-5">
              Personalized Tips to Advance <br /> Your Career
            </h3>
            <p className="text-g-200 text-xl font-medium leading-6 max-w-lg mt-5">
              Instantly see what certifications, training, and projects will
              make you stand out for the exact role you want.
            </p>
            <button className="bg-primary text-white text-xl leading-6 font-medium py-4 px-8 rounded-lg mt-8">
              Show me the roadmap
            </button>
          </div>
        </div>

        <div
          ref={addToRefs}
          className="flex flex-col lg:flex-row items-center gap-12"
        >
          <div className="flex-1 text-content">
            <p className="text-sm font-semibold leading-5 tracking-[4%] text-g-300 uppercase">
              AI Recommended Jobs
            </p>
            <h3 className="text-g-100 text-4xl leading-[44px] font-medium mt-5">
              Let AI scan your profile to find <br /> the right jobs for you
            </h3>
            <p className="text-g-200 text-xl font-medium leading-6 max-w-lg mt-5">
              AI scans your profile and key skills to instantly match you with
              relevant job opportunities, making your job search faster and
              smarter.
            </p>
            <button className="bg-primary text-white text-xl leading-6 font-medium py-4 px-8 rounded-lg mt-8">
              Explore recommended jobs
            </button>
          </div>
          <div className="flex-1 flex justify-end">
            <img
              src="/recruiter/Chat with Candidates.webp"
              alt="ai jobs"
              className="h-100 rounded-xl"
            />
          </div>
        </div>

        <div
          ref={addToRefs}
          className="flex flex-col-reverse lg:flex-row items-center gap-12"
        >
          <div className="flex-1 flex justify-start">
            <img
              src="/recruiter/Easy Job Posting.webp"
              alt="roadmap"
              className="h-100 rounded-xl"
            />
          </div>
          <div className="flex-1 text-content">
            <p className="text-sm font-semibold leading-5 tracking-[4%] text-g-300 uppercase">
              Personalized Roadmap
            </p>
            <h3 className="text-g-100 text-4xl leading-[44px] font-medium mt-5">
              Personalized Tips to Advance <br /> Your Career
            </h3>
            <p className="text-g-200 text-xl font-medium leading-6 max-w-lg mt-5">
              Instantly see what certifications, training, and projects will
              make you stand out for the exact role you want.
            </p>
            <button className="bg-primary text-white text-xl leading-6 font-medium py-4 px-8 rounded-lg mt-8">
              Show me the roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section3;
