import axios from "@/utils/axios";

export const generateResume = (data) =>
  axios.post(`/student/resume/generate`, data);

export const enhanceResumeSection = (data) =>
  axios.post(`/student/resume/enhance-section`, data);
