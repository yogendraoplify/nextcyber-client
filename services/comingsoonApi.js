import axios from "@/utils/axios";

export const notifyLaunchApi = (data) => axios.post(`/coming-soon/notify-launch`, data);

export const accessRequestApi = (data) => axios.post(`/coming-soon/access-main-portal`, data);