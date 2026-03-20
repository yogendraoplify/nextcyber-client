import {
  getSuggestedMentorsApi,
  getSuggetededStudentsApi,
} from "@/services/dashboardApi";
import { setSuggestions } from "../slices/dashboardSlice";

// student
export const asyncGetSuggestedMentors =
  (params, setIsLoading) => async (dispatch) => {
    setIsLoading?.(true);
    try {
      const { data } = await getSuggestedMentorsApi(params);
      dispatch(setSuggestions(data.mentors));
    } catch (error) {
      console.error("Failed to fetch suggested mentors:", error);
    } finally {
      setIsLoading?.(false);
    }
  };

// company
export const asyncGetSuggestedStudents =
  (params, setIsLoading) => async (dispatch) => {
    setIsLoading?.(true);
    try {
      const { data } = await getSuggetededStudentsApi(params);
      dispatch(setSuggestions(data.students));
    } catch (error) {
      console.error("Failed to fetch suggested students:", error);
    } finally {
      setIsLoading?.(false);
    }
  };
