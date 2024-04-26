import { createSlice } from "@reduxjs/toolkit";
import { createPost, getPosts, likePost, unlikePost } from "./post.actions";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    // Define your reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
        state.loading = false;
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        // Handle rejected actions for all async thunk actions
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false; // Set loading to false for rejected actions
          state.error = action.error; // Set error message from action payload
        }
      );
  },
});

export default postSlice.reducer;
