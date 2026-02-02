import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    notifications: [],
    isLoading: false,
};

export const notificationReducer = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload; 
      state.isLoading = false;
    },
    removeNotifications: (state) => {
        state.notifications = [];
    },
    setLoading: (state, action) => {
        state.isLoading = action.payload;
    }
}
});

export const { setNotifications, removeNotifications, setLoading } = notificationReducer.actions;
export default notificationReducer.reducer;