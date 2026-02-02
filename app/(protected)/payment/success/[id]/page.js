"use client";
import { verifyPaymentAPIHandler } from "@/store/actions/subscriptionAction";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const PaymentVerification = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const payload = {
      id: params.id,
    };
    dispatch(verifyPaymentAPIHandler(payload, setLoading));
  }, []);

  if (loading) {
    return (
      <div className=" h-[calc(100vh-60.67px)] flex justify-center items-center">
        <Loader2 className=" animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full bg-g-900">
      <div className="w-full p-5 flex flex-col gap-5 items-start">
        <p className="text-primary font-medium italic animate-pulse">
          Payment completed successfully!
        </p>
      </div>
    </div>
  );
};

export default PaymentVerification;
