import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  candidates: [],
  shortlistedCandidates: [],
  totalPages: 0,
  shortListingTotalPages: 0,
  candidateCurrentPage: 1,
  shortlistingCurrentPage: 1,
};

export const candidateReducer = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    setCandidates: (state, action) => {
      state.candidates = action.payload.students;
      state.totalPages = action.payload.pagination.totalPages;
      state.candidateCurrentPage = action.payload.pagination.page;
    },
    removeCandidates: (state) => {
      state.candidates = [];
      state.totalPages = 0;
    },
    setShortlistedCandidates: (state, action) => {
      state.shortlistedCandidates = action.payload.students;
      state.shortListingTotalPages = action.payload?.pagination?.totalPages || 1;
      state.shortlistingCurrentPage = action.payload?.pagination?.page || 1;
    },
    removeShortlistedCandidates: (state) => {
      state.shortlistedCandidates = [];
      state.shortListingTotalPages = 0;
    },
    addToFavorite: (state, action) => {
      const { companyId, candidate } = action.payload;
      state.candidates = state.candidates.map((c) =>
        c.id === candidate.id
          ? {
              ...c,
              favoritedBy: [
                ...c.favoritedBy,
                { company: { id: companyId } },
              ],
            }
          : c
      );

      state.shortlistedCandidates = [...state.shortlistedCandidates, {...candidate, favoritedBy: [...(candidate.favoritedBy || []), { company: { id: companyId } }]}];

    },
    removeFromFavorite: (state, action) => {
      const { companyId, candidateId } = action.payload;
      state.candidates = state.candidates.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              favoritedBy: candidate.favoritedBy.filter(
                (fav) => fav.company.id !== companyId
              ),
            }
          : candidate
      );
    },
  },
});

export const {
  setCandidates,
  setShortlistedCandidates,
  addToFavorite,
  removeFromFavorite,
  removeCandidates,
  removeShortlistedCandidates,
} = candidateReducer.actions;
export default candidateReducer.reducer;
