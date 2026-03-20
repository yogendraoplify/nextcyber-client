import axios from "@/utils/axios";

export const notifyLaunchApi = (data) => axios.post(`/coming-soon/notify-launch`, data);