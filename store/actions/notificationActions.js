
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errMessage";
import { getCompanyNotificationsApi, getStudentNotificationsApi, markCompanyNotificationAsReadApi, markStudentNotificationAsReadApi } from "@/services/notificationApi";
import { setLoading, setNotifications } from "../slices/notificationSlice";
export const asyncGetStudentNotifications = (query) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await getStudentNotificationsApi(query);
    dispatch(setNotifications(data.data));
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch Notifications"));
  } 
};


export const asyncGetCompanyNotifications = (query) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await getCompanyNotificationsApi(query);
    dispatch(setNotifications(data.data));
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch Notifications"));
  }
};

export const asyncMarkStudentNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    await markStudentNotificationAsReadApi(notificationId);
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to mark notification as read"));
  }
};


export const asyncMarkCompanyNotificationAsRead = (notificationId) => async (dispatch) => {
    try {
     await markCompanyNotificationAsReadApi(notificationId);
    } catch (error) {
        toast.error(getErrorMessage(error, "Failed to mark notification as read"));
    }
};