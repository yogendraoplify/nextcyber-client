import axios from "@/utils/axios";

export const getSuggetededStudentsApi = (params) =>
  axios.get(`/company/suggested-students`, { params });

export const getSuggestedMentorsApi = (params) =>
  axios.get(`/student/suggested-mentors`, { params });
export const getSuggestedMenteesApi = (params) =>
  axios.get(`/mentor/suggested-mentee`, { params });
