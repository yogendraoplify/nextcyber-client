import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  collapseSidebar: false,
  notifications: [],
  notificationCount: 0,
};

export const appSettings = createSlice({
  name: "appSettings",
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      state.collapseSidebar = !state.collapseSidebar;
    },
    setNotifications: (state, action) => {
      state.notifications = [...state.notifications, action.payload];
      state.notificationCount += 1;
    },
  },
});

export const { toggleSidebar, setNotifications } = appSettings.actions;

export default appSettings.reducer;
