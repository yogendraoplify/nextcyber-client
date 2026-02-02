import { getCompanyPlansApi, getStudentPlansApi } from "@/api/planApi";
import { setPlans } from "../slices/planSlice";
import toast from "react-hot-toast";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

export const asyncGetStudentPlans = (setError) => async (dispatch) => {
  try {
    const { data } = await getStudentPlansApi();
    dispatch(setPlans(data.plans));
  } catch (error) {
    setError?.(getErrorMessage(error));
    toast.error(getErrorMessage(error));
  }
};

export const asyncGetCompanyPlans = (setError) => async (dispatch) => {
  try {
    const { data } = await getCompanyPlansApi();
    dispatch(setPlans(data.plans));
  } catch (error) {
    setError?.(getErrorMessage(error));
    toast.error(getErrorMessage(error));
  }
};
