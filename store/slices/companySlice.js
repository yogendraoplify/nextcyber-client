import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  companies: [],
  currentPage: 1,
  totalPages: null,
};

export const companyReducer = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action) => {
      state.companies = action.payload.companies;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.totalPages;
    },
    removeCompanies: (state) => {
      state.companies = [];
      state.currentPage = 1;
      state.totalPages = null;
    },
  },
});

export const { setCompany, removeCompanies } = companyReducer.actions;
export default companyReducer.reducer;
