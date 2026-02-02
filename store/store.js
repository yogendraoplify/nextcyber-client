import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice.js";
import plans from "./slices/planSlice.js";
import jobs from "./slices/jobSlice.js";
import companies from "./slices/companySlice.js";
import appSettings from "./slices/appSettingsSlice.js";
import candidate from "./slices/candidateSlice.js";
import dropdown from "./slices/dropdownSlice.js";
import notification from "./slices/notificationSlice.js";

export const store = configureStore({
  reducer: { auth, plans, jobs, companies, appSettings, candidate, dropdown, notification },
});
