import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  companies: [],
  currentPage: 1,
};

export const companyReducer = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action) => {
      state.companies = action.payload.companies;
      state.currentPage = action.payload.page;
    },
    removeCompanies: (state) => {
      state.companies = [];
    },
  },
});

export const { setCompany, removeCompanies } = companyReducer.actions;
export default companyReducer.reducer;
