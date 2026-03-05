
const BlogDetailSkeleton = () => {
  return (
    <div className="animate-pulse max-w-4xl mx-auto px-6 py-12">
      <div className="h-10 bg-g-300 rounded w-3/4 mb-6"></div>

      <div className="flex gap-4 mb-10">
        <div className="h-4 w-32 bg-g-300 rounded"></div>
        <div className="h-4 w-24 bg-g-300 rounded"></div>
      </div>

      <div className="space-y-4">
        <div className="h-4 bg-g-300 rounded"></div>
        <div className="h-4 bg-g-300 rounded"></div>
        <div className="h-4 bg-g-300 rounded w-5/6"></div>
        <div className="h-4 bg-g-300 rounded"></div>
        <div className="h-4 bg-g-300 rounded w-4/6"></div>
      </div>

      <div className="h-72 bg-g-300 rounded-xl mt-10"></div>
    </div>
  );
};

export default BlogDetailSkeleton;