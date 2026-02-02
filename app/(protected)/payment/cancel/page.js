import React from "react";

const page = () => {
  return (
    <div className="w-full bg-g-900">
      <div className="w-full p-5 flex flex-col gap-5 items-start">
        <p className="text-primary font-medium italic animate-pulse">
          Payment failed! please try again.
        </p>
      </div>
    </div>
  );
};

export default page;
