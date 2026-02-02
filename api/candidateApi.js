import axios from "@/utils/axios";

export const findStudentsApi = (params) =>
  axios.get("/company/find-students", { params });

export const getShortListedStudentsApi = (params) =>
  axios.get("/company/shortlisted", { params });

export const addCandidateToFavoriteApi = (candidateId) =>
  axios.post(`/company/shortlisted?studentId=${candidateId}`);

export const removeCandidateFromFavoriteApi = (candidateId) =>
  axios.delete(`/company/shortlisted?studentId=${candidateId}`);