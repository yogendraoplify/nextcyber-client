import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  suggestions: [],
};

export const dashboardReducer = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
  },
});

export const { setSuggestions } = dashboardReducer.actions;
export default dashboardReducer.reducer;
