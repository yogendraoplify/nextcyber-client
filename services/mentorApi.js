import axios from "@/utils/axios";

export const mentorOnboardingApi = (data) =>
  axios.post(`/mentor/onboarding`, data);
