import SignIn from "@/screens/auth/SignIn";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin" size={48} />
        </div>
      }
    >
      <SignIn />
    </Suspense>
  );
};

export default Page;
