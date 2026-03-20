import {
  appliedJobApi,
  companyjobApi,
  getJobsApi,
  getJobsByAIApi,
  jobApplicantsApi,
  updateApplicationStatusApi,
} from "@/api/jobApi";
import {
  removeJobFromStatus,
  setApplications,
  setAppliedJobs,
  setJobs,
  setJobsByAI,
  updateAppliedJobStatus,
} from "../slices/jobSlice";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errMessage";

export const asyncGetJobs = (query, setIsLoading) => async (dispatch) => {
  setIsLoading?.(true);
  try {
    const { data } = await getJobsApi(query);
    dispatch(setJobs(data.data));
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch Jobs"));
  } finally {
    setIsLoading?.(false);
  }
};

export const asyncGetJobsByAI = (query, setIsLoading) => async (dispatch) => {
  setIsLoading?.(true);
  try {
    const { data } = await getJobsByAIApi(query);
    dispatch(setJobsByAI(data.matches));
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch Jobs"));
  } finally {
    setIsLoading?.(false);
  }
};

export const asyncGetAppliedJob = (query, setIsLoading) => async (dispatch) => {
  setIsLoading?.(true);
  try {
    const { data } = await appliedJobApi(query);
    dispatch(setAppliedJobs(data.data.applications));
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch Jobs"));
  } finally {
    setIsLoading?.(false);
  }
};

export const asyncGetCreatedJobs = (query, setLoading) => async (dispatch) => {
  setLoading?.(true);
  try {
    const { data } = await companyjobApi(query);
    dispatch(setJobs(data?.data));
    setLoading?.(false);
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch Jobs"));
    setLoading?.(false);
  }
};

export const asyncGetJobApplicants =
  (params, setIsLoading) => async (dispatch) => {
    setIsLoading?.(true);
    try {
      const { data } = await jobApplicantsApi(params);
      dispatch(setApplications(data.data));
      return data?.application || [];
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to fetch Applicants"));
      return [];
    } finally {
      setIsLoading?.(false);
    }
  };

export const asyncUpdateApplicationStatus =
  (applicationId, newStatus, label) => async (dispatch) => {
    try {
      await updateApplicationStatusApi(applicationId, newStatus);
      dispatch(updateAppliedJobStatus({ applicationId, newStatus }));
      if (label !== "") {
        console.log("Application status updated successfully", label);
        dispatch(removeJobFromStatus({ applicationId }));
      }
      toast.success("Application status updated successfully");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to update application status"),
      );
    }
  };
