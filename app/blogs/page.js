"use client";
import { timeFormatter } from "@/helper";
import { asyncGetBlogs } from "@/store/actions/blogAction";
import { setLoading } from "@/store/slices/blogSlice";
import {
  Camera,
  ChevronRight,
  CirclePlay,
  Eye,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Tag({ label }) {
  return (
    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
      #{label}
    </span>
  );
}

const BlogCardSkeleton = () => {
  return (
    <div className="bg-g-600 border border-white/10 rounded-xl overflow-hidden animate-pulse">
      {/* image */}
      <div className="h-40 bg-g-500 w-full"></div>

      <div className="p-4">
        {/* tags */}
        <div className="flex gap-2 mb-3">
          <div className="h-4 w-12 bg-g-500 rounded"></div>
          <div className="h-4 w-16 bg-g-500 rounded"></div>
        </div>

        {/* title */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-g-500 rounded"></div>
          <div className="h-4 bg-g-500 rounded w-5/6"></div>
        </div>

        {/* button */}
        <div className="h-8 bg-g-500 rounded"></div>
      </div>
    </div>
  );
};

function InsightCardImage({ image }) {
  return (
    <div className="relative w-full h-40 bg-g-500 flex items-center justify-center">
      <Image src={image?.url} alt="play-icon" fill />
    </div>
  );
}

export default function NextCybrInsights() {
  const { blogs, loading } = useSelector((state) => state.blog);
  const dispatch = useDispatch();
  const [featuredInsight, setFeaturedInsight] = useState(null);

  useEffect(() => {
    if (blogs?.length === 0) dispatch(asyncGetBlogs());
  }, [dispatch]);

  useEffect(() => {
    if (blogs?.length > 0) {
      setFeaturedInsight(blogs[0]);
    }
  }, [blogs]);

  return (
    <div className="min-h-screen text-g-50 font-sans">
      {/* <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <span className="font-bold text-g-50 text-base tracking-wide">
            NextCybr
          </span>
          <span className="text-g-100 text-sm ml-2">{activeNav}</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-600 overflow-hidden border-2 border-g-200">
          <div className="w-full h-full bg-gradient-to-br from-g-200 to-g-400 flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </nav> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="mb-10">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-g-50 leading-tight mb-3">
                Industry Insights by NextCybr
              </h1>
              <p className="text-g-100 text-base mb-2">
                Real conversations with cyber security professionals. Real
                career advice.
              </p>
              <p className="text-g-200 text-sm max-w-xl mb-6">
                Weekly short interviews with industry professionals sharing
                real-world insights on breaking into cyber security,
                certifications, skills employers look for, and career growth.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-primary hover:bg-primary-dark text-g-50 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors duration-200">
                  Join the Community
                </button>
                <button className="border border-gray-600 hover:border-g-100 text-g-50 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors duration-200 bg-transparent">
                  Watch Latest Insight
                </button>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-lg font-bold text-g-50 mb-4">
                Featured Insight
              </h2>
              <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden border border-white/10 bg-g-600">
                <div className="relative sm:w-80 w-full flex-shrink-0 bg-g-500 flex items-center justify-center p-6 min-h-48">
                    <Image
                      src={featuredInsight?.blogImage?.url}
                      alt="play-icon"
                      fill
                      className="object-cover rounded-lg"
                    />
                </div>

                <div className="flex-1 p-6 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {featuredInsight?.tags?.map((t) => (
                      <Tag key={t} label={t} />
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-g-50 mb-3 leading-snug">
                    {featuredInsight?.title}
                  </h3>
                  <p className="text-g-100 text-sm mb-1">
                    {featuredInsight?.author}
                  </p>
                  <p className="text-g-200 text-sm mb-1">
                    {featuredInsight?.role}
                  </p>
                  <p className="text-g-200 text-xs mb-5">
                    {timeFormatter(featuredInsight?.createdAt)}
                  </p>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-g-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                      <CirclePlay size={16} /> Watch
                    </button>
                    <button className="flex items-center gap-2 border border-gray-600 hover:border-g-100 text-g-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors bg-transparent">
                      <MessageSquare size={16} /> View Discussion
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-g-50 mb-4">All Insights</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <BlogCardSkeleton key={i} />
                  ))
                ) : blogs?.length === 0 ? (
                  <p className="text-g-200 text-sm">No insights available.</p>
                ) : (
                  blogs?.map((insight) => (
                    <Link
                      href={`/blogs/${insight.id}`}
                      key={insight.id}
                      className="bg-g-600 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors duration-200 flex flex-col cursor-pointer"
                    >
                      <InsightCardImage image={insight.blogImage} />

                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {insight.tags.map((t) => (
                            <Tag key={t} label={t} />
                          ))}
                        </div>

                        <h3 className="text-sm font-bold text-g-50 leading-snug mb-4 flex-1">
                          {insight.title}
                        </h3>

                        <button className="w-full flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-g-50 text-xs font-semibold py-2 rounded-lg transition-colors bg-transparent">
                          <CirclePlay size={13} /> Watch Insight
                        </button>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-64 w-full flex-shrink-0">
            <div className="bg-g-600 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 text-g-100">
                  <Camera size={20} />
                </div>
                <h3 className="font-bold text-g-50 text-sm">
                  Recommended For You
                </h3>
              </div>
              <p className="text-g-200 text-xs mb-3">
                Because you're interested in blue team roles, we recommend these
                insights:
              </p>
              <div className="flex items-center justify-between hover:bg-white/5 rounded-lg p-2 -mx-2 cursor-pointer transition-colors">
                <div className="flex-1">
                  <p className="text-g-50 text-xs font-semibold leading-snug mb-1">
                    From Help Desk to Security Analyst: A Real Story
                  </p>
                  <p className="text-g-200 text-xs">Ben Carter</p>
                </div>
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
