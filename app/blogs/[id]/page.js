import BlogDetail from "@/components/blog/BlogDetail";
import BlogDetailSkeleton from "@/components/skeleton/BlogDetailSkeleton";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<BlogDetailSkeleton />}>
      <BlogDetail />
    </Suspense>
  );
};

export default page;
