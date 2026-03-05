import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  blogs: [],
 loading: false,

};

export const blogReducer = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { setBlogs, setLoading } = blogReducer.actions;

export default blogReducer.reducer;
