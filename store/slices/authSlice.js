import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  isLoading: true,
};

export const authReducer = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    addJobs: (state, action) => {
      state.user.jobs.push(action.payload);
    },
    clearUser: (state) => {
      state.user = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, addJobs } = authReducer.actions;

export default authReducer.reducer;
