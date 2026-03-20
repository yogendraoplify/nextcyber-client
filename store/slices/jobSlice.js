import { createSlice, current } from "@reduxjs/toolkit";
const initialState = {
  jobs: [],
  jobsByAI: null,

  applications: [],
  totalApplicationsPages: null,
  totalJobsPages: null,
  appliedJob: [],
  currentJobPage: 1,
  statusCounts: {
    all: 0,
    applied: 0,
    under_review: 0,
    shortlisted: 0,
    interview_scheduled: 0,
    rejected: 0,
    hired: 0,
    withdrawn: 0,
  },
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
      state.currentJobPage = 1;
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
      state.statusCounts = {
        all: action.payload.statusCounts.ALL || 0,
        applied: action.payload.statusCounts.APPLIED || 0,
        under_review: action.payload.statusCounts.UNDER_REVIEW || 0,
        shortlisted: action.payload.statusCounts.SHORTLISTED || 0,
        interview_scheduled:
          action.payload.statusCounts.INTERVIEW_SCHEDULED || 0,
        rejected: action.payload.statusCounts.REJECTED || 0,
        hired: action.payload.statusCounts.HIRED || 0,
        withdrawn: action.payload.statusCounts.WITHDRAWN || 0,
      };
    },
    updateAppliedJobStatus: (state, action) => {
      const { applicationId, newStatus } = action.payload;
      const applicationIndex = state.applications.findIndex(
        (app) => app.id === applicationId,
      );
      if (applicationIndex !== -1) {
        state.applications[applicationIndex].status = newStatus;
      }
    },
    removeJobFromStatus: (state, action) => {
      const { applicationId } = action.payload;
      const applicationIndex = state.applications.findIndex(
        (app) => app.id === applicationId,
      );
      state.applications.splice(applicationIndex, 1);
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
  removeJobFromStatus,
} = jobReducer.actions;
export default jobReducer.reducer;
