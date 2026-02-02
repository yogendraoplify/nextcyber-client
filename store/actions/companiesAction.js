import { getCompaniesApi } from "@/api/studentApi";
import { setCompany } from "../slices/companySlice";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errMessage";

export const asyncGetCompanies = (query, setIsLoading) => async (dispatch) => {
  setIsLoading?.(true);
  try {
    const { data } = await getCompaniesApi(query);

    dispatch(setCompany(data.companies));
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch companies"));
  } finally {
    setIsLoading?.(false);
  }
};
