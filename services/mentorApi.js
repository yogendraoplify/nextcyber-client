import axios from "@/utils/axios";

export const mentorOnboardingApi = (data) =>
  axios.post(`/mentor/onboarding`, data);

export const mentorAvailabilityApi = () =>
  axios.get(`/mentor/availability-slots`);

export const mentorAvailabilityUpdateApi = (data) =>
  axios.patch(`/mentor/availability-slots`, data);

export const mentorAvailabilityCreateApi = (data) =>
  axios.post(`/mentor/availability-slot`, data);

export const mentorAvailabilityDeleteApi = (slotId) =>
  axios.delete(`/mentor/availability-slot?slotId=${slotId}`);
