import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  sectorDropdown: [],
  skillsDropdown: [],
  rolesInCompanyDropdown: [],
};

export const dropdownReducer = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    setSectorDropdown: (state, action) => {
      state.sectorDropdown = action.payload;
    },
   removeSectorDropdown: (state) => {
      state.sectorDropdown = [];
    },
    setSkillsDropdown: (state, action) => {
      state.skillsDropdown = action.payload;
    },
   removeSkillsDropdown: (state) => {
      state.skillsDropdown = [];
    },
    setRolesInCompanyDropdown : (state, action) => {
      state.rolesInCompanyDropdown = action.payload;
    },
  removeRolesInCompanyDropdown : (state) => {
      state.rolesInCompanyDropdown = [];
    },
  },
});

export const { setSectorDropdown, removeSectorDropdown, setSkillsDropdown, removeSkillsDropdown, setRolesInCompanyDropdown, removeRolesInCompanyDropdown } = dropdownReducer.actions;
export default dropdownReducer.reducer;