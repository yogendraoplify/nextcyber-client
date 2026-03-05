import axios from "@/utils/axios";

export const getBlogsApi = (query) => {
  return axios.get("/blog/get-blogs", { params: query });
};


export const getBlogByIdApi = (id) => {
  return axios.get(`/blog/get-blog?id=${id}`);
};