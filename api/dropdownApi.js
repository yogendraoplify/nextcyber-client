import axios from "@/utils/axios";


export const getDropdownApi = (params) => axios.get("/system/dropdown-options", { params });