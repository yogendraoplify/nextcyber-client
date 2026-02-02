import axios from "@/utils/axios";

export const getStudentNotificationsApi = (query) => {
  return axios.get("/student/notifications", { params: query });
};

export const getCompanyNotificationsApi = (query) => {
  return axios.get("/company/notifications", { params: query });
};

export const markStudentNotificationAsReadApi = (notificationId) => {
  return axios.patch(`/student/mark-all-notification-as-read`);
};

export const markCompanyNotificationAsReadApi = (notificationId) => {
  return axios.patch(`/company/mark-all-notification-as-read`);
};
