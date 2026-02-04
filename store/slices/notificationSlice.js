import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  notifications: [],
  totalPages: 1,
  isLoading: false,
};

export const notificationReducer = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload.data;
      state.totalPages = action.payload.pagination.totalPages;
      state.isLoading = false;
    },
    removeNotifications: (state) => {
      state.notifications = [];
      state.totalPages = 1;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setNotifications, removeNotifications, setLoading } =
  notificationReducer.actions;
export default notificationReducer.reducer;
