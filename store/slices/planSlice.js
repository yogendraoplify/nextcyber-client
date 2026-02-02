import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  plans: [],
};

export const planReducer = createSlice({
  name: "plan",
  initialState,
  reducers: {
    setPlans: (state, action) => {
      state.plans = action.payload;
    },
  },
});

export const { setPlans } = planReducer.actions;

export default planReducer.reducer;
