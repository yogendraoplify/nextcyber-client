import { getBlogsApi } from "@/services/blogApi";
import { setBlogs, setLoading } from "../slices/blogSlice";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

export const asyncGetBlogs = (query, setError) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await getBlogsApi(query);
    dispatch(setBlogs(data.data));
  } catch (error) {
    setError?.(getErrorMessage(error));
  } finally {
    dispatch(setLoading(false));
  }
};
