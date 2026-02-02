import axios from "@/utils/axios";

export const getJobsApi = (params) =>
  axios.get("/student/find-jobs", { params });

export const getJobsByAIApi = (params) =>
  axios.get("/student/find-jobs-by-ai", { params });

export const jobApplyApi = (id) => axios.post(`/student/apply-job?jobId=${id}`);
export const appliedJobApi = () => axios.get(`/student/job-applications`);

export const companyjobApi = (params) =>
  axios.get(`/company/created-jobs`, { params });

export const jobApplicantsApi = (params) =>
  axios.get(`/company/created-job/job-applications`, { params });

export const updateApplicationStatusApi = (applicationId, newStatus) =>
  axios.patch(`/company/update-job-application-status?id=${applicationId}`, {
    status: newStatus,
  });
