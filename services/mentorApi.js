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

export const startWebinar = (webinarServiceId) =>
  axios.post(
    `/mentor/services/webinar/start-webinar?webinarServiceId=${webinarServiceId}`,
  );

export const joinWebinar = (webinarServiceId) =>
  axios.post(
    `/mentor/services/webinar/join-webinar?webinarServiceId=${webinarServiceId}`,
  );

export const joinSession = (sessionId) =>
  axios.post(`/mentor/services/one-to-one/join-session?sessionId=${sessionId}`);

export const endWebinar = (webinarServiceId) =>
  axios.post(
    `/mentor/services/webinar/end-webinar?webinarServiceId=${webinarServiceId}`,
  );

export const createOneToOneService = (data) =>
  axios.post(`/mentor/services/one-to-one`, data);

export const updateOneToOneService = (serviceId, data) =>
  axios.patch(`/mentor/services/one-to-one?serviceId=${serviceId}`, data);

export const createWebinarService = (data) =>
  axios.post(`/mentor/services/webinar`, data);

export const updateWebinarService = (serviceId, data) =>
  axios.patch(`/mentor/services/webinar?serviceId=${serviceId}`, data);

export const toggleMentorServiceStatus = (serviceId) =>
  axios.patch(`/mentor/service/toggle-service-status?serviceId=${serviceId}`);

export const getMentorServices = () => axios.get(`/mentor/services`);

export const getServicesStats = () => axios.get(`/mentor/services-stats`);

export const getWebinarBookings = (params) =>
  axios.get(`/mentor/services/webinar-registrations`, {
    params: params,
  });

export const getSessions = (params) =>
  axios.get(`/mentor/services/one-to-one-registrations`, {
    params: params,
  });

export const getSessionsStats = (params) =>
  axios.get(`/mentor/services/sessions-stats`, {
    params: params,
  });

export const getAllServices = (params) =>
  axios.get(`/mentor/browse`, {
    params: params,
  });
export const studentMentorServicesStats = (params) =>
  axios.get(`/mentor/student-mentor-services-stats`);

export const getAvailableSlots = (oneToOneServiceId, date) =>
  axios.get(`/mentor/services/one-to-one/service-slots`, {
    params: { oneToOneServiceId, date },
  });

export const bookSession = (payload) =>
  axios.post(`/mentor/services/one-to-one/book-session`, payload);

export const registerWebinar = (webinarServiceId) =>
  axios.post(
    `/mentor/services/webinar/register?webinarServiceId=${webinarServiceId}`,
  );

export const getMyBookings = (params) =>
  axios.get(`/mentor/student-one-to-one-bookings`, {
    params,
  });
export const getMyWebinarRegistrations = (params) =>
  axios.get(`/mentor/student-webinar-bookings`, {
    params,
  });

export const mentorshipApi = {
  getServiceById: (serviceId) => api.get(`/mentor-service/${serviceId}`),

  // ── My bookings ──────────────────────────────────────
  getMyBookings: (params) => api.get("/sessions/student", { params }),

  getMyWebinarRegistrations: (params) =>
    api.get("/webinar/student/registrations", { params }),
};
