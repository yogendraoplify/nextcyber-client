"use client";

import { getBlogByIdApi } from "@/services/blogApi";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import BlogDetailSkeleton from "../skeleton/BlogDetailSkeleton";

const BlogDetail = () => {
  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const fetchBlog = async (id) => {
    try {
      const { data } = await getBlogByIdApi(id);
      setBlog(data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) fetchBlog(params.id);
  }, [params]);

  if (loading) return <BlogDetailSkeleton />;

  return (
    <div className="min-h-screen">
      
      <div className="max-w-4xl mx-auto px-6 pt-14 pb-8">
        <h1 className="text-4xl font-bold leading-tight">
          {blog?.title}
        </h1>

        <div className="flex items-center gap-4 mt-4 text-gray-500 text-sm">
          <span>
            {new Date(blog?.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>


      <div className="max-w-4xl mx-auto px-6 mb-16">
        <article
          className="prose prose-lg max-w-none
          prose-headings:text-gray-900
          prose-p:text-gray-700
          prose-img:rounded-xl
          prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: blog?.body }}
        />
      </div>
    </div>
  );
};

export default BlogDetail;