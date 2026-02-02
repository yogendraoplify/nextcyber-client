import { createSlice, current } from "@reduxjs/toolkit";
const initialState = {
  jobs: [],
  jobsByAI: null,

  applications: [],
  totalApplicationsPages: null,
  totalJobsPages: null,
  appliedJob: [],
  currentJobPage: 1,
};

export const jobReducer = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload.jobs;
      state.totalJobsPages = action.payload.totalPages;
      state.currentJobPage = action.payload.page;
    },
    setJobsByAI: (state, action) => {
      state.jobsByAI = action.payload;
    },
    removeJobs: (state) => {
      state.jobs = [];
      state.totalJobsPages = null;
    },
    setAppliedJobs: (state, action) => {
      state.appliedJob = action.payload;
    },
    addAppliedJobs: (state, action) => {
      state.appliedJob.push(action.payload);
    },
    setApplications: (state, action) => {
      state.applications = action.payload.jobs;
      state.totalApplicationsPages = action.payload.totalPages;
    },
    updateAppliedJobStatus: (state, action) => {
      const { applicationId, newStatus } = action.payload;
      const applicationIndex = state.appliedJob.findIndex(
        (app) => app.id === applicationId
      );
      if (applicationIndex !== -1) {
        state.appliedJob[applicationIndex].status = newStatus;
      }
    },
  },
});

export const {
  setJobs,
  setAppliedJobs,
  addAppliedJobs,
  setApplications,
  removeJobs,
  setJobsByAI,
  updateAppliedJobStatus,
} = jobReducer.actions;
export default jobReducer.reducer;
