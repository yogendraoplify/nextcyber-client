"use client";
import { ArrowRight, MailIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BiLogoInstagram, BiLogoLinkedin, BiLogoTwitter } from "react-icons/bi";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format");
      return;
    }
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <footer className="w-full bg-[radial-gradient(69.34%_100%_at_50%_0%,rgba(2,91,207,0.32)_0%,rgba(7,8,10,0.4)_40%)] bg-[#07080A] border-t border-[#2F3031]">
      <div className=" relative flex flex-col items-start pt-20 px-5 sm:px-10 lg:px-20 pb-0 gap-15 w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-y-8 xl:gap-y-0 md:gap-x-8 justify-between w-full">
          <div className="col-span-1">
            <Link href={"/"}>
              <Image
                src="/logo.png"
                className=" h-9 w-auto mb-5.5"
                height={72}
                width={329}
                alt="nextcybr-logo"
              />
            </Link>

            <p className="text-g-200 text-sm mb-5 leading-4 max-w-3xs">
              Where tech founders hire great developers really fast.
            </p>
            <div className="flex space-x-4">
              <Link
                href=""
                className=" bg-gradient-to-b from-[#1A1A1A] to-[#1A1A1A00] p-2 rounded-full "
                aria-label="LinkedIn"
              >
                <BiLogoLinkedin size={24} />
              </Link>
              <Link
                href=""
                className="bg-gradient-to-b from-[#1A1A1A] to-[#1A1A1A00] p-2 rounded-full  "
                aria-label="Instagram"
              >
                <BiLogoInstagram size={24} />
              </Link>
              <Link
                href=""
                className="bg-gradient-to-b from-[#1A1A1A] to-[#1A1A1A00] p-2 rounded-full  "
                aria-label="Twitter"
              >
                <BiLogoTwitter size={24} />
              </Link>
            </div>
          </div>

          {/* Website Links */}
          <div className="grid grid-cols-2 col-span-2 gap-8">
            <div>
              <h3 className="text-g-100 font-medium mb-5 text-base leading-4 uppercase">
                WEBSITE
              </h3>
              <ul className="space-y-3">
                {[
                  "Freelancer",
                  "Candidate",
                  "Company",
                  "Mentorship",
                  "About Us",
                ].map((link) => (
                  <li key={link}>
                    <Link
                      href=""
                      className="text-g-200 hover:text-white transition-colors duration-200 text-sm  hover:underline"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-g-100 font-medium mb-5 text-base leading-4 uppercase">
                RESOURCES
              </h3>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms Of Use", "Blogs", "Events"].map(
                  (link) => (
                    <li key={link}>
                      <Link
                        href=""
                        className="text-g-200 hover:text-white transition-colors duration-200 text-sm hover:underline"
                      >
                        {link}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-g-100 font-medium mb-5 text-base leading-4 uppercase">
              SIGN UP
            </h3>
            <div className="flex items-center mb-6 text-g-200 whitespace-nowrap">
              <MailIcon size={18} className=" shrink-0" />
              <span className="ml-2 text-sm">
                Email us for updates and offer
              </span>
            </div>
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className="w-full border border-[#1B1C1E] px-4 py-3 pr-12 text-white placeholder-g-200 focus:outline-none focus:ring-2 focus:ring-[#025BCF] focus:border-[#025BCF] transition-colors duration-200 text-sm"
                required
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#1B1C1E] p-3.5 transition-colors duration-200 group"
                aria-label="Submit email"
              >
                <ArrowRight
                  size={16}
                  className="text-[#6A6B6C] group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#1F1F1F] w-full py-6 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center text-g-200 text-sm leading-6">
            <div className=" mb-4 md:mb-0">
              ©2025 NextCybr. All Rights Reserved.
            </div>
            <div className="flex space-x-2.5 sm:space-x-5">
              {[
                { name: "Privacy Policy", url: "/privacy-policy" },
                { name: "Terms & Conditions", url: "/terms-and-conditions" },
                { name: "Cookie Policy", url: "/cookie-policy" },
              ].map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="hover:text-white transition-colors duration-200 whitespace-nowrap hover:underline"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
