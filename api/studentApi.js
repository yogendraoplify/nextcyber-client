import axios from "@/utils/axios";

export const studentOnboardingApi = (data) =>
  axios.post(`/student/onboarding`, data);

export const updateStudentApi = (data) =>
  axios.patch("/student/update-profile", data);

export const getCompaniesApi = (params) =>
  axios.get("/student/find-companies", { params });
