"use client";
import { jobApplyApi } from "@/api/jobApi";
import { addAppliedJobs } from "@/store/slices/jobSlice";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch } from "react-redux";

export default function JobApplyModel({ isOpen, onClose, id }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const applyJob = async () => {
    setLoading(true);
    try {
      const { data } = await jobApplyApi(id);
      dispatch(addAppliedJobs(data.data));
      toast.success(data.message);
      setLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to apply job");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/40 backdrop-blur-[2px] flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-[10px] border border-border shadow px-5 py-10 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text hover:text-red-500 transition"
        >
          <AiOutlineClose size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-center text-primary text-heading-secondary">
          Apply Job
        </h2>

        <p className="text-center text-base text-text text-g-900">
          Please confirm that you&apos;d like to apply for this job.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-3 rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={applyJob}
            disabled={loading}
            className="px-4 py-3 rounded-md bg-primary text-white  transition flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Applying...
              </>
            ) : (
              "Apply"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
