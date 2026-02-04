import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errMessage";
import {
  addCandidateToFavoriteApi,
  findStudentsApi,
  getShortListedStudentsApi,
  removeCandidateFromFavoriteApi,
} from "@/api/candidateApi";
import {
  addToFavorite,
  removeFromFavorite,
  setCandidates,
  setShortlistedCandidates,
} from "../slices/candidateSlice";

export const asyncGetCandidates =
  (params, setIsLoading) => async (dispatch) => {
    setIsLoading?.(true);
    try {
      const { data } = await findStudentsApi(params);
      dispatch(setCandidates(data.data));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to fetch companies"));
    } finally {
      setIsLoading?.(false);
    }
  };

export const asyncShortlistedCandidates =
  (params, setIsLoading) => async (dispatch) => {
    setIsLoading?.(true);
    try {
      const { data } = await getShortListedStudentsApi(params);
      console.log(data);
      dispatch(setShortlistedCandidates(data));
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error, "Failed to shortlist candidate"));
    } finally {
      setIsLoading?.(false);
    }
  };

export const asyncAddCandidateToFavorite =
  (candidate, companyId, setIsLoading) => async (dispatch) => {
    setIsLoading?.(true);
    try {
      const toastId = toast.loading("Adding candidate to favorites...");
      const { data } = await addCandidateToFavoriteApi(candidate.id);
      toast.success(
        data.message || "Candidate added to favorites successfully!",
        { id: toastId },
      );
      dispatch(addToFavorite({ companyId, candidate }));
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to add candidate to favorites"),
      );
    } finally {
      setIsLoading?.(false);
    }
  };

export const asyncRemoveCandidateFromFavorite =
  (candidateId, companyId, setIsLoading) => async (dispatch) => {
    setIsLoading?.(true);
    try {
      const toastId = toast.loading("Removing candidate from favorites...");
      const { data } = await removeCandidateFromFavoriteApi(candidateId);
      dispatch(asyncShortlistedCandidates({ companyId }));
      toast.success(
        data.message || "Candidate removed from favorites successfully!",
        { id: toastId },
      );
      dispatch(removeFromFavorite({ companyId, candidateId }));
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to remove candidate from favorites"),
      );
    } finally {
      setIsLoading?.(false);
    }
  };
