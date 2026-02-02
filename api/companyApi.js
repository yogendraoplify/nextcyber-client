import axios from "@/utils/axios";

export const getCompanyProfileApi = (id) =>
  axios.get(`/student/company-profile?id=${id}`);

export const updateCompanyApi = (data) =>
  axios.patch("/company/update-profile", data);
