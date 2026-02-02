import axios from "@/utils/axios";

export const recruiterOnboardingApi = (data) =>
  axios.post(`/company/onboarding`, data);
