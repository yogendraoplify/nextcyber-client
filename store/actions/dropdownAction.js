import { getDropdownApi } from "@/api/dropdownApi";
import { getErrorMessage } from "@/utils/errMessage";
import {
  setRolesInCompanyDropdown,
  setSectorDropdown,
  setSkillsDropdown,
} from "../slices/dropdownSlice";
import toast from "react-hot-toast";

export const asyncGetDropdown = (query, setIsLoading) => async (dispatch) => {
  setIsLoading?.(true);
  try {
    const { data } = await getDropdownApi(query);
    if (query.name === "industries") {
      dispatch(setSectorDropdown(data.data.options));
    }
    if (query.name === "skills" || data.data.name === "skills") {
      dispatch(setSkillsDropdown(data.data.options));
    }

    if (
      query.name === "rolesInCompany" ||
      data.data.name === "rolesInCompany"
    ) {
      dispatch(setRolesInCompanyDropdown(data.data.options));
    }
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch Jobs"));
  } finally {
    setIsLoading?.(false);
  }
};
